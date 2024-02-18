// Elimina esta línea:
// const Phaser = require("phaser");


var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics:{
        default: 'arcade',
        arcade: {
            gravity: { y: 300}
            // debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var game = new Phaser.Game(config);


function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}


function create() {
    this.add.image(400, 300, 'sky');
   
    platforms= this.physics.add.staticGroup();
    platforms.create(400,568,'ground').setScale(2).refreshBody();
    platforms.create(600,400,'ground');
    platforms.create(50,250,'ground');
    platforms.create(750,220,'ground');


    player = this.physics.add.sprite(100,450,'dude');
    player.setCollideWorldBounds(true); //el muñeco no cae al vacio, respeta los límites del juego
    player.setBounce(0.2); //el muñeco rebota al caer


    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude',{start: 0, end: 3}),
        frameRete: 10, //se ejecuta a velocidad de 10 fotogramas por segundo
        repeat: -1
    });


    this.anims.create({
        key: 'turn',
        frames: [ {key:'dude',frame:4} ],
        frameRete: 20, //se ejecuta a velocidad de 20 fotogramas por segundo
    });


    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude',{start: 5, end: 8}),
        frameRete: 10, //se ejecuta a velocidad de 10 fotogramas por segundo
        repeat: -1
    });


// player.body.setGravityY(300); //la velocidad con la que cae el muñeco


this.physics.add.collider(player,platforms);//detecta colisiones entre el jugador y las plataformas
cursors = this.input.keyboard.createCursorKeys();






}
function update() {
    if(cursors.left.isDown){ //para cuando la tecla left esté presionada
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }else if(cursors.right.isDown){
        player.setVelocityX(160);
        player.anims.play('right', true);//para cuando la tecla right esté presionada
    } else {
        player.setVelocityX(0);
        player.anims.play('turn'); //para cuando el muñeco está quieto
    }


    if(cursors.up.isDown && player.body.touching.down){ //para que el muñeco salte
        player.setVelocityY(-330);
    }


}
