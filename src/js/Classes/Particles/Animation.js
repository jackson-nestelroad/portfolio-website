// Class to hold information regarding how a particle should animate

export default class Animation {
    constructor(speed, max, min, increasing = false) {
        this.speed = speed;
        this.max = max;
        this.min = min;
        this.increasing = increasing;
    }
}