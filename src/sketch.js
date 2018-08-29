
const GRID = { x: 10, y: 20 };
const BLOCK_SIZE = 30;
const I = 0, J = 1, L = 2, O = 3, S = 4, T = 5, Z = 6;
const BLOCK_TYPES = [I, J, L, O, S, T, Z];
const HUD_SIZE = 100;

var grid = [];
var timer = 30;
var animationTimer = 0;
var keyTimers = [ 0, 0, 0 ];

var block;

function setup() {
    createCanvas(GRID.x * BLOCK_SIZE + HUD_SIZE, GRID.y * BLOCK_SIZE);

    for(let a = 0; a < GRID.y; a++) {
        pushNewLineToGrid();
    }

    block = new Block();
}

function draw() {
    background(0);

    // BLOCK SPAWN ------------------------------------------------------------

    if(block.dead) {
        block = new Block();
    }

    // HUD --------------------------------------------------------------------

    fill("#333");
    noStroke();
    rect(GRID.x * BLOCK_SIZE, 0, HUD_SIZE, height);

    block.draw();

    // DRAW BLOCKS ------------------------------------------------------------

    let rowsToDelete = [];
    for(let a = 0; a < GRID.y; a++) {
        let cubesInRow = 0;
        for(let i = 0; i < GRID.x; i++) {
            if(grid[a][i] !== -1) {
                fill(grid[a][i]);
                rect(i * BLOCK_SIZE, a * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                cubesInRow++;
            }
            if(cubesInRow === GRID.x) {
                rowsToDelete.push(a);
            }
        }
    }

    // REMOVE BLOCKS ----------------------------------------------------------

    if(rowsToDelete.length > 0) {
        fill(255);
        for(let r of rowsToDelete) {
            if(animationTimer % 10 > 5) {
                rect(0, r * BLOCK_SIZE, GRID.x * BLOCK_SIZE, BLOCK_SIZE);
            }
        }
        if(animationTimer == 25) {
            for(let i = rowsToDelete.length - 1; i >= 0; i--) {
                grid.splice(rowsToDelete[i], 1);
            }
            for(let i = 0; i < rowsToDelete.length; i++) {
                pushNewLineToGrid();
            }
            animationTimer = -1;
        }
        animationTimer++;
        return;
    }

    // KEY HANDLING -----------------------------------------------------------

    if(keyIsDown(LEFT_ARROW)) {
        if(keyTimers[0] < 1 || keyTimers[0] > 10) {
            block.modPos(-1, 0);
        }
        keyTimers[0]++;
    } else if(keyIsDown(RIGHT_ARROW)) {
        if(keyTimers[1] < 1 || keyTimers[1] > 10) {
            block.modPos(1, 0);
        }
        keyTimers[1]++;
    } else if(keyIsDown(DOWN_ARROW)) {
        block.modPos(0, 1);
    } else {
        keyTimers[0] = 0;
        keyTimers[1] = 0;
        keyTimers[2] = 0;
        keyTimers[3] = 0;
    }

    timer--;

    if(timer == 0) {
        block.modPos(0, 1);
        timer = 50;
    }
    
}

function keyPressed() {
    if(keyCode === UP_ARROW) {
        block.rotate();
    }
}

function pushNewLineToGrid() {
    grid.splice(0, 0, []);
    for(let i = 0; i < GRID.x; i++) {
        grid[0].push(-1);
    }
}