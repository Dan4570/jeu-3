// Configuration du jeu
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Variables du joueur
const player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 60,
    width: 40,
    height: 40,
    speed: 7,  // Augmenter la vitesse du joueur
    lives: 3  // Ajout de vies
};

// Variables des projectiles
let bullets = [];
const bulletSpeed = 7;

// Variables des cibles
let targets = [];
const targetSpeed = 2;
const targetSpawnRate = 1000; // en millisecondes

// Variables du jeu
let gameRunning = true;

// Fonction pour dessiner le joueur
function drawPlayer() {
    ctx.fillStyle = '#ff66b2'; // Rose pour le joueur
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Fonction pour dessiner les projectiles
function drawBullets() {
    ctx.fillStyle = '#ff3385'; // Rose vif pour les projectiles
    bullets.forEach((bullet, index) => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y -= bulletSpeed;
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

// Fonction pour dessiner les cibles
function drawTargets() {
    ctx.fillStyle = '#ff80bf'; // Rose moyen pour les cibles
    targets.forEach((target, index) => {
        ctx.fillRect(target.x, target.y, target.width, target.height);
        target.y += targetSpeed;
        if (target.y > canvas.height) {
            targets.splice(index, 1);
            player.lives--;  // Perdre une vie quand une cible atteint le bas
            if (player.lives === 0) {
                gameOver();
            }
        }
    });
}

// Fonction pour dessiner les vies
function drawLives() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Vies: " + player.lives, 10, 30);
}

// Fonction de collision
function checkCollisions() {
    bullets.forEach((bullet, bIndex) => {
        targets.forEach((target, tIndex) => {
            if (
                bullet.x < target.x + target.width &&
                bullet.x + bullet.width > target.x &&
                bullet.y < target.y + target.height &&
                bullet.height + bullet.y > target.y
            ) {
                bullets.splice(bIndex, 1);
                targets.splice(tIndex, 1);
            }
        });
    });
}

// Mouvement du joueur
function movePlayer(direction) {
    if (direction === 'left' && player.x > 0) {
        player.x -= player.speed;
    }
    if (direction === 'right' && player.x + player.width < canvas.width) {
        player.x += player.speed;
    }
}

// Fonction pour tirer
function shoot() {
    bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 10
    });
}

// Génération des cibles
function spawnTarget() {
    const targetWidth = 40;
    const targetHeight = 40;
    const targetX = Math.random() * (canvas.width - targetWidth);
    targets.push({
        x: targetX,
        y: 0,
        width: targetWidth,
        height: targetHeight
    });
}

// Fonction Game Over
function gameOver() {
    gameRunning = false;
    document.getElementById('gameOverScreen').style.display = 'block';
}

// Fonction pour redémarrer le jeu
function restartGame() {
    player.lives = 3;
    bullets = [];
    targets = [];
    gameRunning = true;
    document.getElementById('gameOverScreen').style.display = 'none';
    gameLoop();
}

// Boucle principale du jeu
function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessin des éléments
    drawPlayer();
    drawBullets();
    drawTargets();
    drawLives();

    // Vérifier les collisions
    checkCollisions();

    // Mise à jour du jeu
    requestAnimationFrame(gameLoop);
}

// Écouteurs d'événements pour les contrôles
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') {
        movePlayer('left');
    } else if (e.code === 'ArrowRight') {
        movePlayer('right');
    } else if (e.code === 'Space') {
        shoot();
    }
});

// Démarrage du jeu
gameLoop();
setInterval(spawnTarget, targetSpawnRate);
