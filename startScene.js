// En startScene.js

class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        // Carga la imagen de fondo para la pantalla de inicio
        this.load.image('background', 'assets/sky.png');
    }

    create() {
        // Configura la pantalla de inicio con una imagen de fondo
        const background = this.add.image(400, 300, 'background').setDisplaySize(800, 600); // Ajusta el tamaño según tus necesidades

        const titleText = this.add.text(400, 150, 'COUNTSTARS', {
            fontSize: '48px',
            fill: '#000',
            fontFamily: "'Press Start 2P', cursive",
        }).setOrigin(0.5);

        // Agrega un botón para mostrar las instrucciones
        const instructionsButton = this.add.text(400, 300, 'Instrucciones', {
            fontSize: '24px',
            fill: '#ffA500', // Cambia el color a naranja (formato hexadecimal)
            fontFamily: "'Press Start 2P', cursive",
        })
        .setInteractive()
        .on('pointerdown', function () {
            // Muestra el cuadro de instrucciones al hacer clic en el botón
            instructionsBackground.setVisible(true);
            instructionsText.setVisible(true);
        })
        .setOrigin(0.5);

        // Agrega un botón para iniciar el juego
        const playButton = this.add.text(400, 400, 'Jugar', {
            fontSize: '32px',
            fill: '#ffA500', // Cambia el color a naranja (formato hexadecimal)
            fontFamily: "'Press Start 2P', cursive",
        })
        .setInteractive()
        .on('pointerdown', function () {
            // Inicia la escena del juego cuando se hace clic en el botón "Jugar"
            this.scene.start('MainScene');
        }, this)
        .setOrigin(0.5);

        // Agrega un fondo de color para las instrucciones (inicialmente oculto)
        const instructionsBackground = this.add.rectangle(400, 300, 400, 200, 0xffffff).setOrigin(0.5);
        instructionsBackground.setVisible(false);

        // Agrega un texto de instrucciones que inicialmente está oculto
        const instructionsText = this.add.text(400, 300, 'Recoge todas las estrellas antes de que te alcance una bomba!', {
            fontSize: '20px',
            fill: '#000',
            fontFamily: "'Press Start 2P', cursive",
            wordWrap: { width: 380, useAdvancedWrap: true },
            align: 'center',
            visible: false,
        }).setOrigin(0.5);

        // Cierra las instrucciones al hacer clic en el cuadro
        instructionsBackground.setInteractive().on('pointerdown', function () {
            instructionsBackground.setVisible(false);
            instructionsText.setVisible(false);
        });

        // Oculta las instrucciones al iniciar la página
        instructionsBackground.setVisible(false);
        instructionsText.setVisible(false);
    }
}
