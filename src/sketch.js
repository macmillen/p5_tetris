
const GRID = { x: 10, y: 21 };
const BLOCK_SIZE = 30;
const BLOCK_SIZE_SMALL = BLOCK_SIZE * 0.7;
const I = 0, J = 1, L = 2, O = 3, S = 4, T = 5, Z = 6;
const BLOCK_TYPES = [ I, J, L, O, S, T, Z ];
const HUD_SIZE = 110;
const RANDOM = 99;

var upcomingBlocks = [];
var score = 0;
var grid = [];
var timer = 30;
var animationTimer = 0;
var keyTimers = [ 0, 0, 0 ];
var savedBlock;
var savedBlockUsed = false;

var block;

function setup() {
    createCanvas(GRID.x * BLOCK_SIZE + HUD_SIZE * 2, GRID.y * BLOCK_SIZE);

    for(let a = 0; a < GRID.y; a++) {
        pushNewLineToGrid();
    }

    for(let i = 0; i < 5; i++) {
        upcomingBlocks.push(new Block(RANDOM, RIGHT));
    }

    block = new Block(RANDOM, CENTER);
}

function draw() {
    background(0);

    // BLOCK SPAWN ------------------------------------------------------------

    if(block.dead) {
        block = new Block(getUpcomingBlock().type, CENTER);
    }

    // HUD --------------------------------------------------------------------

    fill("#333");
    noStroke();
    rect(0, 0, HUD_SIZE, height);
    rect(GRID.x * BLOCK_SIZE + HUD_SIZE, 0, HUD_SIZE, height);
    
    fill("#111");
    rect(10, 10, HUD_SIZE - 20, HUD_SIZE - 20);
    
    
    
    fill(255);
    textSize(20);
    textAlign(CENTER);
    text("SCORE \n" + score, width - HUD_SIZE / 2, 20);
    
    
    // DRAW BLOCKS ------------------------------------------------------------
    
    // UPCOMING
    for(let i = 0; i < upcomingBlocks.length; i++) {
        upcomingBlocks[i].draw(i);
    }

    // SAVED BLOCK
    if(savedBlock)
        savedBlock.draw();

    // THE BLOCK
    block.draw();
    
    // THE GRID
    let rowsToDelete = [];
    for(let a = 0; a < GRID.y; a++) {
        let cubesInRow = 0;
        for(let i = 0; i < GRID.x; i++) {
            if(grid[a][i] !== -1) {
                fill(grid[a][i]);
                rect(HUD_SIZE + i * BLOCK_SIZE, a * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                cubesInRow++;
            }
            if(cubesInRow === GRID.x) {
                rowsToDelete.push(a);
            }
        }
    }
    // fill("#333");
    // noStroke();
    // rect(HUD_SIZE, 0, GRID.x * BLOCK_SIZE, BLOCK_SIZE - 10);

    // REMOVE BLOCKS ----------------------------------------------------------

    if(rowsToDelete.length > 0) {
        fill(255);
        for(let r of rowsToDelete) {
            if(animationTimer % 10 > 5) {
                rect(HUD_SIZE, r * BLOCK_SIZE, GRID.x * BLOCK_SIZE, BLOCK_SIZE);
            }
        }
        if(animationTimer === 25) {
            for(let i = rowsToDelete.length - 1; i >= 0; i--) {
                grid.splice(rowsToDelete[i], 1);
            }
            for(let i = 0; i < rowsToDelete.length; i++) {
                pushNewLineToGrid();
            }
            switch (rowsToDelete.length) {
                case 1: score += 10; break;
                case 2: score += 30; break;
                case 3: score += 60; break;
                case 4: score += 100; break;
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

    if(timer === 0) {
        block.modPos(0, 1);
        timer = 50;
    }
    
}

function keyPressed() {
    if(keyCode === UP_ARROW) {
        block.rotate();
    }
    if(keyCode === 67) { // C
        if(!savedBlockUsed) {
            savedBlockUsed = true;
            let save = savedBlock;
            savedBlock = new Block(block.type, LEFT);
            savedBlock.type = block.type;
            if(!save) {
                block = new Block(getUpcomingBlock().type, CENTER);
            } else {
                block = new Block(save.type, CENTER);
            }
        }
    }
}

function getUpcomingBlock() {
    let b = upcomingBlocks.splice(0, 1);
    upcomingBlocks.push(new Block(RANDOM, RIGHT));
    return b[0];
}

function pushNewLineToGrid() {
    grid.splice(0, 0, []);
    for(let i = 0; i < GRID.x; i++) {
        grid[0].push(-1);
    }
}