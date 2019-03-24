// Class representing a single RGB color

export interface ColorObject {
    r: number, 
    g: number, 
    b: number
}

export default class Color {

    private constructor(public r: number, public g: number, public b: number) { }

    static fromRGB(r: number, g: number, b: number): Color {
        if(r >= 0 && r < 256 && g >= 0 && g < 256 && b >= 0 && b < 256) {
            return new Color(r, g, b);
        }
        else {
            return null;
        }
    }

    static fromObject(obj: ColorObject): Color {
        return Color.fromRGB(obj.r, obj.g, obj.b);
    }

    static fromHex(hex: string): Color {
        return Color.fromObject(Color.hexToRGB(hex));
    }

    static hexToRGB(hex: string): ColorObject {
        let result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    toString(opacity: number = 1): string {
        return `rgba(${this.r},${this.g},${this.b},${opacity})`;
    }
}