const Phaser = require("phaser");


var config = {
type: Phaser.AUTO,
width: 800,
height: 600,
scene: {
    perload: preload,
    create: create,
    update: update
}
};
var game = new Phaser.Game(config);


function preload() {
}
function create() {
}
function update(){
   
}
