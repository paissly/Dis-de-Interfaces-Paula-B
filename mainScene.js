// En mainScene.js

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.score = 0;
        this.scoreText = null;
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

        this.scoreText = this.add.text(16, 16, 'Score: ' + this.score, { fontSize: '32px', fill: '#000' });

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
        this.scoreText.setText('Score: ' + this.score);

        const stars = this.physics.world.heroes;
        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });

            // Reinicia el temporizador
            this.timerEvent.reset({ delay: this.timeLimitInSeconds * 1000, callback: this.gameOverTimeout, args: [], callbackScope: this });

            const x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
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
        retryText.textContent = '¿Quieres volver a intentarlo?';
        gameOverDiv.appendChild(retryText);

        const yesButton = document.createElement('button');
        yesButton.textContent = 'Sí';
        yesButton.onclick = () => {
            location.reload();
        };

        const noButton = document.createElement('button');
        noButton.textContent = 'No';
        noButton.onclick = () => {
            console.log("Usuario ha elegido 'No'. Puedes manejar esta lógica aquí.");
        };

        gameOverDiv.appendChild(yesButton);
        gameOverDiv.appendChild(noButton);

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

