/********************************************************************
* Jeu de Billard développé par Arthur Freeman, Université de Genève *
* Projet personnel afin d'apprendre à manier git et JavaScript.     *
*********************************************************************/

//To Do :
//créer une classe trou qui hérite de balles et changer procédure collision
//pour celle ci, call collision entre TBalles et TTrous.
//Encapsuler toutes les fonctions dans TBalles.

//Variables Globales (à encapsuler)
let balls = [];
let height = 35; //height est le double du rayon.    
let coeff = 0.04;
let WIDTH = 800;
let HEIGHT = 600;
let stick = false;

//Setup est appelé qu'une seule fois. 
function setup() {
    createCanvas(WIDTH,HEIGHT);
    background(0, 255, 0);
    frameRate(60);

    //La balle 0 est la balle blance.
    balls[0] = new TBall(150, 275, 0, 0);

    //Ce code permet de créer le triangle de balles.
    let r_ini = [400, 300]; //position balle en tête.
    let c = 1 / 1.3;
    let eps = [height*c, height*c]; //vecteurs directeurs
    let e = [height*c, -height*c]; //eps change de diagonale, e la parcourt.
    let p = 0; let v;
    //Beau petit algorithme cryptique, faites un schéma pour voir.
    for (let i = 5; i >= 1; i--) {
        v = vecSum(r_ini, [p*eps[0], p*eps[1]]); 
        p++;
        for (let k = 1; k <= i; k++) {
            let r_f = vecSum(v, [k*e[0], k*e[1]] )
            balls.push(new TBall( r_f[0], r_f[1], 0, 0 ) );
        }
    }
}

//Ceci est entièrement basé sur les équations tirées d'ici : 
//https://www.vobarian.com/collisions/2dcollisions2.pdf
function collision(ball1, ball2) {
    n = [ (ball1.r)[0] - (ball2.r)[0], (ball1.r)[1] - (ball2.r)[1] ];
    un = [n[0] /  vecNorm(n), n[1] / vecNorm(n) ] ;
    ut = [ -un[1], un[0] ];   
    v1n = dotProd(un, (ball1.v));
    v1t = dotProd(ut, (ball1.v) );
    v2n = dotProd(un, (ball2.v) );
    v2t = dotProd(ut, (ball2.v) );
    v1t_p = v1t; v2t_p = v2t;
    v1n_p = v2n; v2n_p = v1n;
    v1n_pvec = [v1n_p * un[0], v1n_p * un[1] ]; 
    v1t_pvec = [v1t_p * ut[0], v1t_p * ut[1] ]; 
    v2n_pvec = [v2n_p * un[0], v2n_p * un[1] ]; 
    v2t_pvec = [v2t_p * ut[0], v2t_p * ut[1] ];
    ball1.v = vecSum(v1n_pvec, v1t_pvec); ball2.v = vecSum(v2n_pvec, v2t_pvec);
}

//Fonction gérant les collisions des balles avec le bord.
function collideBorder(ball) {
    //height / 2 est le rayon des balles. On traite cas par cas en fonction de
    //collisions entre haut et bas et collision droite et gauche.
    if ( (ball.r)[1] - height/2 <= 10 || (ball.r)[1] + height/2 >= HEIGHT - 10) {
        ball.v = [(ball.v)[0], -(ball.v)[1]]; 
    } else if ((ball.r)[0] - height/2 <= 10 || (ball.r)[0] + height/2 >= WIDTH - 10) {
        ball.v = [-(ball.v)[0], (ball.v)[1] ];
    }
}
//Fonction chargée de gérer les collisions. 
//Détecte une même collisions plusieurs fois à chaque appel, pas le plus efficace.
function collide() {
    for (let i = 0; i < balls.length; i++) {
        for (let k = i+1; k < balls.length; k++) {
            if (distance(balls[i], balls[k]) <= height) {
                //Lors d'une collision, je replace les balles si jamais elles
                //sont l'une sur l'autre, afin d'éviter qu'elles restent collées.
            	let over = height - distance(balls[i], balls[k]);
                let v = vecSum(balls[i].r, vecMultiply(balls[k].r, -1) );
                let e = vecMultiply(v, 1/vecNorm(v));
                balls[i].r = vecSum(balls[i].r, e);
                balls[k].r = vecSum(balls[k].r, vecMultiply(e, -1) );
                collision(balls[i], balls[k]); 
            }
        }
        
    }  
}

