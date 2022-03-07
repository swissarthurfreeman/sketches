
let sponge = new Sponge(0, 0, 0, 200);

function setup() {
    createCanvas(400, 400, WEBGL);
    background(225);
    frameRate(30);
    normalMaterial();
}

function mousePressed() {
    sponge.update();
    console.log(sponge.cubes)
}

function draw() {
    background(225);
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
    for(let b=0; b < sponge.cubes.length; b++) {
        translate(sponge.cubes[b].pos);
        box(sponge.r);
        translate(-sponge.cubes[b].pos.x, -sponge.cubes[b].pos.y, -sponge.cubes[b].pos.z);
    }
}