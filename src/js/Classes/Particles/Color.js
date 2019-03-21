// This class represents a single RGB color.

export default class Color {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    // Create instance from RGB values
    static fromRGB(r, g, b) {
        if(r >= 0 && r < 256 && g >= 0 && g < 256 && b >= 0 && b < 256)
            return new Color(r, g, b);
        else
            return null;
    }

    // Create instance from Object {r, g, b}
    static fromObject(obj) {
        if(obj.r && obj.g && obj.b)
            return new Color(obj.r, obj.g, obj.b);
        else
            return null;
        }

        // Create instance from HEX value
    static fromHex(hex) {
        return Color.fromObject(Color.hexToRGB(hex));
    }

    // Convert HEX to RGB Object
    static hexToRGB(hex) {
        let result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // Create rgba() string with optional opacity
    toString(opacity = 1) {
        return `rgba(${this.r},${this.g},${this.b},${opacity})`;
    }
}