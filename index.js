var canvas = document.getElementById('main');
var context = canvas.getContext('2d');
context.canvas.width = window.innerWidth;
context.canvas.height = window.innerHeight;
import sheep from './sheep.js';

var img = new Image();
img.src = './imgs/ms_black_sheep.png';

img.onload = draw;
canvas.onclick = animate;

function draw(e) {
    if (e) console.log(e);

    var spriteWidth = 90,
        spriteHeight = 59,
        pixelsLeft = 10,
        pixelsTop = 34,

        // Where are we going to draw
        // the sprite on the canvas
        canvasPosX = 200,
        canvasPosY = 200;

    context.drawImage(img,
        pixelsLeft,
        pixelsTop,
        spriteWidth,
        spriteHeight,
        canvasPosX,
        canvasPosY,
        spriteWidth,
        spriteHeight
    );
}

function animate(e) {
    if (e) console.log(e);

    console.log(sheep.stand["1"].pixelsLeft);
}
