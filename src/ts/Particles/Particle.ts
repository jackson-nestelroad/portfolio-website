// Class for a single particle to be drawn on the canvas

import { 
    IParticleSettings, 
    IParticleAnimation, 
    ColorSetting, 
    OpacitySetting, 
    RadiusSetting, 
    MoveSetting, 
    SpeedSetting, 
    ShapeSetting, 
    StrokeSetting, 
    IBubbleSetting 
} from './ParticleSettings'

import Animation from './Animation'
import Color from './Color'
import Coordinate from './Coordinate'
import Stroke from './Stroke'
import Vector from './Vector'
import Mouse from './Mouse'

export default class Particle {

    public color: Color;
    public opacity: number;
    public velocity: Vector;
    public shape: string | number;
    public stroke: Stroke;
    public radius: number;
    public position: Coordinate;

    public opacityAnimation: Animation | null = null;
    public radiusAnimation: Animation | null = null;

    public bubbled: { opacity: number, radius: number };

    constructor(settings: IParticleSettings) {
        this.color = this.createColor(settings.color);
        this.opacity = this.createOpacity(settings.opacity);
        this.velocity = this.createVelocity(settings.move);
        this.shape = this.createShape(settings.shape);
        this.stroke = this.createStroke(settings.stroke);
        this.radius = this.createRadius(settings.radius);

        if(settings.animate) {
            if(settings.animate.opacity) {
                this.opacityAnimation = this.animateOpacity(settings.animate.opacity);
            }
            if(settings.animate.radius) {
                this.radiusAnimation = this.animateRadius(settings.animate.radius);
            }
        }

        this.bubbled = {
            opacity: 0,
            radius: 0
        }
    }

    private createColor(color: ColorSetting): Color {
        if(typeof color === 'string') {
            if(color === 'random') {
                return Color.fromRGB(
                    Math.floor(Math.random() * 256),
                    Math.floor(Math.random() * 256),
                    Math.floor(Math.random() * 256)
                );
            }
            else {
                return Color.fromHex(color);
            }
        }
        else if(typeof color === 'object') {
            if(color instanceof Color) {
                return color;
            }
            else if(color instanceof Array) {
                return this.createColor(color[Math.floor(Math.random() * color.length)]);
            }
            else {
                return Color.fromObject(color);
            }
        }
        return Color.fromRGB(0, 0, 0);
    }

    private createOpacity(opacity: OpacitySetting): number {
        if(typeof opacity === 'object') {
            if(opacity instanceof Array) {
                return this.createOpacity(opacity[Math.floor(Math.random() * opacity.length)]);
            }
        }
        else if(typeof opacity === 'string') {
            if(opacity === 'random') {
                return Math.random();
            }
        }
        else if(typeof opacity === 'number') {
            if(opacity >= 0) {
                return opacity;
            }
        }
        return 1;
    }

    private createVelocity(move: MoveSetting): Vector {
        if(typeof move === 'boolean') {
            if(!move) {
                return new Vector(0, 0);
            }
        }
        else if(typeof move === 'object') {
            let velocity: Vector;
            switch(move.direction) {
                case 'top': velocity = new Vector(0, -1); break;
                case 'top-right': velocity = new Vector(0.7, -0.7); break;
                case 'right': velocity = new Vector(1, 0); break;
                case 'bottom-right': velocity = new Vector(0.7, 0.7); break;
                case 'bottom': velocity = new Vector(0, 1); break;
                case 'bottom-left': velocity = new Vector(-0.7, 0.7); break;
                case 'left': velocity = new Vector(-1, 0); break;
                case 'top-left': velocity = new Vector(-0.7, -0.7); break;
                default: velocity = new Vector(0, 0); break;
            }
            if(move.straight) {
                if(move.random) {
                    velocity.x *= Math.random();
                    velocity.y *= Math.random();
                }
            }
            else {
                velocity.x += Math.random() - 0.5;
                velocity.y += Math.random() - 0.5;
            }
            return velocity;
        }
        return new Vector(0, 0);
    }

