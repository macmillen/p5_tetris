
class Block {

    constructor(type, pos) {
        switch(type) {
            case RANDOM: this.type = int(random(BLOCK_TYPES.length)); break;
            default    : this.type = type;                            break;
        }

        this.pos = pos;
        this.dead = false;

        // [ 00  10  20  30 ]
        // [ 01  11  21  31 ]
        // [ 02  12  22  32 ]
        // [ 03  13  23  33 ]

        switch(this.type) {
            case I: this.cubes = [ { x: 0,  y: 0 }, { x: 1,  y: 0 }, { x: 2,  y: 0 }, { x: 3, y: 0 } ];
                    this.color = color("#00F0F0");
                    this.anchor = 2;
                    this.size = { w: 4, h: 1 };
                    break;
            case J: this.cubes = [ { x: 0,  y: 0 }, { x: 0,  y: 1 }, { x: 1,  y: 1 }, { x: 2, y: 1 } ];
                    this.color = color("#0000F0");
                    this.anchor = 3;
                    this.size = { w: 3, h: 2 };
                    break;
            case L: this.cubes = [ { x: 0,  y: 1 }, { x: 1,  y: 1 }, { x: 2,  y: 1 }, { x: 2, y: 0 } ];
                    this.color = color("#F0A000");
                    this.anchor = 2;
                    this.size = { w: 3, h: 2 };
                    break;
            case O: this.cubes = [ { x: 1,  y: 0 }, { x: 2,  y: 0 }, { x: 1,  y: 1 }, { x: 2, y: 1 } ];
                    this.color = color("#F0F000");
                    this.anchor = -1;
                    this.size = { w: 4, h: 2 };
                    break;
            case S: this.cubes = [ { x: 1,  y: 0 }, { x: 2,  y: 0 }, { x: 0,  y: 1 }, { x: 1, y: 1 } ];
                    this.color = color("#00F000");
                    this.anchor = 3;
                    this.size = { w: 3, h: 2 };
                    break;
            case T: this.cubes = [ { x: 1,  y: 0 }, { x: 0,  y: 1 }, { x: 1,  y: 1 }, { x: 2, y: 1 } ];
                    this.color = color("#A000F0");
                    this.anchor = 2;
                    this.size = { w: 3, h: 2 };
                    break;
            case Z: this.cubes = [ { x: 0,  y: 0 }, { x: 1,  y: 0 }, { x: 1,  y: 1 }, { x: 2, y: 1 } ];
                    this.color = color("#F00000");
                    this.anchor = 2;
                    this.size = { w: 3, h: 2 };
                    break;
        }

        let distance = 0;
        switch(pos) {
            case LEFT  : distance = 0.0; break;
            case CENTER: distance = 0.5; break;
            case RIGHT : distance = 0.0; break;
        }

        for(let c of this.cubes) {
            c.x += int((GRID.x - 1) * distance);
        }

    }

    draw(y) {
        stroke(0);
        fill(this.color);
        for(let c of this.cubes) {
            switch(this.pos) {
                case LEFT:
                    rect(c.x * BLOCK_SIZE_SMALL + 10 + (HUD_SIZE - 20) / 2 - this.size.w * BLOCK_SIZE_SMALL / 2, c.y * BLOCK_SIZE_SMALL + 10 + (HUD_SIZE - 20) / 2 - this.size.h * BLOCK_SIZE_SMALL / 2, BLOCK_SIZE_SMALL, BLOCK_SIZE_SMALL);
                    break;
                case CENTER:
                    rect(c.x * BLOCK_SIZE + HUD_SIZE, c.y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                    break;
                case RIGHT:
                    rect(width - 0.5 * HUD_SIZE - this.size.w * BLOCK_SIZE_SMALL / 2 + c.x * BLOCK_SIZE_SMALL, c.y * BLOCK_SIZE_SMALL + 110 * y + 80, BLOCK_SIZE_SMALL, BLOCK_SIZE_SMALL);
                    break;
            }
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
                return;
            } else if(grid[c.y + y][c.x + x] !== -1) {
                if(x !== 0) {
                    return;
                }
                this.updateWithGrid();
                return;
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
        savedBlockUsed = false;
    }

    rotate() {
        if(this.anchor === -1) // for O-block
            return;
        
        let newCubes = [];
        for(let c of this.cubes) {
            let x = c.x - this.cubes[this.anchor].x; // translate to anchor
            let y = c.y - this.cubes[this.anchor].y;

            let rx = y * -1;                         // rotate
            let ry = x;

            rx += this.cubes[this.anchor].x;         // translate back
            ry += this.cubes[this.anchor].y;

            newCubes.push({ x: rx, y: ry });
        }
        this.cubes = newCubes;
    }

}
