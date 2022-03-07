class Cube {
    constructor(pos, size) {
        this.pos = pos;
        this.size = size;
    }
}

class Sponge {
    constructor(x, y, z, r) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;
        //cubes is a queue.
        this.cubes = [new Cube(new p5.Vector(x, y, z), r)];
    }

    update = function() {
        let curr = this.cubes.length;
        console.log(curr)
        this.r = this.r / 3;
        for(let b=0; b < curr; b++) {
            this.subdivide(this.cubes.shift());
        }
        console.log(this.cubes)
    }

    subdivide = function(cube) {
        for(let x=-1; x < 2; x++) {
            for(let y=-1; y < 2; y++) {
                for(let z=-1; z < 2; z++) {
                    let sum = abs(x) + abs(y) + abs(z);
                    if(sum > 1) {
                        let pos = new p5.Vector(cube.pos.x + x*(this.r), 
                                                cube.pos.y + y*(this.r), 
                                                cube.pos.z + z*(this.r));
                        this.cubes.push(new Cube(pos, this.r));
                    }
                }
            }
        }
    }
}