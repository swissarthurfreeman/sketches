const g = 0.01;
let firework; 
let children = [];
//let n = 20;
let clicked = false;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Children {
    constructor(posIni, vIni, color) {
        this.pos = posIni;
        this.v = vIni;
        this.color = color;
    }
}

function mousePressed() {
    clicked = true;
    children = children.concat(generateChildren(mouseX, mouseY));
    console.log(children)
}

function generateChildren(mouseX, mouseY) {
    n = getRandomInt(4, 10);
    let theta = (360 / n) * (Math.PI / 180);
    let angle = theta;
    let children = [];
    
    for(let i=1; i <= n; i++) {
        //ajouter enfant.
        children.push(new Children(
            [mouseX, mouseY], 
            new Array(Math.cos(angle), Math.sin(angle)),
            [getRandomInt(0,255), getRandomInt(0,255), getRandomInt(0,255)]
        ));
        angle = angle + theta;
    }
    console.log(children[0]);
    return children; 
}

function setup() {
    createCanvas(800, 400);
    background(220);
}

function draw() {
    if(clicked) {
        for(let k=0; k < children.length; k++) {
            children[k].pos[0] += children[k].v[0];
            children[k].pos[1] += children[k].v[1]; 
            children[k].v[1] += g;
            stroke(children[k].color[0], children[k].color[1], children[k].color[2]);
            fill(children[k].color[0], children[k].color[1], children[k].color[2]);
            circle(children[k].pos[0], children[k].pos[1], 10)
        }
    }
}