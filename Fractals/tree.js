/*********************************************
 * Fractal Tree using p5.js.                 *
 * Author : Arthur Freeman                   *
 * Date : 20/02/2020                         *
 *********************************************/ 
const canvasWidth = 800; 
const canvasHeight = 800;
let n = 11;
let theta = 38.5 * (Math.PI / 180); 
let nodes = [];
let angleMult = 1;
let reduceFactor = 1.3;
let input, button;
let randomAngles = false;
let randomDistances = false;

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function getRandomArbitary(min, max) {
    return Math.random() * (max - min) + min;
}

function powerOf2(v) {
    return v && !(v & (v - 1));
}

function generateGraph(n, nodes) {
    let i = 1;
    let l = canvasHeight - floor(canvasHeight / reduceFactor);
    while (nodes.length < Math.pow(2, n)) {
        if(randomDistances) {
            l = getRandomArbitary(0, 100);
        }
        if(randomAngles) {
            theta = getRandomArbitary(10, 180) * (Math.PI / 180);
        }
        if(powerOf2(nodes.length)) {
            l = l / reduceFactor;
            angleMult *= angleMult;
        }
        nodes.push(new Node(nodes[i].x - l * Math.cos(theta*angleMult), nodes[i].y - l * Math.sin(theta*angleMult)));
        nodes.push(new Node(nodes[i].x + l * Math.cos(theta*angleMult), nodes[i].y - l * Math.sin(theta*angleMult)));
        i++;
    }
}

function changeParadigm() {
    randomAngles = !randomAngles;
    reinitialise();
}

function changeDistanceParadigm() {
    randomDistances = !randomDistances;
    reinitialise();
}

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    slider = createSlider(0, 180, 45, 0);
    background(0);
    input = createInput();
    button = createButton("Toggle Random Angles");
    button2 = createButton("Toggle Random Distances");
    button2.mousePressed(changeDistanceParadigm);
    button.mousePressed(changeParadigm)
    input.value(10);
    reinitialise();
}

function reinitialise() {
    background(0);
    nodes = [];
    angleMult = 1.01;
    reduceFactor = 1.3;
    nodes.push(undefined);
    nodes.push(new Node(floor(canvasWidth/2), canvasHeight - floor(canvasHeight / 4)));
    generateGraph(n, nodes);
    stroke(getRandomArbitary(0, 255), getRandomArbitary(0, 255), getRandomArbitary(0, 255));
    line(floor(canvasWidth/2), canvasHeight, 
         floor(canvasWidth/2), canvasHeight - floor(canvasHeight / 4)
    );
    drawGraph(nodes);
}

function drawGraph(nodes) {
    for(let i=1; i < floor(nodes.length / 2); i++) {
        stroke(getRandomArbitary(0, 255), getRandomArbitary(0, 255), getRandomArbitary(0, 255));
        line(nodes[i].x, nodes[i].y, nodes[2*i].x, nodes[2*i].y);
        line(nodes[i].x, nodes[i].y, nodes[2*i+1].x, nodes[2*i+1].y);
    }
}

function mouseDragged() {
    theta = slider.value() * (Math.PI / 180);
    n = int(input.value());
    reinitialise();
}