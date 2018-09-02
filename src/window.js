
class PopUpWindow {
    
    constructor(x, y, w, h, mode) {
        this.display = false;
        this.x = x - w / 2;
        this.y = y - h / 2;
        this.w = w;
        this.h = h;
        this.mode = mode;
    }

    draw() {
        if(this.display) {
            stroke(255);
            fill(0, 150);
            rect(this.x, this.y, this.w, this.h);

            if(this.mode === CONTROLS) {
                fill(255);
                noStroke();
                textAlign(LEFT);
                textSize(20);
                text(`
                Move Left:\n
                Move Right:\n
                Hard Drop:\n
                Soft Drop:\n
                Rotate:\n
                Hold:\n
                Restart:\n
                Pause:\n
                `, this.x - 20, this.y + 30);
    
                fill("#C4E538");
                text(`
                LEFT Arrow\n
                RIGHT Arrow\n
                Space Bar\n
                DOWN Arrow\n
                UP Arrow\n
                C\n
                R\n
                P\n
                `, this.x + this.w / 2 - 50, this.y + 30);
    
                fill("255")
                textAlign(CENTER);
                textSize(30);
                text("Press ESC to close", this.x + this.w / 2, this.y + this.h - 40);
            } else if(this.mode === GAME_OVER) {
                fill(255);
                noStroke();
                textAlign(CENTER);
                textSize(50);
                text("GAME OVER", this.x + this.w / 2, this.y + this.h * 0.25);
                textSize(30);
                text("Final Score", this.x + this.w / 2, this.y + this.h  * 0.45);
                textSize(60);
                text(score, this.x + this.w / 2, this.y + this.h  * 0.60);
                textSize(35);
                text("Press R\nto restart", this.x + this.w / 2, this.y + this.h  * 0.77);
            }

            noLoop();
        }
    }

    hide() {
        this.display = false;
        loop();
    }

    show() {
        this.display = true;
    }

}