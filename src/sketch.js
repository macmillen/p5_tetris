
// TODOS
// Different sounds for different points

const GRID = { x: 10, y: 21 };
const BLOCK_SIZE = 30;
const BLOCK_SIZE_SMALL = BLOCK_SIZE * 0.7;
const I = 0, J = 1, L = 2, O = 3, S = 4, T = 5, Z = 6;
const BLOCK_TYPES = [ I, J, L, O, S, T, Z ];
const CONTROLS = 0, GAME_OVER = 1, PAUSE = 2;
const HUD_SIZE = 110;
const RANDOM = 99;
const ROUNDNESS = 4;
const LINES_TO_CLEAR   = [ 10,   15,  20,  25,  30,  35,  40,  45,  50,  55, 60, 65, 70 ];
const MILLIS_PER_LEVEL = [ 1000, 800, 620, 470, 350, 250, 180, 140, 100, 70, 50, 40, 30 ];

var upcomingBlocks;
var score;
var scoreToAdd;
var scoreFontSize;
var grid;
var timer;
var animationTimer;
var keyTimers = [ 0, 0, 0 ];
var savedBlock;
var savedBlockUsed;
var instantDrop;
var gameOver;
var level;
var linesToClear;
var paused = false;

var block;

var music;
var sndLineCleared;
var sndPlop;
var font;

var btnControls = new Button(HUD_SIZE / 2, BLOCK_SIZE * GRID.y / 2, HUD_SIZE - 20, 30, "CONTROLS");
var popUpWindow = new PopUpWindow(HUD_SIZE + GRID.x * BLOCK_SIZE / 2, GRID.y * BLOCK_SIZE / 2, GRID.x * BLOCK_SIZE + HUD_SIZE / 4, GRID.y * BLOCK_SIZE * 0.8);

function preload() {
    music = loadSound('../assets/music.mp3');
    sndPlop = loadSound('../assets/plop.mp3');
    sndLineCleared = loadSound('../assets/line_cleared.wav');
    font = loadFont('../assets/font.ttf');
}

function init() {
    grid = [];
    upcomingBlocks = [];
    score = 0;
    scoreToAdd = 0;
    scoreFontSize = 0;
    gameOver = false;
    timer = Date.now() + MILLIS_PER_LEVEL[0];
    animationTimer = 0;
    savedBlock = null;
    savedBlockUsed = false;
    instantDrop = false;
    level = 0;
    linesToClear = LINES_TO_CLEAR[0];

    block = new Block(RANDOM, CENTER);

    for(let i = 0; i < 5; i++) {
        upcomingBlocks.push(new Block(RANDOM, RIGHT));
    }

    for(let a = 0; a < GRID.y; a++) {
        pushNewLineToGrid();
    }
}

function setup() {
    createCanvas(GRID.x * BLOCK_SIZE + HUD_SIZE * 2, GRID.y * BLOCK_SIZE);

    init();

    textFont(font);

    music.loop();
}

function draw() {

    // BLOCK SPAWN ------------------------------------------------------------

    if(block.dead) {
        block = new Block(getUpcomingBlock().type, CENTER);
    }

    // HUD --------------------------------------------------------------------

    // background(0);
    setGradient(0, 0, width, height, color(0), color(6, 26, 50));

    fill(51, 51, 51, 150);
    rect(0, 0, HUD_SIZE, height);
    rect(GRID.x * BLOCK_SIZE + HUD_SIZE, 0, HUD_SIZE, height);
    
    fill("#111");
    rect(10, 10, HUD_SIZE - 20, HUD_SIZE - 20);
    rect(10, HUD_SIZE, HUD_SIZE - 20, HUD_SIZE - 20);
    rect(10, HUD_SIZE * 2 - 10, HUD_SIZE - 20, HUD_SIZE - 20);
    
    fill(255);
    textSize(20);
    textAlign(CENTER);
    text("SCORE", width - HUD_SIZE / 2, 20);
    textSize(20 + scoreFontSize);
    text(score - scoreToAdd, width - HUD_SIZE / 2, 50);
    
    textSize(16);
    text("Lines to clear", HUD_SIZE / 2, HUD_SIZE + 17);
    text("Level", HUD_SIZE / 2, HUD_SIZE * 2 - 10 + 17);
    textSize(40);
    if(level !== MILLIS_PER_LEVEL.length - 1) {
        text(linesToClear, HUD_SIZE / 2, 1.5 * HUD_SIZE + 8);
    } else {
        text("-", HUD_SIZE / 2, 1.5 * HUD_SIZE + 8);
    }
    text((level + 1), HUD_SIZE / 2, 2.5 * HUD_SIZE - 10 + 8);

    btnControls.draw();

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
                rect(HUD_SIZE + i * BLOCK_SIZE, a * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE, ROUNDNESS);
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
                case 1: score += 10; scoreToAdd += 10; break;
                case 2: score += 30; scoreToAdd += 30; break;
                case 3: score += 60; scoreToAdd += 60; break;
                case 4: score += 100; scoreToAdd += 100; break;
            }
            linesToClear = linesToClear - rowsToDelete.length;
            if(linesToClear <= 0 && level !== MILLIS_PER_LEVEL.length - 1) {
                linesToClear = LINES_TO_CLEAR[++level] + linesToClear;
            }
            animationTimer = -1;
            timer = Date.now() + MILLIS_PER_LEVEL[level];
            sndLineCleared.play();
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
        if(keyTimers[2] < 1 || keyTimers[2] > 30) {
            if(frameCount % 3 === 0) {
                block.modPos(0, 1);
                timer = Date.now() + MILLIS_PER_LEVEL[level];
            }
        }
    } else {
        keyTimers[0] = 0;
        keyTimers[1] = 0;
        keyTimers[2] = 0;
        keyTimers[3] = 0;
    }

    timer--;

    if(scoreToAdd > 0 && scoreFontSize <= 15) {
        if(scoreToAdd < 50) {
            scoreToAdd -= 10;
        } else {
            scoreToAdd -= 20;
        }
        scoreFontSize = 20;
    }
    if(scoreFontSize > 0) {
        scoreFontSize--;
    }

    if(timer < Date.now() || instantDrop) {
        block.modPos(0, 1);
        timer = Date.now() + MILLIS_PER_LEVEL[level];
    }

    popUpWindow.draw();
    
}

function mousePressed() {
    if(btnControls.overlaps()) {
        popUpWindow.show(CONTROLS);
    }
}

function keyPressed() {
    if(keyCode === UP_ARROW) {
        block.rotate();
    }

    if(keyCode === 27) { // ESCAPE
        popUpWindow.hide();
        if(gameOver) {
            init();
        }
    }

    if(keyCode === 32) { // SPACE
        instantDrop = true;
    }

    if(keyCode === 80) { // P
        paused = !paused;
        if(paused) {
            popUpWindow.show(PAUSE);
        } else {
            popUpWindow.hide();
        }
    }

    if(keyCode === 82) { // R
        init();
        popUpWindow.hide();
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

function setGradient(x, y, w, h, c1, c2) {
    push();
    noFill();
  
    for (var i = y; i <= y+h; i++) {
        var inter = map(i, y, y+h, 0, 1);
        var c = lerpColor(c1, c2, inter);
        stroke(c);
        line(x, i, x+w, i);
    }
    pop();
}