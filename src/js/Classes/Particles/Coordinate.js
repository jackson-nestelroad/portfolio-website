// This class represents a single (x, y) coordinate.

export default class Coordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    distance(coord) {
        let dx = coord.x - this.x;
        let dy = coord.y - this.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

    toString() {
        return `${this.x}x${this.y}`;
    }
}