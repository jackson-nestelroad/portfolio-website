// Class for a single (x, y) vector

export default class Vector {
    constructor(public x: number, public y: number) { }

    flip(x: boolean = true, y: boolean = true): void {
        if(x) {
            this.x *= -1;
        }
        if(y) {
            this.y *= -1;
        }
    }

    magnitude(): number {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    angle(): number {
        return Math.tan(this.y / this.x);
    }
}