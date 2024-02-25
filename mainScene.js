// En mainScene.js

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.score = 0;
        this.scoreText = null;
        this.starCounter = null;
        this.gameOver = false;
        this.timeLimitInSeconds = 30;
        this.timerEvent = null;
        this.player = null;  // Agrega una variable para almacenar el objeto player
        this.cursors = null;  // Agrega una variable para almacenar los cursores
        this.stars = null;  // Agrega una variable para almacenar las estrellas
        this.bombs = null;  // Agrega una variable para almacenar las bombas
    }

    preload() {
        // Carga los recursos necesarios para el juego principal
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {
        // Configura la escena del juego
        this.add.image(400, 300, 'sky');
    
        const platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');
    
        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);
    
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
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
            repeat: -1,
        });
    
        this.physics.add.collider(this.player, platforms);
        this.cursors = this.input.keyboard.createCursorKeys();
    
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 },
        });
    
        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
    
        this.physics.add.collider(this.stars, platforms);
    
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
    
        // Contenedor para el contador de estrellas
        const starCounterContainer = document.createElement('div');
        starCounterContainer.id = 'star-count-container';
    
        // Nuevo contador de estrellas como un componente web
        this.starCounter = document.createElement('p');
        this.starCounter.id = 'star-count';
        this.starCounter.textContent = 'Score: ' + this.score;
    
        // Añade el contador al contenedor
        starCounterContainer.appendChild(this.starCounter);

        // Inserta el contenedor en la escena del juego
    this.add.dom(400, 50, starCounterContainer); // Ajusta la posición según tus necesidades
    
        // Inserta el contenedor en el DOM
        document.body.appendChild(starCounterContainer);
    
        this.bombs = this.physics.add.group();
        this.physics.add.collider(this.bombs, platforms);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
    
        // Inicia el temporizador
        this.timerEvent = this.time.delayedCall(this.timeLimitInSeconds * 1000, this.gameOverTimeout, [], this);
   
    }
    


    update() {
        if (this.gameOver) {
            return;
        }

        if (this.player) {
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-160);
                this.player.anims.play('left', true);
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(160);
                this.player.anims.play('right', true);
            } else {
                this.player.setVelocityX(0);
                this.player.anims.play('turn');
            }

            if (this.cursors.up.isDown && this.player.body.touching.down) {
                this.player.setVelocityY(-330);
            }
        }
    }

    collectStar(player, star) {
        star.disableBody(true, true);
    
        this.score += 10;
        this.starCounter.textContent = 'Score: ' + this.score;
    
        const stars = this.stars.getChildren(); // Obtén todas las estrellas
        if (stars.every(star => !star.active)) {
            // Reinicia las estrellas solo si ninguna está activa
            stars.forEach(star => star.enableBody(true, star.x, 0, true, true));
    
            // Reinicia el temporizador solo si no se ha detenido por el game over
            if (!this.gameOver) {
                this.timerEvent.reset({ delay: this.timeLimitInSeconds * 1000, callback: this.gameOverTimeout, args: [], callbackScope: this });
            }
    
            const x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            const bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }
    
    

    hitBomb(player, bomb) {
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.player.anims.play('turn');
        this.gameOver = true;
        this.showGameOverMessage();
    }

    showGameOverMessage() {
        // Lógica para mostrar el mensaje de Game Over
        const gameOverDiv = document.createElement('div');
    
        const gameOverText = document.createElement('p');
        gameOverText.textContent = 'Game Over!';
        gameOverText.style.fontSize = '32px';
        gameOverText.style.fontFamily = "'Press Start 2P', cursive";
        gameOverDiv.appendChild(gameOverText);
    
        const retryText = document.createElement('p');
        retryText.textContent = '¡Lo harás mejor a la próxima!';
        gameOverDiv.appendChild(retryText);
    
        const yesButton = document.createElement('button');
        yesButton.textContent = 'Volver al inicio';
        yesButton.onclick = () => {
            location.reload();
        };
    
        gameOverDiv.appendChild(yesButton);
    
        gameOverDiv.classList.add('game-over-message');
        document.body.appendChild(gameOverDiv);
    }
    

    gameOverTimeout() {
        this.physics.pause();
        if (this.score >= 100) {
            console.log('¡Éxito! Has superado el límite de tiempo.');
        } else {
            console.log('¡Fracaso! Se acabó el tiempo.');
        }
        this.showGameOverMessage();
    }
}

