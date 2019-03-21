// This class is a loose framework for creating particles
// Based on particles.js by VincentGarreau
// Re-imagined in ES6 JavaScript using classes and internal states

import AnimationFrameFunctions from './AnimationFrameFunctions'
import DOM from '../DOM'
import Coordinate from './Coordinate'
import Color from './Color'
import Particle from './Particle'

export default class Particles {
    constructor(htmlID, context) {
        // Set up canvas and context objects
        this.canvas = DOM.getFirstElement(htmlID);

        if(this.canvas === null)
            throw `Canvas ID ${htmlID} not found.`;

        this.ctx = this.canvas.getContext(context);
        this.pixelRatioLimit = 8;

        // Get which animation functions to use
        window.requestAnimationFrame = AnimationFrameFunctions.requestAnimationFrame();
        window.cancelAnimationFrame = AnimationFrameFunctions.cancelAnimationFrame();

        // Particle settings
        this.particleSettings = {
            number: 350,
            density: 1000,
            color: '#FFFFFF',
            opacity: 1,
            radius: 5,
            shape: 'circle',
            stroke: {
                width: 0,
                color: '#000000'
            },
            move: {
                speed: 0.4,
                direction: 'bottom',
                straight: true,
                random: true,
                edgeBounce: false,
                bounce: false,
                attract: false
            },
            events: {
                resize: true,
                hover: false
            },
            animate: {
                opacity: false,
                radius: false
            }
        }

        // Settings for interactive modes
        this.interactiveSettings = {
            hover: {
                bubble: {
                    distance: 75,
                    radius: 7,
                    opacity: 1
                },
                repulse: {
                    distance: 100,   
                }
            },
            click: {
                add: {
                    number: 4
                },
                remove: {
                    number: 2
                }
            }
        }
        
        // States
        this.bg = null;
        this.pixelRatio = 1;
        this.particles = new Array();
        this.mouse = {
            position: new Coordinate(null, null),
            over: false
        }
        this.handleResize = null;
        this.animationFrame = null;
        this.mouseEventsAttached = false;
    }

    /************************************************ INITIALIZERS ************************************************/

    // This function must be called to initialize the canvas
    initialize() {
        // console.log(`Initializing from ${this.pixelRatio} to ${window.devicePixelRatio}.`);
        this.trackMouse();
        this.initializePixelRatio(window.devicePixelRatio >= this.pixelRatioLimit ? this.pixelRatioLimit - 2 : window.devicePixelRatio);
        this.setCanvasSize();
        this.clear();
        this.removeParticles();
        this.createParticles();
        this.distributeParticles();
    }

    // Adds event listeners to track the mouse
    trackMouse() {
        if(this.mouseEventsAttached) {
            return;
        }
        if(this.particleSettings.events) {
            if(this.particleSettings.events.hover) {
                this.canvas.addEventListener('mousemove', event => {
                    this.mouse.position.x = event.offsetX * this.pixelRatio;
                    this.mouse.position.y = event.offsetY * this.pixelRatio;
                    this.mouse.over = true;
                });
                this.canvas.addEventListener('mouseleave', () => {
                    this.mouse.position.x = null;
                    this.mouse.position.y = null;
                    this.mouse.over = false;
                });
            }
            if(this.particleSettings.events.click) {
                // Add onclick event listener here
            }
        }
        this.mouseEventsAttached = true;
    }

    // Scale the canvas and settings depending on the the user's screen size
    initializePixelRatio(newRatio = window.devicePixelRatio) {
        let multiplier = newRatio / this.pixelRatio;

        this.width = this.canvas.offsetWidth * multiplier;
        this.height = this.canvas.offsetHeight * multiplier;

        if(this.particleSettings.radius instanceof Array) {
            this.particleSettings.radius = this.particleSettings.radius.map(r => r * multiplier);
        }
        else {
            this.particleSettings.radius *= multiplier;
        }
        this.particleSettings.move.speed *= multiplier;
        if(this.particleSettings.animate && this.particleSettings.animate.radius) {
            this.particleSettings.animate.radius.speed *= multiplier;
        }
        this.interactiveSettings.hover.bubble.radius *= multiplier;
        this.interactiveSettings.hover.bubble.distance *= multiplier;
        this.interactiveSettings.hover.repulse.distance *= multiplier;

        this.pixelRatio = newRatio;
    }

    // Check if the window's zoom has changed and restart the canvas
    checkZoom() {
        // console.log(window.devicePixelRatio, this.pixelRatio);
        if(window.devicePixelRatio !== this.pixelRatio && window.devicePixelRatio < this.pixelRatioLimit) {
            this.stopDrawing();
            this.initialize();
            this.draw();
        }
    }

