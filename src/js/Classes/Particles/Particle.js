// This class is to ONLY be used by Particles.js.
// It is passed certain settings and parses data for a particle to be created.

import Animation from './Animation'
import Color from './Color'
import Coordinate from './Coordinate'
import Stroke from './Stroke'
import Vector from './Vector'

export default class Particle {

    // Use the settings object to get specific values
    constructor(settings) {
        this.color = this._createColor(settings.color);
        this.opacity = this._createOpacity(settings.opacity);
        this.velocity = this._createVelocity(settings.move);
        this.shape = this._createShape(settings.shape);
        this.stroke = this._createStroke(settings.stroke);
        this.radius = this._createRadius(settings.radius);

        this.opacityAnimation = this._animateOpacity(settings.animate);
        this.radiusAnimation = this._animateRadius(settings.animate);

        // Additions to the opacity and radius if the particle is bubbled by the cursor
        this.bubbled = {
            opacity: 0,
            radius: 0
        }
    }

    // Get color of the particle
    _createColor(color) {
        if(typeof(color) === 'object') {
            if(color instanceof Array) {
                return this._createColor(color[Math.floor(Math.random() * color.length)]);
            }
            else {
                return Color.fromObject(color) || new Color(0, 0, 0);
            }
        }
        else if(typeof(color) === 'string') {
            if(color === 'random') {
                return new Color({
                    r: Math.floor(Math.random() * 256),
                    g: Math.floor(Math.random() * 256),
                    b: Math.floor(Math.random() * 256)
                });
            }
            else {
                return Color.fromHex(color) || new Color(0, 0, 0);
            }
        }
        return new Color(0, 0, 0);
    }

    // Get opacity of the particle
    _createOpacity(opacity) {
        if(typeof(opacity) === 'object') {
            if(opacity instanceof Array) {
                return this._createOpacity(opacity[Math.floor(Math.random() * opacity.length)]);
            }
        }
        else if(typeof(opacity) === 'string') {
            if(opacity === 'random') {
                return Math.random();
            }
            else if(!isNaN(parseInt(opacity))) {
                return this._createOpacity(parseInt(opacity));
            }
        }
        else if(typeof(opacity) === 'number') {
            if(opacity >= 0) {
                return opacity;
            }
        }
        return 1;
    }

    // Get velocity of the particle
    _createVelocity(move) {
        if(typeof(move) === 'boolean') {
            if(!move) {
                return new Vector(0, 0);
            }
        }
        else if(typeof(move) === 'object') {
            let velocity;
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
    }

    // Get shape of the particle
    _createShape(shape) {
        if(typeof(shape) === 'object') {
            if(shape instanceof Array) {
                return this._createShape(shape[Math.floor(Math.random() * shape.length)]);
            }
        }
        else if(typeof(shape) === 'string') {
            let sides = parseInt(shape.substring(0, shape.indexOf('-')));
            if(!isNaN(sides)) {
                return this._createShape(sides);
            }
            return shape;
        }
        else if(typeof(shape) === 'number') {
            if(shape >= 3) {
                return shape;
            }
        }
        return 'circle';
    }

    // Get stroke of the particle
    _createStroke(stroke) {
        if(typeof(stroke) === 'object') {
            if(typeof(stroke.width) === 'number') {
                if(stroke.width > 0) {
                    return new Stroke(stroke.width, this._createColor(stroke.color));
                }
            }
        }
        return new Stroke(0, new Color(0, 0, 0));
    }

    // Get radius of the particle
    _createRadius(radius) {
        if(typeof(radius) === 'object') {
            if(radius instanceof Array) {
                return this._createRadius(radius[Math.floor(Math.random() * radius.length)]);
            }
        }
        else if(typeof(radius) === 'number') {
            if(radius >= 0) {
                return radius;
            }
        }
        return 5;
    }

    // Create animation object for opacity
    _animateOpacity(animation) {
        let speed = null;
        let max = this.opacity;
        let min = 0;
        if(animation && animation.opacity) {
            min = this._createOpacity(animation.opacity.min);
            speed = this._parseSpeed(animation.opacity.speed) / 100;
            if(!animation.opacity.sync) {
                speed *= Math.random();
            }
            this.opacity *= Math.random();
        }
        return new Animation(speed, max, min);
    }

    // Create animation object for radius
    _animateRadius(animation) {
        let speed = null;
        let max = this.radius;
        let min = 0;
        if(animation && animation.radius) {
            min = this._createRadius(animation.radius.min);
            speed = this._parseSpeed(animation.radius.speed) / 100;
            if(!animation.radius.sync) {
                speed *= Math.random();
            }
            this.radius *= Math.random();
        }
        return new Animation(speed, max, min);
    }

    // Parse the speed of any animation
    _parseSpeed(speed) {
        if(typeof(speed) === 'object') {
            if(speed instanceof Array) {
                return this._parseSpeed(speed[Math.floor(Math.random() * speed.length)]);
            }
        }
        else if(typeof(speed) === 'string') {
            if(speed === 'random') {
                return Math.random();
            }
        }
        else if(typeof(speed) === 'number') {
            if(speed > 0) {
                return speed;
            }
        }
        return 0.5;
    }

    // Set the particle position in the canvas
    setPosition(position) {
        this.position = position;
    }

    // Move the particle according to its velocity
    move(speed) {
        this.position.x += this.velocity.x * speed;
        this.position.y += this.velocity.y * speed;
    }

    // Get an edge of the particle
    edge(dir) {
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

    // Check if two particles are intersecting
    intersecting(particle) {
        return this.position.distance(particle.position) < this.getRadius() + particle.getRadius();
    }

    // Check if two particles are touching
    touching(particle) {
        return this.position.distance(particle.position) <= this.getRadius() + particle.getRadius();
    }

    // Get the total radius
    getRadius() {
        return this.radius + this.bubbled.radius;
    }

    // Get the total opacity
    getOpacity() {
        return this.opacity + this.bubbled.opacity;
    }

    // UNUSED
    // Create an elastic collision between two particles
    elasticCollide(particle) {
        let dy = this.position.y - particle.position.y;
        let dx = this.position.x - particle.position.x;
        let contactAngle = Math.atan(dy / dx);

        let frac = this.velocity.magnitude();
        frac *= Math.cos(this.velocity.angle() - contactAngle);
        frac *= (this.getRadius() - particle.getRadius());
        frac += (2 * particle.getRadius() * particle.velocity.magnitude() * Math.cos(particle.velocity.angle() - contactAngle));
        frac /= this.getRadius() + particle.getRadius();

        let vx = frac * Math.cos(contactAngle) + this.velocity.magnitude();
        vx *= Math.sin(this.velocity.angle() - contactAngle) * Math.sin(contactAngle);

        let vy = frac * Math.sin(contactAngle) + this.velocity.magnitude();
        vy *= Math.sin(this.velocity.angle() - contactAngle) * Math.cos(contactAngle);

        return new Vector(vx, vy);
    }

    // UNUSED
    // Bounce two particles off of each other
    bounce(particle) {
        if(this.touching(particle) && this.position.y !== particle.position.y && this.position.x !== particle.position.x) {
            // this.velocity.flip();
            // particle.velocity.flip();
            let newThisVelocity = this.elasticCollide(particle);
            particle.velocity = particle.elasticCollide(this);
            this.velocity = newThisVelocity;

            this.position.x++;
            this.position.y++;
        }
    }

    // Bubble up the particle due to cursor position
    bubble(mouse, settings) {
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