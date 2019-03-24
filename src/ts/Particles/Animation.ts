// Class to hold information regarding how a particle should animate

export default class Animation {
    constructor(public speed: number, public max: number, public min: number, public increasing: boolean = false) { }
}