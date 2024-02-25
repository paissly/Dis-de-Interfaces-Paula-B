// Configuración del juego
var config = {
    type: Phaser.AUTO, 
    width: 800,         // Ancho del lienzo del juego
    height: 600,        // Altura del lienzo del juego
    physics: {
        default: 'arcade', // Motor de physics utilizado (arcade en este caso)
        arcade: {
            gravity: { y: 300 }, // Gravedad en el eje Y 
            debug: false         
        }
    },
    scene: [StartScene, MainScene] // Escenas del juego (StartScene y MainScene)
};
var game = new Phaser.Game(config);
