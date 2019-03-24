// Class for bundling together stroke size and color

import Color, { ColorObject } from './Color'

export interface StrokeObject {
    width: number,
    color: Color | ColorObject | string | Array<string | Color | ColorObject>
}

export default class Stroke {
    constructor(public width: number, public color: Color) { }
}