    // Set the canvas size, and reset it as the window resizes
    setCanvasSize() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        if(this.particleSettings.events && this.particleSettings.events.resize) {
            this.handleResize = () => {
                // Check if the device pixel ratio has changed
                this.checkZoom();
    
                // Recalculate the canvas size
                this.width = this.canvas.offsetWidth * this.pixelRatio;
                this.height = this.canvas.offsetHeight * this.pixelRatio;
    
                this.canvas.width = this.width;
                this.canvas.height = this.height;
    
                // Manually redraw the canvas if particles are not moving
                if(!this.particleSettings.move) {
                    this.removeParticles();
                    this.createParticles();
                    this.drawParticles(); 
                }          
                this.distributeParticles();
            }
            window.addEventListener('resize', this.handleResize);
        }
    }

    /************************************************ CANVAS ************************************************/

    // Get the current fill color
    getFill() {
        return this.ctx.fillStyle;
    }

    // Set the fill color
    setFill(color) {
        if(color.constructor === Color)
            this.ctx.fillStyle = color.toString();
        else
            this.ctx.fillStyle = color;
    }

    // Set the stroke according to a Stroke object
    setStroke(stroke) {
        this.ctx.strokeStyle = stroke.color.toString();
        this.ctx.lineWidth = stroke.width;
    }

    // Reset canvas
    clear() {
        if(!this.bg)
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        else {
            this.setFill(this.bg);
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    // Set the BG color
    setBG(color) {
        if(typeof(color) === 'object') {
            this.bg = Color.fromObject(color);
        }
        else if(typeof(color) === 'string') {
            this.bg = Color.fromHex(color);
        }

        if(this.bg === null) {
            this.bg = new Color(0, 0, 0);
        }
    }

    /************************************************ DRAWING ************************************************/

    // Set up the animation frames
    draw() {
        this.drawParticles();
        if(this.particleSettings.move)
            this.animationFrame = window.requestAnimationFrame(this.draw.bind(this));
    }

    // Stop the canvas from redrawing
    stopDrawing() {
        if(this.handleResize) {
            window.removeEventListener('resize', this.handleResize);
            this.handleResize = null;
        }
        if(this.animationFrame) {
            window.cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    // Draw a regular polygon
    drawPolygon(center, radius, sides) {
        // Calculate the angle created between interior diagonals
        let diagonalAngle = 360 / sides;
        diagonalAngle *= Math.PI / 180;

        // Begin path at the top of the shape
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.translate(center.x, center.y);
        this.ctx.rotate(diagonalAngle / (sides % 2 ? 4 : 2));
        this.ctx.moveTo(radius, 0);
        
        // Draw each side 
        let angle;
        for(let s = 0; s < sides; s++) {
            angle = s * diagonalAngle;
            this.ctx.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
        }
        this.ctx.fill();
        this.ctx.restore();
    }

    // Draw a particle object
    drawParticle(particle) {
        let opacity = particle.getOpacity();
        let radius = particle.getRadius();
        this.setFill(particle.color.toString(opacity));
        this.ctx.beginPath();

        // Draw a polygon
        if(typeof(particle.shape) === 'number') {
            this.drawPolygon(particle.position, radius, particle.shape);
        }
        // Draw a specific shape
        else {
            switch(particle.shape) {
                default:
                case 'circle': 
                    this.ctx.arc(particle.position.x, particle.position.y, radius, 0, Math.PI * 2, false);
                    break;
            }
        }
        this.ctx.closePath();

        // Add stroke if necessary
        if(particle.stroke.width > 0) {
            this.setStroke(particle.stroke);
            this.ctx.stroke();
        }
        this.ctx.fill();
    }

    /************************************************ POSITION ************************************************/

    // Get a new position on the screen
    getNewPosition() {
        // Get random position on the screen
        return new Coordinate(Math.random() * this.canvas.width, Math.random() * this.canvas.height);
    }

    // Check that position on screen is valid
    checkPosition(particle) {
        if(this.particleSettings.move) {
            // Check that position is not off the screen
            if(this.particleSettings.move.edgeBounce) {
                if(particle.edge('left').x < 0)
                    particle.position.x += particle.getRadius();
                else if(particle.edge('right').x > this.width)
                    particle.position.x -= particle.getRadius();
                if(particle.edge('top').y < 0)
                    particle.position.y += particle.getRadius();
                else if(particle.edge('bottom').y > this.height)
                    particle.position.y -= particle.getRadius();
            }
    
            // Check that no particle overlaps
            // if(this.particleSettings.move.bounce) {
            //     for(let compare of this.particles) {
            //         if(particle.intersecting(compare)) {
            //             return false;
            //         }
            //     }
            // }
        }
        return true;
    }

    // Add more particles based on density
    distributeParticles() {
        if(this.particleSettings.density && typeof(this.particleSettings.density) === 'number') {
            let area = this.canvas.width * this.canvas.height / 1000;
            area /= this.pixelRatio * 2;

            let particlesPerArea = area * this.particleSettings.number / this.particleSettings.density;
            let missing = particlesPerArea - this.particles.length;
            if(missing > 0) {
                this.createParticles(missing);
            }
            else {
                this.removeParticles(Math.abs(missing));
            }
        }
    }

    /************************************************ PARTICLES ************************************************/

    // Create particles
    createParticles(number = this.particleSettings.number, position) {
        // Settings must be initalized before a particle instance is created
        if(!this.particleSettings)
            throw 'Particle settings must be initalized before a particle is created.';

        let particle;
        for(let p = 0; p < number; p++) {
            particle = new Particle(this.particleSettings);

            if(position) {
                particle.setPosition(position);
            }
            else {
                do {
                    particle.setPosition(this.getNewPosition());
                } while(!this.checkPosition(particle));
            }

            this.particles.push(particle);
        }
    }

    // Remove particles
    removeParticles(number) {
        if(!number) {
            this.particles = new Array();
        }
        else {
            this.particles.splice(0, number);
        }
    }

    // Update particles for redraw
    updateParticles() {
        for(let particle of this.particles) {
            // Particles are moving
            if(this.particleSettings.move) {
                // Move the particle in its direction
                particle.move(this.particleSettings.move.speed);

                // Change particle position if out of canvas
                if(!this.particleSettings.move.edgeBounce) {
                    if(particle.edge('right').x < 0) {
                        particle.setPosition(new Coordinate(this.width + particle.getRadius(), Math.random() * this.height));
                    }
                    else if(particle.edge('left').x > this.width) {
                        particle.setPosition(new Coordinate(-1 * particle.getRadius(), Math.random() * this.height));
                    }
                    if(particle.edge('bottom').y < 0) {
                        particle.setPosition(new Coordinate(Math.random() * this.width, this.height + particle.getRadius()));
                    }
                    else if(particle.edge('top').y > this.height) {
                        particle.setPosition(new Coordinate(Math.random() * this.width, -1 * particle.getRadius()));
                    }
                }

                // Bounce particles off of edges
                if(this.particleSettings.move.edgeBounce) {
                    if(particle.edge('left').x < 0 || particle.edge('right').x > this.width) {
                        particle.velocity.flip(true, false);
                    }
                    if(particle.edge('top').y < 0 || particle.edge('bottom').y > this.height) {
                        particle.velocity.flip(false, true);
                    }
                }
            }
            // Handle particle animations
            if(this.particleSettings.animate) {
                // Animate opacity
                if(this.particleSettings.animate.opacity) {
                    // Toggle between increasing and decreasing
                    if(particle.opacity >= particle.opacityAnimation.max) {
                        particle.opacityAnimation.increasing = false;
                    }
                    else if(particle.opacity <= particle.opacityAnimation.min) {
                        particle.opacityAnimation.increasing = true;
                    }
                    // Change the opacity
                    particle.opacity += particle.opacityAnimation.speed * (particle.opacityAnimation.increasing ? 1 : -1);
                    // Make sure we don't go negative
                    if(particle.opacity < 0) {
                        particle.opacity = 0;
                    }
                }
                // Animate radius
                if(this.particleSettings.animate.radius) {
                    // Toggle between increasing and decreasing
                    if(particle.radius >= particle.radiusAnimation.max) {
                        particle.radiusAnimation.increasing = false;
                    }
                    else if(particle.radius <= particle.radiusAnimation.min) {
                        particle.radiusAnimation.increasing = true;
                    }
                    // Change the radius
                    particle.radius += particle.radiusAnimation.speed * (particle.radiusAnimation.increasing ? 1 : -1);
                    // Make sure we don't go negative
                    if(particle.radius < 0) {
                        particle.radius = 0;
                    }
                }
            }
            // Handle interactive events
            if(this.particleSettings.events) {
                // Bubble particles on hover
                if(this.particleSettings.events.hover === 'bubble') {
                    particle.bubble(this.mouse, this.interactiveSettings.hover.bubble);
                }
            }
        }
    }

    // Draw all particles on the canvas
    drawParticles() {
        this.clear();
        this.updateParticles();
        for(let particle of this.particles) {
            this.drawParticle(particle);
        }
    }
}