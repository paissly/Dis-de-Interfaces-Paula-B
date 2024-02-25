// startScene.js

class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        // La imagen de fondo para la pantalla de incio 
        this.load.image('background', 'assets/inicio.png');
    }

    create() {
        // Configura la pantalla de inicio con una imagen de fondo
        const background = this.add.image(400, 300, 'background').setDisplaySize(800, 600); // Tamaño imagen

        const titleText = this.add.text(400, 150,  {
            fontSize: '48px',
            fill: '#000',
            fontFamily: "'Press Start 2P', cursive",
        }).setOrigin(0.5);

        // Botón de instrucciones
        const instructionsButton = this.add.text(400, 350, 'Instrucciones', {
            fontSize: '24px',
            fill: '#ffA500', // Color botón
            fontFamily: "'Press Start 2P', cursive",
        })
        .setInteractive()
        .on('pointerdown', () => {
            // Muestra el cuadro de instrucciones al hacer clic en el botón
            instructionsBackground.setVisible(true);
            instructionsText.setVisible(true);
        })
        .setOrigin(0.5);

        // Agrega un botón para iniciar el juego con una promesa de javascript
        const playButton = this.add.text(400, 450, 'Jugar', {
            fontSize: '32px',
            fill: '#ffA500', // Color botón
            fontFamily: "'Press Start 2P', cursive",
        })
        .setInteractive()
        .on('pointerdown', async () => {
            // Utiliza una Promesa para simular algún proceso antes de iniciar el juego
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Inicia la escena del juego cuando se hace clic en el botón "Jugar"
            this.scene.start('MainScene');
        })
        .setOrigin(0.5);

        // CUadrado de color blanco para las instrucciones
        const instructionsBackground = this.add.rectangle(400, 300, 400, 200, 0xffffff).setOrigin(0.5);
        instructionsBackground.setVisible(false);

        // Agrega un texto de instrucciones que inicialmente está oculto
        const instructionsText = this.add.text(400, 300, 'Recoge todas las estrellas antes de que se acaben los 30 segundos o te alcance una bomba!', {
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

        // Cuando se carga la página, las instrucciones deben permanecer ocultas
        instructionsBackground.setVisible(false);
        instructionsText.setVisible(false);
    }
}
