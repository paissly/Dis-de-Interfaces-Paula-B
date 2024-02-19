// Elimina esta línea:
// const Phaser = require("phaser");


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


var score = 0;
var scoreText;
var gameOver= false;


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
        frameRate: 10, //se ejecuta a velocidad de 10 fotogramas por segundo
        repeat: -1
    });


    this.anims.create({
        key: 'turn',
        frames: [ {key:'dude',frame:4} ],
        frameRate: 20, //se ejecuta a velocidad de 20 fotogramas por segundo
    });


    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude',{start: 5, end: 8}),
        frameRate: 10, //se ejecuta a velocidad de 10 fotogramas por segundo
        repeat: -1
    });


// player.body.setGravityY(300); //la velocidad con la que cae el muñeco


this.physics.add.collider(player,platforms);//detecta colisiones entre el jugador y las plataformas
cursors = this.input.keyboard.createCursorKeys();


stars = this.physics.add.group({
    key: 'star',
    repeat: 11, //se repite 11 veces por lo tanto habrá 12 estrellas
    setXY: {x:12, y:0, stepX:70}
});


stars.children.iterate(function(child){
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
});
this.physics.add.collider(stars, platforms);


this.physics.add.overlap(player, stars, collectStar, null, true);//deshabilita las estrellas, desaparecen cuando el muñeco las toca


scoreText= this.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill:'#000' });


bombs=this.physics.add.group();
this.physics.add.collider(bombs, platforms);
this.physics.add.collider(player, bombs, hitBomb, null, this);
}


function update() {
    if(gameOver){ //Si la bomba toca al muñeco, este para y deja de hacer la animación
        return
    }


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


function collectStar(player, star){
    star.disableBody(true, true);


    score += 10;
    scoreText.setText('Score: '+ score);


    if(stars.countActive(true) === 0){ //saber cuantas estrellas quedan, si no queda ninguna se ejecuta lo siguiente:
        stars.children.iterate(function(child){
            child.enableBody(true, child.x, 0, true, true);
        });


        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
}


function hitBomb(player, bomb){
    this.physics.pause(); //se para el juego cuando una bomba colisione con el muñeco
    player.setTint(0xff0000);//el muñeco se vuelve rojo cuando le matan
    player.anims.play('turn');
    gameOver = true;
}
