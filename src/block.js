
class Block {

    constructor() {
        this.type = int(random(BLOCK_TYPES.length));

        this.dead = false;

        // [ 00  10  20  30 ]
        // [ 01  11  21  31 ]
        // [ 02  12  22  32 ]
        // [ 03  13  23  33 ]

        switch(this.type) {
            case I: this.cubes = [ { x: 1,  y: 0 }, { x: 1,  y: 1 }, { x: 1,  y: 2 }, { x: 1, y: 3 } ]; // [1]
                    this.color = color("#00F0F0");
                    this.anchor = 1;
                    break;
            case J: this.cubes = [ { x: 2,  y: 0 }, { x: 2,  y: 1 }, { x: 1,  y: 2 }, { x: 2, y: 2 } ]; // [1]
                    this.color = color("#0000F0");
                    this.anchor = 1;
                    break;
            case L: this.cubes = [ { x: 1,  y: 0 }, { x: 1,  y: 1 }, { x: 1,  y: 2 }, { x: 2, y: 2 } ]; // [1]
                    this.color = color("#F0A000");
                    this.anchor = 1;
                    break;
            case O: this.cubes = [ { x: 1,  y: 0 }, { x: 2,  y: 0 }, { x: 1,  y: 1 }, { x: 2, y: 1 } ]; // X
                    this.color = color("#F0F000");
                    this.anchor = -1;
                    break;
            case S: this.cubes = [ { x: 1,  y: 0 }, { x: 2,  y: 0 }, { x: 0,  y: 1 }, { x: 1, y: 1 } ]; // [0]
                    this.color = color("#00F000");
                    this.anchor = 0;
                    break;
            case T: this.cubes = [ { x: 0,  y: 0 }, { x: 1,  y: 0 }, { x: 2,  y: 0 }, { x: 1, y: 1 } ]; // [1]
                    this.color = color("#A000F0");
                    this.anchor = 1;
                    break;
            case Z: this.cubes = [ { x: 0,  y: 0 }, { x: 1,  y: 0 }, { x: 1,  y: 1 }, { x: 2, y: 1 } ]; // [1]
                    this.color = color("#F00000");
                    this.anchor = 1;
                    break;
        }

        for(let c of this.cubes)
            c.x += int(GRID.x / 2) - 2;

    }

    draw() {
        fill(this.color);
        for(let c of this.cubes) {
            rect(c.x * BLOCK_SIZE, c.y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
    }

    modPos(x, y) {
        let newCubes = [];
        for(let c of this.cubes) {
            newCubes.push({ x: c.x + x, y: c.y + y });

            if(c.x + x < 0 || c.x + x > GRID.x - 1) {
                return -1;
            } else if(c.y + y > GRID.y - 1) {
                this.updateWithGrid();
            } else if(grid[c.y + y][c.x + x] !== -1) {
                this.updateWithGrid();
            }

        }
        this.cubes = newCubes;
        return 0;
    }

    updateWithGrid() {
        for(let c of this.cubes) {
            grid[c.y][c.x] = this.color;
        }
        this.dead = true;
    }

    rotate() {
        if(this.anchor === -1) // for O-block
            return;
        
        let newCubes = [];
        for(let c of this.cubes) {
            let x = c.x - this.cubes[this.anchor].x; // translate to anchor and rotate
            let y = c.y - this.cubes[this.anchor].y;

            let rx = y * -1;
            let ry = x;

            rx += this.cubes[this.anchor].x;
            ry += this.cubes[this.anchor].y;

            newCubes.push({ x: rx, y: ry });


            // let x = -1 * (c.y - this.cubes[this.anchor].y); // translate to anchor and rotate
            // x += this.cubes[this.anchor].y;                 // translate back
            // newCubes.push({ x: x, y: c.x });
        }
        this.cubes = newCubes;
    }

}
