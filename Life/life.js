/***********************************************************************
 * Author : Arthur Freeman | Date : 18/02/2020                         *
 * JavaScript implementation of Conway's game of life using p5.js.     *
 * board is a matrix of Cells, every cell has a status and a position. *
 * Alive === true, dead === false.                                     *
 * Every cell gets updated based on previous saved copy of the board,  *
 * this is obtained via copyMatrix().                                  *
 ***********************************************************************/ 
const size = 10;
const canvasWidth = 400;
const canvasHeight = 400;
const n = canvasWidth / size;
const m = canvasHeight / size;
let board = [];
let living = false;

class Cell {
    constructor(status, position) {
        this.status = status;
        this.position = position;
    }
}

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    frameRate(10);
    noLoop();
    initialiseBoard();
}

function initialiseBoard() {
    for(let i=0; i < m; i++) {
        board[i] = new Array(n);
    }
    for(let i=0; i < m; i++) {
        for(let j=0; j < n; j++) {
            board[i][j] = new Cell(false, [i*size, j*size]);
        }
    }
    board[0][0].status = true;
    board[0][2].status = true;
    board[1][1].status = true;
    board[1][2].status = true;
    board[2][1].status = true;
    isLiving = false;
    noLoop();
}

function start() {
    isLiving = true;
    loop();
}

function mousePressed() {
    if ( !(mouseX < 0 || mouseY < 0 || mouseY > canvasHeight || mouseX > canvasWidth || isLiving) ) {
        let color = get(mouseX, mouseY);
        let x = mouseX; 
        let y = mouseY;
        x = floor(x / size);
        y = floor(y / size);
        board[x][y].status = true;
        if (color[0] === 0 && color[1] === 0 && color[2] === 0) {
            fill('white');
            board[x][y].status = false;
        } else {            
            fill('black');
        }
        rect(board[x][y].position[0], board[x][y].position[1], size, size);
    }
}

function updateCell(i, j, previousBoard) {
    let count = 0;
    for(let k=-1; k < 2; k++) {
        for(let p=-1; p < 2; p++) {
            if( !(i + k < 0 || j + p < 0 || j + p >= n || i + k >= m) ) {
                if(k != 0 || p != 0) {         
                    if(previousBoard[i+k][j+p].status === true) {
                        count++;
                    }
                }
            }
        }
    }
    if((previousBoard[i][j].status === true) && (count < 2 || count > 3)) {
        board[i][j].status = false;        
    } else if((count === 3) && (previousBoard[i][j].status === false)) { 
        board[i][j].status = true;
        
    } else if((previousBoard[i][j].status === true) && (count === 2 || count === 3)) {
        board[i][j].status = true;
    }
}

function copyMatrix() {
    let newMatrix = [];
    for(let i=0; i < m; i++) {
        newMatrix[i] = [];
        for(let j=0; j < n; j++) {
            newMatrix[i][j] = new Cell(board[i][j].status, board[i][j].position);
        }
    }
    return newMatrix;
}

function draw() {
    background(220);
    for(let i=0; i < m; i++) {
        for(let j=0; j < n; j++) {
            if (board[i][j].status === true) {
                fill('black');
            } else {
                fill('white');
            }
            rect(board[i][j].position[0], board[i][j].position[1], size, size);
        }
    }
    let previousBoard = copyMatrix();
    for(let i=0; i < m; i++) {
        for(let j=0; j < n; j++) {
            updateCell(i, j, previousBoard);
        }
    }
}