    private createShape(shape: ShapeSetting): string | number {
        if(typeof shape === 'object') {
            if(shape instanceof Array) {
                return this.createShape(shape[Math.floor(Math.random() * shape.length)]);
            }
        }
        else if(typeof shape === 'string') {
            let sides = parseInt(shape.substring(0, shape.indexOf('-')));
            if(!isNaN(sides)) {
                return this.createShape(sides);
            }
            return shape;
        }
        else if(typeof shape === 'number') {
            if(shape >= 3) {
                return shape;
            }
        }
        return 'circle';
    }

    private createStroke(stroke: StrokeSetting): Stroke {
        if(typeof stroke === 'object') {
            if(typeof stroke.width === 'number') {
                if(stroke.width > 0) {
                    return new Stroke(stroke.width, this.createColor(stroke.color));
                }
            }
        }
        return new Stroke(0, Color.fromRGB(0, 0, 0));
    }

    private createRadius(radius: RadiusSetting): number {
        if(typeof radius === 'object') {
            if(radius instanceof Array) {
                return this.createRadius(radius[Math.floor(Math.random() * radius.length)]);
            }
        }
        else if(typeof radius === 'string') {
            if(radius === 'random') {
                return Math.random();
            }
        }
        else if(typeof radius === 'number') {
            if(radius >= 0) {
                return radius;
            }
        }
        return 5;
    }

    private parseSpeed(speed: SpeedSetting): number {
        if(speed > 0) {
            return speed;
        }
        return 0.5;
    }

    private animateOpacity(animation: IParticleAnimation): Animation {
        if(animation) {
            let max = this.opacity;
            let min = this.createOpacity(animation.min);
            let speed = this.parseSpeed(animation.speed) / 100;
            if(!animation.sync) {
                speed *= Math.random();
            }
            this.opacity *= Math.random();
            return new Animation(speed, max, min);
        }
        return null;
    }

    private animateRadius(animation: IParticleAnimation): Animation {
        if(animation) {
            let max = this.radius;
            let min = this.createRadius(animation.min);
            let speed = this.parseSpeed(animation.speed) / 100;
            if(!animation.sync) {
                speed *= Math.random();
            }
            this.opacity *= Math.random();
            return new Animation(speed, max, min);
        }
        return null;
    }

    public setPosition(position: Coordinate): void {
        this.position = position;
    }

    public move(speed: number): void {
        this.position.x += this.velocity.x * speed;
        this.position.y += this.velocity.y * speed;
    }

    public getRadius(): number {
        return this.radius + this.bubbled.radius;
    }

    public getOpacity(): number {
        return this.opacity + this.bubbled.opacity;
    }

    public edge(dir: 'top' | 'right' | 'bottom' | 'left'): Coordinate {
        switch(dir) {
            case 'top': 
                return new Coordinate(this.position.x, this.position.y - this.getRadius());
            case 'right': 
                return new Coordinate(this.position.x + this.getRadius(), this.position.y);
            case 'bottom': 
                return new Coordinate(this.position.x, this.position.y + this.getRadius());
            case 'left': 
                return new Coordinate(this.position.x - this.getRadius(), this.position.y);
            default:
                return this.position;
        }
    }

    public intersecting(particle: Particle): boolean {
        return this.position.distance(particle.position) < this.getRadius() + particle.getRadius();
    }

    public bubble(mouse: Mouse, settings: IBubbleSetting): void {
        let distance = this.position.distance(mouse.position);
        let ratio = 1 - distance / settings.distance;
        if(ratio >= 0 && mouse.over) {
            this.bubbled.opacity = ratio * (settings.opacity - this.opacity);
            this.bubbled.radius = ratio * (settings.radius - this.radius);
        }
        else {
            this.bubbled.opacity = 0;
            this.bubbled.radius = 0;
        }
    }
}