function drawHoles(holes) {
    positions = holes
    fill(255,228,80);
    rect(0, 0, WIDTH, 10);
    rect(0, 0, 10, HEIGHT);
    rect(WIDTH - 10, 0, 10, HEIGHT);
    rect(0, HEIGHT-10, WIDTH, 10);
    fill(0, 0, 0);
    for(let i=0; i < positions.length; i++) {
        ellipse(positions[i][0], positions[i][1], 40);
    }
    fill(255, 255, 255);
}

function collideHoles(ball, holes) {
    for(let i = 0; i < holes.length; i++) {
        holeBall = {r: [holes[i][0], holes[i][1]]}
        if(distance(ball, holeBall) < height) {
            return true;
        }
    }
}

function mouseClicked() {
    if(distance(balls[0], {r:[mouseX, mouseY]}) < height / 2) {
        console.log("Clicked")
        stick = true;
    } else if(stick) {
        //on tire la balle.
        dis = distance(balls[0], {r:[mouseX, mouseY]})
        v_dir = [ (balls[0].r)[0] - mouseX, (balls[0].r)[1] - mouseY]
        v_0 = vecMultiply(v_dir, 1 / dis);
        v_0 = vecMultiply(v_0, dis / 30);
        console.log(v_0);
        (balls[0].v) = v_0;
        stick = false;
    }
}

function summonStick() {
    line(mouseX, mouseY, (balls[0].r)[0], (balls[0].r)[1]);
}

//Draw est appelé non-stop (fonction reconnue et appelée par p5js)
function draw() {
    //Background efface ce qui était présent au frame précédent et on redessine le nouveau frame.
    background(38, 189, 0)

    holes = [ [20, 20], [WIDTH/2, 20], [WIDTH-20, 20], 
    [20, HEIGHT-20], [WIDTH/2, HEIGHT-20], [WIDTH - 20, HEIGHT - 20]];
    
    colors = ['white', 'yellow', 'blue', 'red', 'purple', 'orange', 'green', 
    '#800020', 'black', 'yellow', 'blue', 'red', 'purple', 'orange', 'green', '#800020'];
    
    for (let i = 0; i < balls.length; i++) {
        //collide toutes les balles entre elles.
        collide(); 
        collideBorder(balls[i]);
        
        if(collideHoles(balls[i], holes)) {
            (balls[i].r) = [NaN, NaN];
            (balls[i].v) = [0, 0];
            //balls.splice(i, 1);
        }       

        //Mise à jour des positions avec vitesse.
        (balls[i].r)[0] = (balls[i].r)[0] + (balls[i].v)[0];
        (balls[i].r)[1] = (balls[i].r)[1] + (balls[i].v)[1];

        //Dessiner les ellipses pour chaque balle.
        //Ellipse est natif à p5js, ellipse(x, y, width, height).
        
        fill(colors[i]);
        ellipse( (balls[i].r)[0], (balls[i].r)[1], height)
        

        drawHoles(holes);

        fill(0, 0, 0);
        text(i.toString(), (balls[i].r)[0], (balls[i].r)[1])
        fill(255, 255, 255);
        

        if(stick) {
            summonStick();
        }

        //Mise à jour des vitesses avec frottement. 
        for (let p = 0; p < 2; p++) {
            if (  (balls[i].v)[p] > 0) { //On soustrait coeff au deux composantes de la vitesse.
                (balls[i].v)[p] = (balls[i].v)[p] - coeff;
            } else if ( (balls[i].v)[p] < 0 ) {
                (balls[i].v)[p] = (balls[i].v)[p] + coeff;
            }
            //Si la vitesse est négligeable, elle devient nulle.
            if (Math.abs( (balls[p].v)[p] ) <= coeff) {
                (balls[p].v)[p] = 0;
            }
        }
    }
}