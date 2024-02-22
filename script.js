// Elimina esta línea:
// const Phaser = require("phaser");

var score = 0;
var scoreText;
var gameOver = false;
var timeLimitInSeconds = 10; // Establece el límite de tiempo en segundos

setTimeout(function () { gameOver = true; game.destroy(); showGameOverMessage(); }, 30000);

function showGameOverMessage() {
    // Crea un div para el mensaje de Game Over
    var gameOverDiv = document.createElement('div');

    // Crea el primer párrafo para "Game Over!" en fuente más grande y estilo de videojuego
    var gameOverText = document.createElement('p');
    gameOverText.textContent = "Game Over!";
    gameOverText.style.fontSize = '32px'; // Ajusta el tamaño de la fuente
    gameOverText.style.fontFamily = "'Press Start 2P', cursive"; // Utiliza la fuente de videojuego
    gameOverDiv.appendChild(gameOverText);

    // Crea el segundo párrafo para "¿Quieres volver a intentarlo?" en letra y fuente normales
    var retryText = document.createElement('p');
    retryText.textContent = "¿Quieres volver a intentarlo?";
    gameOverDiv.appendChild(retryText);

    // Crea el botón "Sí" y establece su acción
    var yesButton = document.createElement('button');
    yesButton.textContent = "Sí";
    yesButton.onclick = function () {
        // Reinicia el juego al recargar la página
        location.reload();
    };

    // Crea el botón "No" y establece su acción
    var noButton = document.createElement('button');
    noButton.textContent = "No";
    noButton.onclick = function () {
        // Aquí puedes manejar otra lógica según la elección del usuario.
        // Por ejemplo, cerrar el juego o realizar alguna otra acción.
        // Puedes definir tu propia lógica aquí.
        console.log("Usuario ha elegido 'No'. Puedes manejar esta lógica aquí.");
    };

    // Agrega los botones al div
    gameOverDiv.appendChild(yesButton);
    gameOverDiv.appendChild(noButton);

    // Asigna una clase al div para aplicar estilos desde el CSS
    gameOverDiv.classList.add('game-over-message');

    // Agrega el div al cuerpo del documento
    document.body.appendChild(gameOverDiv);
}




if(gameOver == false)
{
    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics:{
            default: 'arcade',
            arcade: {
                gravity: { y: 300},
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
            
        }
    };
    var game = new Phaser.Game(config);
    
}
else
{
    console.log(score + " puntos");
}


function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    this.add.image(400, 300, 'sky');
    
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100, 450, 'dude');
    player.setCollideWorldBounds(true);
    player.setBounce(0.2);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1 
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20,
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1 
    });

    this.physics.add.collider(player, platforms);
    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function(child){
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(stars, platforms);

    this.physics.add.overlap(player, stars, collectStar, null, this);

    scoreText= this.add.text(16, 16, 'Score: '+ score, { fontSize: '32px', fill: '#000' });

    bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);

    // Agrega un temporizador para la cuenta atrás usando el propio sistema de eventos de Phaser
//     this.time.addEvent({
//         delay: timeLimitInSeconds * 1000,
//         callback: gameOverTimeout,
//         callbackScope: this
//     });
 }

function update() {
    if (gameOver) {
        return;
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

function collectStar(player, star) {
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: '+ score);

    if (stars.countActive(true) === 0) {
        stars.children.iterate(function(child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        // Reinicia el temporizador
        // this.time.delayedCall(timeLimitInSeconds * 1000, gameOverTimeout, [], this);

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        var bomb = bombs.create(x, 16, 'bomb'); 
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
}

function hitBomb(player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
    showGameOverMessage();
}

function showGameOverMessage() {
    // Crea un div para el mensaje de Game Over
    var gameOverDiv = document.createElement('div');

    // Crea el primer párrafo para "Game Over!" en fuente más grande y estilo de videojuego
    var gameOverText = document.createElement('p');
    gameOverText.textContent = "Game Over!";
    gameOverText.style.fontSize = '32px'; // Ajusta el tamaño de la fuente
    gameOverText.style.fontFamily = "'Press Start 2P', cursive"; // Utiliza la fuente de videojuego
    gameOverDiv.appendChild(gameOverText);

    // Crea el segundo párrafo para "¿Quieres volver a intentarlo?" en letra y fuente normales
    var retryText = document.createElement('p');
    retryText.textContent = "¿Quieres volver a intentarlo?";
    gameOverDiv.appendChild(retryText);

    // Crea el botón "Sí" y establece su acción
    var yesButton = document.createElement('button');
    yesButton.textContent = "Sí";
    yesButton.onclick = function () {
        // Reinicia el juego al recargar la página
        location.reload();
    };

    // Crea el botón "No" y establece su acción
    var noButton = document.createElement('button');
    noButton.textContent = "No";
    noButton.onclick = function () {
        // Aquí puedes manejar otra lógica según la elección del usuario.
        // Por ejemplo, cerrar el juego o realizar alguna otra acción.
        // Puedes definir tu propia lógica aquí.
        console.log("Usuario ha elegido 'No'. Puedes manejar esta lógica aquí.");
    };

    // Agrega los botones al div
    gameOverDiv.appendChild(yesButton);
    gameOverDiv.appendChild(noButton);

    // Asigna una clase al div para aplicar estilos desde el CSS
    gameOverDiv.classList.add('game-over-message');

    // Agrega el div al cuerpo del documento
    document.body.appendChild(gameOverDiv);
}

// function gameOverTimeout() {
//     this.physics.pause();
//     if (score >= 100) {
//         console.log("¡Éxito! Has superado el límite de tiempo.");
//     } else {
//         console.log("¡Fracaso! Se acabó el tiempo.");
//     }
// }
