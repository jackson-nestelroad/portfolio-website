// This class represents a single vector. Practically similar to a Coordinate.

export default class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    flip(x = true, y = true) {
        if(x)
            this.x *= -1;
        if(y)
            this.y *= -1;
    }

    magnitude() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    angle() {
        return Math.tan(this.y / this.x);
    }
}