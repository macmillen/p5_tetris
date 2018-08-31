class Button {

    constructor(x, y, w, h, txt) {
        this.x = x - w / 2;
        this.y = y;
        this.w = w;
        this.h = h;
        this.txt = txt;
    }

    overlaps() {
        return mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h;
    }

    draw() {
        if(this.overlaps()) {
            fill(255);
            stroke(0);
        } else {
            fill(0);
            stroke(255);
        }
        rect(this.x, this.y, this.w, this.h);
        if(this.overlaps()) {
            fill(0);
        } else {
            fill(255);
        }
        textSize(14);
        text(this.txt, this.x + this.w / 2, this.y + this.h / 2 + 5);
    }
}