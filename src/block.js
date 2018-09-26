
class Block {

    constructor(type, pos) {
        switch(type) {
            case RANDOM: this.type = int(random(BLOCK_TYPES.length)); break;
            default    : this.type = type;                            break;
        }

        this.pos = pos;
        this.dead = false;
        this.lastChanceStarted = false;
        this.lastChanceTimerTimeIsUp;
        this.lastChanceTimerNotMoved;

        // [ 00  10  20  30 ]
        // [ 01  11  21  31 ]
        // [ 02  12  22  32 ]
        // [ 03  13  23  33 ]

        switch(this.type) {
            case I: this.cubes = [ { x: 0,  y: 0 }, { x: 1,  y: 0 }, { x: 2,  y: 0 }, { x: 3, y: 0 } ];
                    this.color = color("#16a085");
                    this.anchor = 2;
                    this.size = { w: 4, h: 1 };
                    break;
            case J: this.cubes = [ { x: 0,  y: 0 }, { x: 0,  y: 1 }, { x: 1,  y: 1 }, { x: 2, y: 1 } ];
                    this.color = color("#3498db");
                    this.anchor = 1;
                    this.size = { w: 3, h: 2 };
                    break;
            case L: this.cubes = [ { x: 0,  y: 1 }, { x: 1,  y: 1 }, { x: 2,  y: 1 }, { x: 2, y: 0 } ];
                    this.color = color("#e67e22");
                    this.anchor = 2;
                    this.size = { w: 3, h: 2 };
                    break;
            case O: this.cubes = [ { x: 1,  y: 0 }, { x: 2,  y: 0 }, { x: 1,  y: 1 }, { x: 2, y: 1 } ];
                    this.color = color("#f1c40f");
                    this.anchor = -1;
                    this.size = { w: 4, h: 2 };
                    break;
            case S: this.cubes = [ { x: 1,  y: 0 }, { x: 2,  y: 0 }, { x: 0,  y: 1 }, { x: 1, y: 1 } ];
                    this.color = color("#27ae60");
                    this.anchor = 3;
                    this.size = { w: 3, h: 2 };
                    break;
            case T: this.cubes = [ { x: 1,  y: 0 }, { x: 0,  y: 1 }, { x: 1,  y: 1 }, { x: 2, y: 1 } ];
                    this.color = color("#8e44ad");
                    this.anchor = 2;
                    this.size = { w: 3, h: 2 };
                    break;
            case Z: this.cubes = [ { x: 0,  y: 0 }, { x: 1,  y: 0 }, { x: 1,  y: 1 }, { x: 2, y: 1 } ];
                    this.color = color("#e74c3c");
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

        fill(this.color);

        let loopCount = 0;
        let yCount = [ 0, 0, 0, 0 ];

        for(let c of this.cubes) {
            switch(this.pos) {
                case LEFT:
                    rect(c.x * BLOCK_SIZE_SMALL + 10 + (HUD_SIZE - 20) / 2 - this.size.w * BLOCK_SIZE_SMALL / 2, c.y * BLOCK_SIZE_SMALL + 10 + (HUD_SIZE - 20) / 2 - this.size.h * BLOCK_SIZE_SMALL / 2, BLOCK_SIZE_SMALL, BLOCK_SIZE_SMALL, ROUNDNESS);
                    break;
                case CENTER:
                    while(c.y + yCount[loopCount] + 1 !== GRID.y && grid[c.y + yCount[loopCount] + 1][c.x] === -1) {
                        yCount[loopCount]++;
                    }
                    break;
                case RIGHT:
                    rect(width - 0.5 * HUD_SIZE - this.size.w * BLOCK_SIZE_SMALL / 2 + c.x * BLOCK_SIZE_SMALL, c.y * BLOCK_SIZE_SMALL + 110 * y + 80, BLOCK_SIZE_SMALL, BLOCK_SIZE_SMALL, ROUNDNESS);
                    break;
            }
            loopCount++;
        }

        if(this.pos === CENTER) {
            let maxGhostY = min(yCount);
            for(let c of this.cubes) {
                fill(color(255, 80));
                rect(c.x * BLOCK_SIZE + HUD_SIZE, (maxGhostY + c.y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE, ROUNDNESS);
                fill(this.color);
                rect(c.x * BLOCK_SIZE + HUD_SIZE, c.y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE, ROUNDNESS);
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

        if(instantDrop) {
            this.modPos(0, 1);
        }
        return 0;
    }

    updateWithGrid() {
        if(!this.lastChanceStarted) {
            this.lastChanceStarted = true;
            this.lastChanceTimerTimeIsUp = Date.now();
            this.lastChanceTimerNotMoved = Date.now();
        }
        if(this.lastChanceTimerNotMoved + 500 > Date.now() && this.lastChanceTimerTimeIsUp + 2000 > Date.now() && !instantDrop) {
            return;
        }

        for(let c of this.cubes) {
            if(grid[c.y][c.x] !== -1) {
                gameOver = true;
                popUpWindow.show(GAME_OVER);
            }
            grid[c.y][c.x] = this.color;
        }
        this.dead = true;
        savedBlockUsed = false;
        instantDrop = false;
        sndPlop.play();
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

        for(let c of newCubes) {
            while(c.x < 0)          { for(let c of newCubes) { c.x++; } }
            while(c.x > GRID.x - 1) { for(let c of newCubes) { c.x--; } }
            while(c.y < 0)          { for(let c of newCubes) { c.y++; } }
            while(c.y > GRID.y - 1) { for(let c of newCubes) { c.y--; } }
        }


        // TODO: when rotate and touched ground -> lastChanceStarted = true
        //   --> then always after moving up, move down 

        // IF TOUCHED GROUND
        // set cube the most far at the bottom on top of 

        // if(this.lastChanceStarted) {
        //     for(let c of newCubes) {
        //         while()                
        //     }
        // }

        for(let i = 0; i < 4; i++) {
            let c = newCubes[i];
            if(grid[c.y][c.x] !== -1) {
                i = 0;
                for(let c of newCubes) {
                    c.y--;
                }
            }
        }

        for(let c of newCubes) {
            if(grid[c.y][c.x] !== -1)
                return;
        }
        this.cubes = newCubes;
    }

}
