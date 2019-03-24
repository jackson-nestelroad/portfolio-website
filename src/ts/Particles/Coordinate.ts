// Class representing a single (x, y) coordinate

export default class Coordinate {
    constructor(public x: number, public y: number) { }

    distance(coord: Coordinate): number {
        let dx = coord.x - this.x;
        let dy = coord.y - this.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

    toString(): string {
        return `${this.x}x${this.y}`;
    }
}