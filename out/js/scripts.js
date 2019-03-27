(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Particles_1 = require("../Particles/Particles");
var Stars_1 = require("./Stars");
var canvas = new Particles_1.default('#particles', '2d');
canvas.setParticleSettings(Stars_1.Stars.Particles);
canvas.setInteractiveSettings(Stars_1.Stars.Interactive);
canvas.start();

},{"../Particles/Particles":18,"./Stars":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stars = {
    Particles: {
        number: 350,
        density: 200,
        color: '#FFFFFF',
        opacity: 'random',
        radius: [1, 1.5, 2, 2.5, 3, 3.5],
        shape: 'circle',
        stroke: {
            width: 0,
            color: '#000000'
        },
        move: {
            speed: 0.2,
            direction: 'random',
            straight: false,
            random: true,
            edgeBounce: false,
            attract: false
        },
        events: {
            resize: true,
            hover: 'bubble',
            click: false
        },
        animate: {
            opacity: {
                speed: 0.2,
                min: 0,
                sync: false
            },
            radius: {
                speed: 3,
                min: 0,
                sync: false
            }
        }
    },
    Interactive: {
        hover: {
            bubble: {
                distance: 75,
                radius: 7,
                opacity: 1
            }
        }
    }
};

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DOM_1 = require("../Modules/DOM");
var Section = (function () {
    function Section(element) {
        this.element = element;
    }
    Section.prototype.inView = function () {
        var bounding = this.element.getBoundingClientRect();
        var view = DOM_1.DOM.getViewport();
        return bounding.bottom >= 0 &&
            bounding.right >= 0 &&
            bounding.top <= view.height &&
            bounding.left <= view.width;
    };
    Section.prototype.getID = function () {
        return this.element.id;
    };
    return Section;
}());
exports.default = Section;

},{"../Modules/DOM":7}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebPage_1 = require("../Modules/WebPage");
var delay = 1000;
document.addEventListener('DOMContentLoaded', function () {
    var _loop_1 = function (i) {
        setTimeout(function () {
            WebPage_1.CanvasText.children[i].classList.remove('preload');
        }, delay * (i + 1));
    };
    for (var i = 0; i < WebPage_1.CanvasText.childElementCount; i++) {
        _loop_1(i);
    }
});

},{"../Modules/WebPage":9}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebPage_1 = require("../Modules/WebPage");
var SVG_1 = require("../Modules/SVG");
function CreateLogo(Logo, part, delay) {
    var Use = document.createElementNS(SVG_1.SVG.svgns, 'use');
    Use.classList.value = part + " preload";
    Use.setAttributeNS(SVG_1.SVG.xlinkns, 'href', "out/images/Logo.svg#" + part);
    Use.addEventListener('load', function () {
        setTimeout(function () {
            Use.classList.remove('preload');
        }, delay);
    });
    Logo.append(Use);
}
document.addEventListener('DOMContentLoaded', function () {
    CreateLogo(WebPage_1.Logo, 'outer', 0);
    CreateLogo(WebPage_1.Logo, 'inner', 400);
});

},{"../Modules/SVG":8,"../Modules/WebPage":9}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Menu_1 = require("../Namespaces/Menu");
Menu_1.Menu.hamburger.addEventListener('click', function () {
    Menu_1.Menu.toggle();
});

},{"../Namespaces/Menu":10}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DOM;
(function (DOM) {
    function getElements(query) {
        return document.querySelectorAll(query);
    }
    DOM.getElements = getElements;
    function getFirstElement(query) {
        return this.getElements(query)[0];
    }
    DOM.getFirstElement = getFirstElement;
    function getViewport() {
        return {
            height: window.innerHeight || document.documentElement.clientHeight,
            width: window.innerWidth || document.documentElement.clientWidth
        };
    }
    DOM.getViewport = getViewport;
    function scrollTo(x, y) {
        window.scrollTo({
            top: y,
            left: x,
            behavior: 'smooth'
        });
    }
    DOM.scrollTo = scrollTo;
})(DOM = exports.DOM || (exports.DOM = {}));

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SVG;
(function (SVG) {
    SVG.svgns = 'http://www.w3.org/2000/svg';
    SVG.xlinkns = 'http://www.w3.org/1999/xlink';
})(SVG = exports.SVG || (exports.SVG = {}));

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DOM_1 = require("./DOM");
var Section_1 = require("../Classes/Section");
exports.Logo = DOM_1.DOM.getFirstElement("header.logo .image svg");
exports.CanvasText = DOM_1.DOM.getFirstElement('div.canvas div.canvas-text-container');
exports.Menu = {
    Hamburger: DOM_1.DOM.getFirstElement('header.menu .hamburger')
};
exports.Sections = new Object();
for (var _i = 0, _a = Array.from(DOM_1.DOM.getElements('section')); _i < _a.length; _i++) {
    var element = _a[_i];
    exports.Sections[element.id] = new Section_1.default(element);
}

},{"../Classes/Section":3,"./DOM":7}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebPage_1 = require("../Modules/WebPage");
var Menu;
(function (Menu) {
    var open = false;
    var right = false;
    Menu.hamburger = WebPage_1.Menu.Hamburger;
    function toggle() {
        open = !open;
        if (open) {
            Menu.hamburger.classList.add('open');
        }
        else {
            Menu.hamburger.classList.remove('open');
        }
    }
    Menu.toggle = toggle;
})(Menu = exports.Menu || (exports.Menu = {}));

},{"../Modules/WebPage":9}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Animation = (function () {
    function Animation(speed, max, min, increasing) {
        if (increasing === void 0) { increasing = false; }
        this.speed = speed;
        this.max = max;
        this.min = min;
        this.increasing = increasing;
    }
    return Animation;
}());
exports.default = Animation;

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AnimationFrameFunctions;
(function (AnimationFrameFunctions) {
    function requestAnimationFrame() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            function (callback) {
                return window.setTimeout(callback, 1000 / 60);
            };
    }
    AnimationFrameFunctions.requestAnimationFrame = requestAnimationFrame;
    function cancelAnimationFrame() {
        return window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            clearTimeout;
    }
    AnimationFrameFunctions.cancelAnimationFrame = cancelAnimationFrame;
})(AnimationFrameFunctions = exports.AnimationFrameFunctions || (exports.AnimationFrameFunctions = {}));

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Color = (function () {
    function Color(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    Color.fromRGB = function (r, g, b) {
        if (r >= 0 && r < 256 && g >= 0 && g < 256 && b >= 0 && b < 256) {
            return new Color(r, g, b);
        }
        else {
            return null;
        }
    };
    Color.fromObject = function (obj) {
        return Color.fromRGB(obj.r, obj.g, obj.b);
    };
    Color.fromHex = function (hex) {
        return Color.fromObject(Color.hexToRGB(hex));
    };
    Color.hexToRGB = function (hex) {
        var result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };
    Color.prototype.toString = function (opacity) {
        if (opacity === void 0) { opacity = 1; }
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + opacity + ")";
    };
    return Color;
}());
exports.default = Color;

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Coordinate = (function () {
    function Coordinate(x, y) {
        this.x = x;
        this.y = y;
    }
    Coordinate.prototype.distance = function (coord) {
        var dx = coord.x - this.x;
        var dy = coord.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    };
    Coordinate.prototype.toString = function () {
        return this.x + "x" + this.y;
    };
    return Coordinate;
}());
exports.default = Coordinate;

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Animation_1 = require("./Animation");
var Color_1 = require("./Color");
var Coordinate_1 = require("./Coordinate");
var Stroke_1 = require("./Stroke");
var Vector_1 = require("./Vector");
var Particle = (function () {
    function Particle(settings) {
        this.opacityAnimation = null;
        this.radiusAnimation = null;
        this.color = this.createColor(settings.color);
        this.opacity = this.createOpacity(settings.opacity);
        this.velocity = this.createVelocity(settings.move);
        this.shape = this.createShape(settings.shape);
        this.stroke = this.createStroke(settings.stroke);
        this.radius = this.createRadius(settings.radius);
        if (settings.animate) {
            if (settings.animate.opacity) {
                this.opacityAnimation = this.animateOpacity(settings.animate.opacity);
            }
            if (settings.animate.radius) {
                this.radiusAnimation = this.animateRadius(settings.animate.radius);
            }
        }
        this.bubbled = {
            opacity: 0,
            radius: 0
        };
    }
    Particle.prototype.createColor = function (color) {
        if (typeof color === 'string') {
            if (color === 'random') {
                return Color_1.default.fromRGB(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256));
            }
            else {
                return Color_1.default.fromHex(color);
            }
        }
        else if (typeof color === 'object') {
            if (color instanceof Color_1.default) {
                return color;
            }
            else if (color instanceof Array) {
                return this.createColor(color[Math.floor(Math.random() * color.length)]);
            }
            else {
                return Color_1.default.fromObject(color);
            }
        }
        return Color_1.default.fromRGB(0, 0, 0);
    };
    Particle.prototype.createOpacity = function (opacity) {
        if (typeof opacity === 'object') {
            if (opacity instanceof Array) {
                return this.createOpacity(opacity[Math.floor(Math.random() * opacity.length)]);
            }
        }
        else if (typeof opacity === 'string') {
            if (opacity === 'random') {
                return Math.random();
            }
        }
        else if (typeof opacity === 'number') {
            if (opacity >= 0) {
                return opacity;
            }
        }
        return 1;
    };
    Particle.prototype.createVelocity = function (move) {
        if (typeof move === 'boolean') {
            if (!move) {
                return new Vector_1.default(0, 0);
            }
        }
        else if (typeof move === 'object') {
            var velocity = void 0;
            switch (move.direction) {
                case 'top':
                    velocity = new Vector_1.default(0, -1);
                    break;
                case 'top-right':
                    velocity = new Vector_1.default(0.7, -0.7);
                    break;
                case 'right':
                    velocity = new Vector_1.default(1, 0);
                    break;
                case 'bottom-right':
                    velocity = new Vector_1.default(0.7, 0.7);
                    break;
                case 'bottom':
                    velocity = new Vector_1.default(0, 1);
                    break;
                case 'bottom-left':
                    velocity = new Vector_1.default(-0.7, 0.7);
                    break;
                case 'left':
                    velocity = new Vector_1.default(-1, 0);
                    break;
                case 'top-left':
                    velocity = new Vector_1.default(-0.7, -0.7);
                    break;
                default:
                    velocity = new Vector_1.default(0, 0);
                    break;
            }
            if (move.straight) {
                if (move.random) {
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
        return new Vector_1.default(0, 0);
    };
    Particle.prototype.createShape = function (shape) {
        if (typeof shape === 'object') {
            if (shape instanceof Array) {
                return this.createShape(shape[Math.floor(Math.random() * shape.length)]);
            }
        }
        else if (typeof shape === 'string') {
            var sides = parseInt(shape.substring(0, shape.indexOf('-')));
            if (!isNaN(sides)) {
                return this.createShape(sides);
            }
            return shape;
        }
        else if (typeof shape === 'number') {
            if (shape >= 3) {
                return shape;
            }
        }
        return 'circle';
    };
    Particle.prototype.createStroke = function (stroke) {
        if (typeof stroke === 'object') {
            if (typeof stroke.width === 'number') {
                if (stroke.width > 0) {
                    return new Stroke_1.default(stroke.width, this.createColor(stroke.color));
                }
            }
        }
        return new Stroke_1.default(0, Color_1.default.fromRGB(0, 0, 0));
    };
    Particle.prototype.createRadius = function (radius) {
        if (typeof radius === 'object') {
            if (radius instanceof Array) {
                return this.createRadius(radius[Math.floor(Math.random() * radius.length)]);
            }
        }
        else if (typeof radius === 'string') {
            if (radius === 'random') {
                return Math.random();
            }
        }
        else if (typeof radius === 'number') {
            if (radius >= 0) {
                return radius;
            }
        }
        return 5;
    };
    Particle.prototype.parseSpeed = function (speed) {
        if (speed > 0) {
            return speed;
        }
        return 0.5;
    };
    Particle.prototype.animateOpacity = function (animation) {
        if (animation) {
            var max = this.opacity;
            var min = this.createOpacity(animation.min);
            var speed = this.parseSpeed(animation.speed) / 100;
            if (!animation.sync) {
                speed *= Math.random();
            }
            this.opacity *= Math.random();
            return new Animation_1.default(speed, max, min);
        }
        return null;
    };
    Particle.prototype.animateRadius = function (animation) {
        if (animation) {
            var max = this.radius;
            var min = this.createRadius(animation.min);
            var speed = this.parseSpeed(animation.speed) / 100;
            if (!animation.sync) {
                speed *= Math.random();
            }
            this.opacity *= Math.random();
            return new Animation_1.default(speed, max, min);
        }
        return null;
    };
    Particle.prototype.setPosition = function (position) {
        this.position = position;
    };
    Particle.prototype.move = function (speed) {
        this.position.x += this.velocity.x * speed;
        this.position.y += this.velocity.y * speed;
    };
    Particle.prototype.getRadius = function () {
        return this.radius + this.bubbled.radius;
    };
    Particle.prototype.getOpacity = function () {
        return this.opacity + this.bubbled.opacity;
    };
    Particle.prototype.edge = function (dir) {
        switch (dir) {
            case 'top':
                return new Coordinate_1.default(this.position.x, this.position.y - this.getRadius());
            case 'right':
                return new Coordinate_1.default(this.position.x + this.getRadius(), this.position.y);
            case 'bottom':
                return new Coordinate_1.default(this.position.x, this.position.y + this.getRadius());
            case 'left':
                return new Coordinate_1.default(this.position.x - this.getRadius(), this.position.y);
            default:
                return this.position;
        }
    };
    Particle.prototype.intersecting = function (particle) {
        return this.position.distance(particle.position) < this.getRadius() + particle.getRadius();
    };
    Particle.prototype.bubble = function (mouse, settings) {
        var distance = this.position.distance(mouse.position);
        var ratio = 1 - distance / settings.distance;
        if (ratio >= 0 && mouse.over) {
            this.bubbled.opacity = ratio * (settings.opacity - this.opacity);
            this.bubbled.radius = ratio * (settings.radius - this.radius);
        }
        else {
            this.bubbled.opacity = 0;
            this.bubbled.radius = 0;
        }
    };
    return Particle;
}());
exports.default = Particle;

},{"./Animation":11,"./Color":13,"./Coordinate":14,"./Stroke":19,"./Vector":20}],17:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AnimationFrameFunctions_1 = require("./AnimationFrameFunctions");
var DOM_1 = require("../Modules/DOM");
var Coordinate_1 = require("./Coordinate");
var Particle_1 = require("./Particle");
var Particles = (function () {
    function Particles(cssQuery, context) {
        this.running = false;
        this.pixelRatioLimit = 8;
        this.pixelRatio = 1;
        this.particles = new Array();
        this.mouse = {
            position: new Coordinate_1.default(0, 0),
            over: false
        };
        this.handleResize = null;
        this.animationFrame = null;
        this.mouseEventsAttached = false;
        this.canvas = DOM_1.DOM.getFirstElement(cssQuery);
        if (this.canvas === null) {
            throw "Canvas ID " + cssQuery + " not found.";
        }
        this.ctx = this.canvas.getContext(context);
        window.requestAnimationFrame = AnimationFrameFunctions_1.AnimationFrameFunctions.requestAnimationFrame();
        window.cancelAnimationFrame = AnimationFrameFunctions_1.AnimationFrameFunctions.cancelAnimationFrame();
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
                attract: false
            },
            events: {
                resize: true,
                hover: false,
                click: false
            },
            animate: {
                opacity: false,
                radius: false
            }
        };
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
        };
    }
    Particles.prototype.initialize = function () {
        this.trackMouse();
        this.initializePixelRatio(window.devicePixelRatio >= this.pixelRatioLimit ? this.pixelRatioLimit - 2 : window.devicePixelRatio);
        this.setCanvasSize();
        this.clear();
        this.removeParticles();
        this.createParticles();
        this.distributeParticles();
    };
    Particles.prototype.trackMouse = function () {
        var _this = this;
        if (this.mouseEventsAttached) {
            return;
        }
        if (this.particleSettings.events) {
            if (this.particleSettings.events.hover) {
                this.canvas.addEventListener('mousemove', function (event) {
                    _this.mouse.position.x = event.offsetX * _this.pixelRatio;
                    _this.mouse.position.y = event.offsetY * _this.pixelRatio;
                    _this.mouse.over = true;
                });
                this.canvas.addEventListener('mouseleave', function () {
                    _this.mouse.position.x = null;
                    _this.mouse.position.y = null;
                    _this.mouse.over = false;
                });
            }
            if (this.particleSettings.events.click) {
            }
        }
        this.mouseEventsAttached = true;
    };
    Particles.prototype.initializePixelRatio = function (newRatio) {
        if (newRatio === void 0) { newRatio = window.devicePixelRatio; }
        var multiplier = newRatio / this.pixelRatio;
        this.width = this.canvas.offsetWidth * multiplier;
        this.height = this.canvas.offsetHeight * multiplier;
        if (this.particleSettings.radius instanceof Array) {
            this.particleSettings.radius = this.particleSettings.radius.map(function (r) { return r * multiplier; });
        }
        else {
            if (typeof this.particleSettings.radius === 'number') {
                this.particleSettings.radius *= multiplier;
            }
        }
        if (this.particleSettings.move) {
            this.particleSettings.move.speed *= multiplier;
        }
        if (this.particleSettings.animate && this.particleSettings.animate.radius) {
            this.particleSettings.animate.radius.speed *= multiplier;
        }
        if (this.interactiveSettings.hover) {
            if (this.interactiveSettings.hover.bubble) {
                this.interactiveSettings.hover.bubble.radius *= multiplier;
                this.interactiveSettings.hover.bubble.distance *= multiplier;
            }
            if (this.interactiveSettings.hover.repulse) {
                this.interactiveSettings.hover.repulse.distance *= multiplier;
            }
        }
        this.pixelRatio = newRatio;
    };
    Particles.prototype.checkZoom = function () {
        if (window.devicePixelRatio !== this.pixelRatio && window.devicePixelRatio < this.pixelRatioLimit) {
            this.stopDrawing();
            this.initialize();
            this.draw();
        }
    };
    Particles.prototype.setCanvasSize = function () {
        var _this = this;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        if (this.particleSettings.events && this.particleSettings.events.resize) {
            this.handleResize = function () {
                _this.checkZoom();
                _this.width = _this.canvas.offsetWidth * _this.pixelRatio;
                _this.height = _this.canvas.offsetHeight * _this.pixelRatio;
                _this.canvas.width = _this.width;
                _this.canvas.height = _this.height;
                if (!_this.particleSettings.move) {
                    _this.removeParticles();
                    _this.createParticles();
                    _this.drawParticles();
                }
                _this.distributeParticles();
            };
            window.addEventListener('resize', this.handleResize);
        }
    };
    Particles.prototype.getFill = function () {
        return this.ctx.fillStyle;
    };
    Particles.prototype.setFill = function (color) {
        this.ctx.fillStyle = color;
    };
    Particles.prototype.setStroke = function (stroke) {
        this.ctx.strokeStyle = stroke.color.toString();
        this.ctx.lineWidth = stroke.width;
    };
    Particles.prototype.clear = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    Particles.prototype.draw = function () {
        this.drawParticles();
        if (this.particleSettings.move)
            this.animationFrame = window.requestAnimationFrame(this.draw.bind(this));
    };
    Particles.prototype.stopDrawing = function () {
        if (this.handleResize) {
            window.removeEventListener('resize', this.handleResize);
            this.handleResize = null;
        }
        if (this.animationFrame) {
            window.cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    };
    Particles.prototype.drawPolygon = function (center, radius, sides) {
        var diagonalAngle = 360 / sides;
        diagonalAngle *= Math.PI / 180;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.translate(center.x, center.y);
        this.ctx.rotate(diagonalAngle / (sides % 2 ? 4 : 2));
        this.ctx.moveTo(radius, 0);
        var angle;
        for (var s = 0; s < sides; s++) {
            angle = s * diagonalAngle;
            this.ctx.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
        }
        this.ctx.fill();
        this.ctx.restore();
    };
    Particles.prototype.drawParticle = function (particle) {
        var opacity = particle.getOpacity();
        var radius = particle.getRadius();
        this.setFill(particle.color.toString(opacity));
        this.ctx.beginPath();
        if (typeof (particle.shape) === 'number') {
            this.drawPolygon(particle.position, radius, particle.shape);
        }
        else {
            switch (particle.shape) {
                default:
                case 'circle':
                    this.ctx.arc(particle.position.x, particle.position.y, radius, 0, Math.PI * 2, false);
                    break;
            }
        }
        this.ctx.closePath();
        if (particle.stroke.width > 0) {
            this.setStroke(particle.stroke);
            this.ctx.stroke();
        }
        this.ctx.fill();
    };
    Particles.prototype.getNewPosition = function () {
        return new Coordinate_1.default(Math.random() * this.canvas.width, Math.random() * this.canvas.height);
    };
    Particles.prototype.checkPosition = function (particle) {
        if (this.particleSettings.move) {
            if (this.particleSettings.move.edgeBounce) {
                if (particle.edge('left').x < 0)
                    particle.position.x += particle.getRadius();
                else if (particle.edge('right').x > this.width)
                    particle.position.x -= particle.getRadius();
                if (particle.edge('top').y < 0)
                    particle.position.y += particle.getRadius();
                else if (particle.edge('bottom').y > this.height)
                    particle.position.y -= particle.getRadius();
            }
        }
        return true;
    };
    Particles.prototype.distributeParticles = function () {
        if (this.particleSettings.density && typeof (this.particleSettings.density) === 'number') {
            var area = this.canvas.width * this.canvas.height / 1000;
            area /= this.pixelRatio * 2;
            var particlesPerArea = area * this.particleSettings.number / this.particleSettings.density;
            var missing = particlesPerArea - this.particles.length;
            if (missing > 0) {
                this.createParticles(missing);
            }
            else {
                this.removeParticles(Math.abs(missing));
            }
        }
    };
    Particles.prototype.createParticles = function (number, position) {
        if (number === void 0) { number = this.particleSettings.number; }
        if (position === void 0) { position = null; }
        if (!this.particleSettings)
            throw 'Particle settings must be initalized before a particle is created.';
        var particle;
        for (var p = 0; p < number; p++) {
            particle = new Particle_1.default(this.particleSettings);
            if (position) {
                particle.setPosition(position);
            }
            else {
                do {
                    particle.setPosition(this.getNewPosition());
                } while (!this.checkPosition(particle));
            }
            this.particles.push(particle);
        }
    };
    Particles.prototype.removeParticles = function (number) {
        if (number === void 0) { number = null; }
        if (!number) {
            this.particles = new Array();
        }
        else {
            this.particles.splice(0, number);
        }
    };
    Particles.prototype.updateParticles = function () {
        for (var _i = 0, _a = this.particles; _i < _a.length; _i++) {
            var particle = _a[_i];
            if (this.particleSettings.move) {
                particle.move(this.particleSettings.move.speed);
                if (!this.particleSettings.move.edgeBounce) {
                    if (particle.edge('right').x < 0) {
                        particle.setPosition(new Coordinate_1.default(this.width + particle.getRadius(), Math.random() * this.height));
                    }
                    else if (particle.edge('left').x > this.width) {
                        particle.setPosition(new Coordinate_1.default(-1 * particle.getRadius(), Math.random() * this.height));
                    }
                    if (particle.edge('bottom').y < 0) {
                        particle.setPosition(new Coordinate_1.default(Math.random() * this.width, this.height + particle.getRadius()));
                    }
                    else if (particle.edge('top').y > this.height) {
                        particle.setPosition(new Coordinate_1.default(Math.random() * this.width, -1 * particle.getRadius()));
                    }
                }
                if (this.particleSettings.move.edgeBounce) {
                    if (particle.edge('left').x < 0 || particle.edge('right').x > this.width) {
                        particle.velocity.flip(true, false);
                    }
                    if (particle.edge('top').y < 0 || particle.edge('bottom').y > this.height) {
                        particle.velocity.flip(false, true);
                    }
                }
            }
            if (this.particleSettings.animate) {
                if (this.particleSettings.animate.opacity) {
                    if (particle.opacity >= particle.opacityAnimation.max) {
                        particle.opacityAnimation.increasing = false;
                    }
                    else if (particle.opacity <= particle.opacityAnimation.min) {
                        particle.opacityAnimation.increasing = true;
                    }
                    particle.opacity += particle.opacityAnimation.speed * (particle.opacityAnimation.increasing ? 1 : -1);
                    if (particle.opacity < 0) {
                        particle.opacity = 0;
                    }
                }
                if (this.particleSettings.animate.radius) {
                    if (particle.radius >= particle.radiusAnimation.max) {
                        particle.radiusAnimation.increasing = false;
                    }
                    else if (particle.radius <= particle.radiusAnimation.min) {
                        particle.radiusAnimation.increasing = true;
                    }
                    particle.radius += particle.radiusAnimation.speed * (particle.radiusAnimation.increasing ? 1 : -1);
                    if (particle.radius < 0) {
                        particle.radius = 0;
                    }
                }
            }
            if (this.particleSettings.events) {
                if (this.particleSettings.events.hover === 'bubble' && this.interactiveSettings.hover && this.interactiveSettings.hover.bubble) {
                    particle.bubble(this.mouse, this.interactiveSettings.hover.bubble);
                }
            }
        }
    };
    Particles.prototype.drawParticles = function () {
        this.clear();
        this.updateParticles();
        for (var _i = 0, _a = this.particles; _i < _a.length; _i++) {
            var particle = _a[_i];
            this.drawParticle(particle);
        }
    };
    Particles.prototype.setParticleSettings = function (settings) {
        if (this.running) {
            throw 'Cannot change settings while Canvas is running.';
        }
        else {
            this.particleSettings = settings;
        }
    };
    Particles.prototype.setInteractiveSettings = function (settings) {
        if (this.running) {
            throw 'Cannot change settings while Canvas is running.';
        }
        else {
            this.interactiveSettings = settings;
        }
    };
    Particles.prototype.start = function () {
        if (this.particleSettings === null)
            throw 'Particle settings must be initalized before Canvas can start.';
        if (this.running)
            throw 'Canvas is already running.';
        this.running = true;
        this.initialize();
        this.draw();
    };
    return Particles;
}());
exports.default = Particles;

},{"../Modules/DOM":7,"./AnimationFrameFunctions":12,"./Coordinate":14,"./Particle":16}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Stroke = (function () {
    function Stroke(width, color) {
        this.width = width;
        this.color = color;
    }
    return Stroke;
}());
exports.default = Stroke;

},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Vector = (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.prototype.flip = function (x, y) {
        if (x === void 0) { x = true; }
        if (y === void 0) { y = true; }
        if (x) {
            this.x *= -1;
        }
        if (y) {
            this.y *= -1;
        }
    };
    Vector.prototype.magnitude = function () {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    };
    Vector.prototype.angle = function () {
        return Math.tan(this.y / this.x);
    };
    return Vector;
}());
exports.default = Vector;

},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,18,17,19,20])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJvdXQvdHMvQ2FudmFzL0NhbnZhcy5qcyIsIm91dC90cy9DYW52YXMvU3RhcnMuanMiLCJvdXQvdHMvQ2xhc3Nlcy9TZWN0aW9uLmpzIiwib3V0L3RzL0V2ZW50cy9DYW52YXNUZXh0LmpzIiwib3V0L3RzL0V2ZW50cy9Mb2dvLmpzIiwib3V0L3RzL0V2ZW50cy9NZW51LmpzIiwib3V0L3RzL01vZHVsZXMvRE9NLmpzIiwib3V0L3RzL01vZHVsZXMvU1ZHLmpzIiwib3V0L3RzL01vZHVsZXMvV2ViUGFnZS5qcyIsIm91dC90cy9OYW1lc3BhY2VzL01lbnUuanMiLCJvdXQvdHMvUGFydGljbGVzL0FuaW1hdGlvbi5qcyIsIm91dC90cy9QYXJ0aWNsZXMvQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMuanMiLCJvdXQvdHMvUGFydGljbGVzL0NvbG9yLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9Db29yZGluYXRlLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9Nb3VzZS5qcyIsIm91dC90cy9QYXJ0aWNsZXMvUGFydGljbGUuanMiLCJvdXQvdHMvUGFydGljbGVzL1BhcnRpY2xlcy5qcyIsIm91dC90cy9QYXJ0aWNsZXMvU3Ryb2tlLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9WZWN0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3RQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0WUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBQYXJ0aWNsZXNfMSA9IHJlcXVpcmUoXCIuLi9QYXJ0aWNsZXMvUGFydGljbGVzXCIpO1xudmFyIFN0YXJzXzEgPSByZXF1aXJlKFwiLi9TdGFyc1wiKTtcbnZhciBjYW52YXMgPSBuZXcgUGFydGljbGVzXzEuZGVmYXVsdCgnI3BhcnRpY2xlcycsICcyZCcpO1xuY2FudmFzLnNldFBhcnRpY2xlU2V0dGluZ3MoU3RhcnNfMS5TdGFycy5QYXJ0aWNsZXMpO1xuY2FudmFzLnNldEludGVyYWN0aXZlU2V0dGluZ3MoU3RhcnNfMS5TdGFycy5JbnRlcmFjdGl2ZSk7XG5jYW52YXMuc3RhcnQoKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5TdGFycyA9IHtcbiAgICBQYXJ0aWNsZXM6IHtcbiAgICAgICAgbnVtYmVyOiAzNTAsXG4gICAgICAgIGRlbnNpdHk6IDIwMCxcbiAgICAgICAgY29sb3I6ICcjRkZGRkZGJyxcbiAgICAgICAgb3BhY2l0eTogJ3JhbmRvbScsXG4gICAgICAgIHJhZGl1czogWzEsIDEuNSwgMiwgMi41LCAzLCAzLjVdLFxuICAgICAgICBzaGFwZTogJ2NpcmNsZScsXG4gICAgICAgIHN0cm9rZToge1xuICAgICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgICBjb2xvcjogJyMwMDAwMDAnXG4gICAgICAgIH0sXG4gICAgICAgIG1vdmU6IHtcbiAgICAgICAgICAgIHNwZWVkOiAwLjIsXG4gICAgICAgICAgICBkaXJlY3Rpb246ICdyYW5kb20nLFxuICAgICAgICAgICAgc3RyYWlnaHQ6IGZhbHNlLFxuICAgICAgICAgICAgcmFuZG9tOiB0cnVlLFxuICAgICAgICAgICAgZWRnZUJvdW5jZTogZmFsc2UsXG4gICAgICAgICAgICBhdHRyYWN0OiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgIHJlc2l6ZTogdHJ1ZSxcbiAgICAgICAgICAgIGhvdmVyOiAnYnViYmxlJyxcbiAgICAgICAgICAgIGNsaWNrOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBhbmltYXRlOiB7XG4gICAgICAgICAgICBvcGFjaXR5OiB7XG4gICAgICAgICAgICAgICAgc3BlZWQ6IDAuMixcbiAgICAgICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICAgICAgc3luYzogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByYWRpdXM6IHtcbiAgICAgICAgICAgICAgICBzcGVlZDogMyxcbiAgICAgICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICAgICAgc3luYzogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgSW50ZXJhY3RpdmU6IHtcbiAgICAgICAgaG92ZXI6IHtcbiAgICAgICAgICAgIGJ1YmJsZToge1xuICAgICAgICAgICAgICAgIGRpc3RhbmNlOiA3NSxcbiAgICAgICAgICAgICAgICByYWRpdXM6IDcsXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIERPTV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvRE9NXCIpO1xudmFyIFNlY3Rpb24gPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFNlY3Rpb24oZWxlbWVudCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIH1cbiAgICBTZWN0aW9uLnByb3RvdHlwZS5pblZpZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBib3VuZGluZyA9IHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdmFyIHZpZXcgPSBET01fMS5ET00uZ2V0Vmlld3BvcnQoKTtcbiAgICAgICAgcmV0dXJuIGJvdW5kaW5nLmJvdHRvbSA+PSAwICYmXG4gICAgICAgICAgICBib3VuZGluZy5yaWdodCA+PSAwICYmXG4gICAgICAgICAgICBib3VuZGluZy50b3AgPD0gdmlldy5oZWlnaHQgJiZcbiAgICAgICAgICAgIGJvdW5kaW5nLmxlZnQgPD0gdmlldy53aWR0aDtcbiAgICB9O1xuICAgIFNlY3Rpb24ucHJvdG90eXBlLmdldElEID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmlkO1xuICAgIH07XG4gICAgcmV0dXJuIFNlY3Rpb247XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gU2VjdGlvbjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFdlYlBhZ2VfMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL1dlYlBhZ2VcIik7XG52YXIgZGVsYXkgPSAxMDAwO1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2xvb3BfMSA9IGZ1bmN0aW9uIChpKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgV2ViUGFnZV8xLkNhbnZhc1RleHQuY2hpbGRyZW5baV0uY2xhc3NMaXN0LnJlbW92ZSgncHJlbG9hZCcpO1xuICAgICAgICB9LCBkZWxheSAqIChpICsgMSkpO1xuICAgIH07XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBXZWJQYWdlXzEuQ2FudmFzVGV4dC5jaGlsZEVsZW1lbnRDb3VudDsgaSsrKSB7XG4gICAgICAgIF9sb29wXzEoaSk7XG4gICAgfVxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBXZWJQYWdlXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9XZWJQYWdlXCIpO1xudmFyIFNWR18xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvU1ZHXCIpO1xuZnVuY3Rpb24gQ3JlYXRlTG9nbyhMb2dvLCBwYXJ0LCBkZWxheSkge1xuICAgIHZhciBVc2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHXzEuU1ZHLnN2Z25zLCAndXNlJyk7XG4gICAgVXNlLmNsYXNzTGlzdC52YWx1ZSA9IHBhcnQgKyBcIiBwcmVsb2FkXCI7XG4gICAgVXNlLnNldEF0dHJpYnV0ZU5TKFNWR18xLlNWRy54bGlua25zLCAnaHJlZicsIFwib3V0L2ltYWdlcy9Mb2dvLnN2ZyNcIiArIHBhcnQpO1xuICAgIFVzZS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIFVzZS5jbGFzc0xpc3QucmVtb3ZlKCdwcmVsb2FkJyk7XG4gICAgICAgIH0sIGRlbGF5KTtcbiAgICB9KTtcbiAgICBMb2dvLmFwcGVuZChVc2UpO1xufVxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICBDcmVhdGVMb2dvKFdlYlBhZ2VfMS5Mb2dvLCAnb3V0ZXInLCAwKTtcbiAgICBDcmVhdGVMb2dvKFdlYlBhZ2VfMS5Mb2dvLCAnaW5uZXInLCA0MDApO1xufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBNZW51XzEgPSByZXF1aXJlKFwiLi4vTmFtZXNwYWNlcy9NZW51XCIpO1xuTWVudV8xLk1lbnUuaGFtYnVyZ2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIE1lbnVfMS5NZW51LnRvZ2dsZSgpO1xufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBET007XG4oZnVuY3Rpb24gKERPTSkge1xuICAgIGZ1bmN0aW9uIGdldEVsZW1lbnRzKHF1ZXJ5KSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHF1ZXJ5KTtcbiAgICB9XG4gICAgRE9NLmdldEVsZW1lbnRzID0gZ2V0RWxlbWVudHM7XG4gICAgZnVuY3Rpb24gZ2V0Rmlyc3RFbGVtZW50KHF1ZXJ5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEVsZW1lbnRzKHF1ZXJ5KVswXTtcbiAgICB9XG4gICAgRE9NLmdldEZpcnN0RWxlbWVudCA9IGdldEZpcnN0RWxlbWVudDtcbiAgICBmdW5jdGlvbiBnZXRWaWV3cG9ydCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsXG4gICAgICAgICAgICB3aWR0aDogd2luZG93LmlubmVyV2lkdGggfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoXG4gICAgICAgIH07XG4gICAgfVxuICAgIERPTS5nZXRWaWV3cG9ydCA9IGdldFZpZXdwb3J0O1xuICAgIGZ1bmN0aW9uIHNjcm9sbFRvKHgsIHkpIHtcbiAgICAgICAgd2luZG93LnNjcm9sbFRvKHtcbiAgICAgICAgICAgIHRvcDogeSxcbiAgICAgICAgICAgIGxlZnQ6IHgsXG4gICAgICAgICAgICBiZWhhdmlvcjogJ3Ntb290aCdcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIERPTS5zY3JvbGxUbyA9IHNjcm9sbFRvO1xufSkoRE9NID0gZXhwb3J0cy5ET00gfHwgKGV4cG9ydHMuRE9NID0ge30pKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFNWRztcbihmdW5jdGlvbiAoU1ZHKSB7XG4gICAgU1ZHLnN2Z25zID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJztcbiAgICBTVkcueGxpbmtucyA9ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJztcbn0pKFNWRyA9IGV4cG9ydHMuU1ZHIHx8IChleHBvcnRzLlNWRyA9IHt9KSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuL0RPTVwiKTtcbnZhciBTZWN0aW9uXzEgPSByZXF1aXJlKFwiLi4vQ2xhc3Nlcy9TZWN0aW9uXCIpO1xuZXhwb3J0cy5Mb2dvID0gRE9NXzEuRE9NLmdldEZpcnN0RWxlbWVudChcImhlYWRlci5sb2dvIC5pbWFnZSBzdmdcIik7XG5leHBvcnRzLkNhbnZhc1RleHQgPSBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdkaXYuY2FudmFzIGRpdi5jYW52YXMtdGV4dC1jb250YWluZXInKTtcbmV4cG9ydHMuTWVudSA9IHtcbiAgICBIYW1idXJnZXI6IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ2hlYWRlci5tZW51IC5oYW1idXJnZXInKVxufTtcbmV4cG9ydHMuU2VjdGlvbnMgPSBuZXcgT2JqZWN0KCk7XG5mb3IgKHZhciBfaSA9IDAsIF9hID0gQXJyYXkuZnJvbShET01fMS5ET00uZ2V0RWxlbWVudHMoJ3NlY3Rpb24nKSk7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgdmFyIGVsZW1lbnQgPSBfYVtfaV07XG4gICAgZXhwb3J0cy5TZWN0aW9uc1tlbGVtZW50LmlkXSA9IG5ldyBTZWN0aW9uXzEuZGVmYXVsdChlbGVtZW50KTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFdlYlBhZ2VfMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL1dlYlBhZ2VcIik7XG52YXIgTWVudTtcbihmdW5jdGlvbiAoTWVudSkge1xuICAgIHZhciBvcGVuID0gZmFsc2U7XG4gICAgdmFyIHJpZ2h0ID0gZmFsc2U7XG4gICAgTWVudS5oYW1idXJnZXIgPSBXZWJQYWdlXzEuTWVudS5IYW1idXJnZXI7XG4gICAgZnVuY3Rpb24gdG9nZ2xlKCkge1xuICAgICAgICBvcGVuID0gIW9wZW47XG4gICAgICAgIGlmIChvcGVuKSB7XG4gICAgICAgICAgICBNZW51LmhhbWJ1cmdlci5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBNZW51LmhhbWJ1cmdlci5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgTWVudS50b2dnbGUgPSB0b2dnbGU7XG59KShNZW51ID0gZXhwb3J0cy5NZW51IHx8IChleHBvcnRzLk1lbnUgPSB7fSkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQW5pbWF0aW9uID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBBbmltYXRpb24oc3BlZWQsIG1heCwgbWluLCBpbmNyZWFzaW5nKSB7XG4gICAgICAgIGlmIChpbmNyZWFzaW5nID09PSB2b2lkIDApIHsgaW5jcmVhc2luZyA9IGZhbHNlOyB9XG4gICAgICAgIHRoaXMuc3BlZWQgPSBzcGVlZDtcbiAgICAgICAgdGhpcy5tYXggPSBtYXg7XG4gICAgICAgIHRoaXMubWluID0gbWluO1xuICAgICAgICB0aGlzLmluY3JlYXNpbmcgPSBpbmNyZWFzaW5nO1xuICAgIH1cbiAgICByZXR1cm4gQW5pbWF0aW9uO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IEFuaW1hdGlvbjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIEFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zO1xuKGZ1bmN0aW9uIChBbmltYXRpb25GcmFtZUZ1bmN0aW9ucykge1xuICAgIGZ1bmN0aW9uIHJlcXVlc3RBbmltYXRpb25GcmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcbiAgICAgICAgICAgIH07XG4gICAgfVxuICAgIEFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zLnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZTtcbiAgICBmdW5jdGlvbiBjYW5jZWxBbmltYXRpb25GcmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgd2luZG93LndlYmtpdENhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQ7XG4gICAgfVxuICAgIEFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zLmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gY2FuY2VsQW5pbWF0aW9uRnJhbWU7XG59KShBbmltYXRpb25GcmFtZUZ1bmN0aW9ucyA9IGV4cG9ydHMuQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMgfHwgKGV4cG9ydHMuQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMgPSB7fSkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQ29sb3IgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENvbG9yKHIsIGcsIGIpIHtcbiAgICAgICAgdGhpcy5yID0gcjtcbiAgICAgICAgdGhpcy5nID0gZztcbiAgICAgICAgdGhpcy5iID0gYjtcbiAgICB9XG4gICAgQ29sb3IuZnJvbVJHQiA9IGZ1bmN0aW9uIChyLCBnLCBiKSB7XG4gICAgICAgIGlmIChyID49IDAgJiYgciA8IDI1NiAmJiBnID49IDAgJiYgZyA8IDI1NiAmJiBiID49IDAgJiYgYiA8IDI1Nikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb2xvcihyLCBnLCBiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBDb2xvci5mcm9tT2JqZWN0ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gQ29sb3IuZnJvbVJHQihvYmouciwgb2JqLmcsIG9iai5iKTtcbiAgICB9O1xuICAgIENvbG9yLmZyb21IZXggPSBmdW5jdGlvbiAoaGV4KSB7XG4gICAgICAgIHJldHVybiBDb2xvci5mcm9tT2JqZWN0KENvbG9yLmhleFRvUkdCKGhleCkpO1xuICAgIH07XG4gICAgQ29sb3IuaGV4VG9SR0IgPSBmdW5jdGlvbiAoaGV4KSB7XG4gICAgICAgIHZhciByZXN1bHQgPSAvXiMoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXgpO1xuICAgICAgICByZXR1cm4gcmVzdWx0ID8ge1xuICAgICAgICAgICAgcjogcGFyc2VJbnQocmVzdWx0WzFdLCAxNiksXG4gICAgICAgICAgICBnOiBwYXJzZUludChyZXN1bHRbMl0sIDE2KSxcbiAgICAgICAgICAgIGI6IHBhcnNlSW50KHJlc3VsdFszXSwgMTYpXG4gICAgICAgIH0gOiBudWxsO1xuICAgIH07XG4gICAgQ29sb3IucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKG9wYWNpdHkpIHtcbiAgICAgICAgaWYgKG9wYWNpdHkgPT09IHZvaWQgMCkgeyBvcGFjaXR5ID0gMTsgfVxuICAgICAgICByZXR1cm4gXCJyZ2JhKFwiICsgdGhpcy5yICsgXCIsXCIgKyB0aGlzLmcgKyBcIixcIiArIHRoaXMuYiArIFwiLFwiICsgb3BhY2l0eSArIFwiKVwiO1xuICAgIH07XG4gICAgcmV0dXJuIENvbG9yO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IENvbG9yO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQ29vcmRpbmF0ZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29vcmRpbmF0ZSh4LCB5KSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxuICAgIENvb3JkaW5hdGUucHJvdG90eXBlLmRpc3RhbmNlID0gZnVuY3Rpb24gKGNvb3JkKSB7XG4gICAgICAgIHZhciBkeCA9IGNvb3JkLnggLSB0aGlzLng7XG4gICAgICAgIHZhciBkeSA9IGNvb3JkLnkgLSB0aGlzLnk7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuICAgIH07XG4gICAgQ29vcmRpbmF0ZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnggKyBcInhcIiArIHRoaXMueTtcbiAgICB9O1xuICAgIHJldHVybiBDb29yZGluYXRlO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IENvb3JkaW5hdGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIEFuaW1hdGlvbl8xID0gcmVxdWlyZShcIi4vQW5pbWF0aW9uXCIpO1xudmFyIENvbG9yXzEgPSByZXF1aXJlKFwiLi9Db2xvclwiKTtcbnZhciBDb29yZGluYXRlXzEgPSByZXF1aXJlKFwiLi9Db29yZGluYXRlXCIpO1xudmFyIFN0cm9rZV8xID0gcmVxdWlyZShcIi4vU3Ryb2tlXCIpO1xudmFyIFZlY3Rvcl8xID0gcmVxdWlyZShcIi4vVmVjdG9yXCIpO1xudmFyIFBhcnRpY2xlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQYXJ0aWNsZShzZXR0aW5ncykge1xuICAgICAgICB0aGlzLm9wYWNpdHlBbmltYXRpb24gPSBudWxsO1xuICAgICAgICB0aGlzLnJhZGl1c0FuaW1hdGlvbiA9IG51bGw7XG4gICAgICAgIHRoaXMuY29sb3IgPSB0aGlzLmNyZWF0ZUNvbG9yKHNldHRpbmdzLmNvbG9yKTtcbiAgICAgICAgdGhpcy5vcGFjaXR5ID0gdGhpcy5jcmVhdGVPcGFjaXR5KHNldHRpbmdzLm9wYWNpdHkpO1xuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gdGhpcy5jcmVhdGVWZWxvY2l0eShzZXR0aW5ncy5tb3ZlKTtcbiAgICAgICAgdGhpcy5zaGFwZSA9IHRoaXMuY3JlYXRlU2hhcGUoc2V0dGluZ3Muc2hhcGUpO1xuICAgICAgICB0aGlzLnN0cm9rZSA9IHRoaXMuY3JlYXRlU3Ryb2tlKHNldHRpbmdzLnN0cm9rZSk7XG4gICAgICAgIHRoaXMucmFkaXVzID0gdGhpcy5jcmVhdGVSYWRpdXMoc2V0dGluZ3MucmFkaXVzKTtcbiAgICAgICAgaWYgKHNldHRpbmdzLmFuaW1hdGUpIHtcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5hbmltYXRlLm9wYWNpdHkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wYWNpdHlBbmltYXRpb24gPSB0aGlzLmFuaW1hdGVPcGFjaXR5KHNldHRpbmdzLmFuaW1hdGUub3BhY2l0eSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuYW5pbWF0ZS5yYWRpdXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJhZGl1c0FuaW1hdGlvbiA9IHRoaXMuYW5pbWF0ZVJhZGl1cyhzZXR0aW5ncy5hbmltYXRlLnJhZGl1cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5idWJibGVkID0ge1xuICAgICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICAgIHJhZGl1czogMFxuICAgICAgICB9O1xuICAgIH1cbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY3JlYXRlQ29sb3IgPSBmdW5jdGlvbiAoY29sb3IpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb2xvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmIChjb2xvciA9PT0gJ3JhbmRvbScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQ29sb3JfMS5kZWZhdWx0LmZyb21SR0IoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU2KSwgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU2KSwgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU2KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQ29sb3JfMS5kZWZhdWx0LmZyb21IZXgoY29sb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBjb2xvciA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGlmIChjb2xvciBpbnN0YW5jZW9mIENvbG9yXzEuZGVmYXVsdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb2xvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbG9yIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVDb2xvcihjb2xvcltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb2xvci5sZW5ndGgpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQ29sb3JfMS5kZWZhdWx0LmZyb21PYmplY3QoY29sb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBDb2xvcl8xLmRlZmF1bHQuZnJvbVJHQigwLCAwLCAwKTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jcmVhdGVPcGFjaXR5ID0gZnVuY3Rpb24gKG9wYWNpdHkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvcGFjaXR5ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKG9wYWNpdHkgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZU9wYWNpdHkob3BhY2l0eVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBvcGFjaXR5Lmxlbmd0aCldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2Ygb3BhY2l0eSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmIChvcGFjaXR5ID09PSAncmFuZG9tJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBvcGFjaXR5ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgaWYgKG9wYWNpdHkgPj0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcGFjaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAxO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLmNyZWF0ZVZlbG9jaXR5ID0gZnVuY3Rpb24gKG1vdmUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBtb3ZlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIGlmICghbW92ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yXzEuZGVmYXVsdCgwLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgbW92ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHZhciB2ZWxvY2l0eSA9IHZvaWQgMDtcbiAgICAgICAgICAgIHN3aXRjaCAobW92ZS5kaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBjYXNlICd0b3AnOlxuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eSA9IG5ldyBWZWN0b3JfMS5kZWZhdWx0KDAsIC0xKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAndG9wLXJpZ2h0JzpcbiAgICAgICAgICAgICAgICAgICAgdmVsb2NpdHkgPSBuZXcgVmVjdG9yXzEuZGVmYXVsdCgwLjcsIC0wLjcpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2JvdHRvbS1yaWdodCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMC43LCAwLjcpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdib3R0b20nOlxuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eSA9IG5ldyBWZWN0b3JfMS5kZWZhdWx0KDAsIDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdib3R0b20tbGVmdCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoLTAuNywgMC43KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoLTEsIDApO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICd0b3AtbGVmdCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoLTAuNywgLTAuNyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMCwgMCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1vdmUuc3RyYWlnaHQpIHtcbiAgICAgICAgICAgICAgICBpZiAobW92ZS5yYW5kb20pIHtcbiAgICAgICAgICAgICAgICAgICAgdmVsb2NpdHkueCAqPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eS55ICo9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmVsb2NpdHkueCArPSBNYXRoLnJhbmRvbSgpIC0gMC41O1xuICAgICAgICAgICAgICAgIHZlbG9jaXR5LnkgKz0gTWF0aC5yYW5kb20oKSAtIDAuNTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB2ZWxvY2l0eTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMCwgMCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY3JlYXRlU2hhcGUgPSBmdW5jdGlvbiAoc2hhcGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzaGFwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGlmIChzaGFwZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlU2hhcGUoc2hhcGVbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogc2hhcGUubGVuZ3RoKV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBzaGFwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhciBzaWRlcyA9IHBhcnNlSW50KHNoYXBlLnN1YnN0cmluZygwLCBzaGFwZS5pbmRleE9mKCctJykpKTtcbiAgICAgICAgICAgIGlmICghaXNOYU4oc2lkZXMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlU2hhcGUoc2lkZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNoYXBlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBzaGFwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGlmIChzaGFwZSA+PSAzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNoYXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnY2lyY2xlJztcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jcmVhdGVTdHJva2UgPSBmdW5jdGlvbiAoc3Ryb2tlKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc3Ryb2tlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBzdHJva2Uud2lkdGggPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0cm9rZS53aWR0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTdHJva2VfMS5kZWZhdWx0KHN0cm9rZS53aWR0aCwgdGhpcy5jcmVhdGVDb2xvcihzdHJva2UuY29sb3IpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBTdHJva2VfMS5kZWZhdWx0KDAsIENvbG9yXzEuZGVmYXVsdC5mcm9tUkdCKDAsIDAsIDApKTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jcmVhdGVSYWRpdXMgPSBmdW5jdGlvbiAocmFkaXVzKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcmFkaXVzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKHJhZGl1cyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlUmFkaXVzKHJhZGl1c1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYWRpdXMubGVuZ3RoKV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiByYWRpdXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZiAocmFkaXVzID09PSAncmFuZG9tJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiByYWRpdXMgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBpZiAocmFkaXVzID49IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmFkaXVzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiA1O1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLnBhcnNlU3BlZWQgPSBmdW5jdGlvbiAoc3BlZWQpIHtcbiAgICAgICAgaWYgKHNwZWVkID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHNwZWVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwLjU7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuYW5pbWF0ZU9wYWNpdHkgPSBmdW5jdGlvbiAoYW5pbWF0aW9uKSB7XG4gICAgICAgIGlmIChhbmltYXRpb24pIHtcbiAgICAgICAgICAgIHZhciBtYXggPSB0aGlzLm9wYWNpdHk7XG4gICAgICAgICAgICB2YXIgbWluID0gdGhpcy5jcmVhdGVPcGFjaXR5KGFuaW1hdGlvbi5taW4pO1xuICAgICAgICAgICAgdmFyIHNwZWVkID0gdGhpcy5wYXJzZVNwZWVkKGFuaW1hdGlvbi5zcGVlZCkgLyAxMDA7XG4gICAgICAgICAgICBpZiAoIWFuaW1hdGlvbi5zeW5jKSB7XG4gICAgICAgICAgICAgICAgc3BlZWQgKj0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMub3BhY2l0eSAqPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBBbmltYXRpb25fMS5kZWZhdWx0KHNwZWVkLCBtYXgsIG1pbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuYW5pbWF0ZVJhZGl1cyA9IGZ1bmN0aW9uIChhbmltYXRpb24pIHtcbiAgICAgICAgaWYgKGFuaW1hdGlvbikge1xuICAgICAgICAgICAgdmFyIG1heCA9IHRoaXMucmFkaXVzO1xuICAgICAgICAgICAgdmFyIG1pbiA9IHRoaXMuY3JlYXRlUmFkaXVzKGFuaW1hdGlvbi5taW4pO1xuICAgICAgICAgICAgdmFyIHNwZWVkID0gdGhpcy5wYXJzZVNwZWVkKGFuaW1hdGlvbi5zcGVlZCkgLyAxMDA7XG4gICAgICAgICAgICBpZiAoIWFuaW1hdGlvbi5zeW5jKSB7XG4gICAgICAgICAgICAgICAgc3BlZWQgKj0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMub3BhY2l0eSAqPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBBbmltYXRpb25fMS5kZWZhdWx0KHNwZWVkLCBtYXgsIG1pbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuc2V0UG9zaXRpb24gPSBmdW5jdGlvbiAocG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLm1vdmUgPSBmdW5jdGlvbiAoc3BlZWQpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54ICs9IHRoaXMudmVsb2NpdHkueCAqIHNwZWVkO1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnkgKz0gdGhpcy52ZWxvY2l0eS55ICogc3BlZWQ7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuZ2V0UmFkaXVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yYWRpdXMgKyB0aGlzLmJ1YmJsZWQucmFkaXVzO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLmdldE9wYWNpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wYWNpdHkgKyB0aGlzLmJ1YmJsZWQub3BhY2l0eTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5lZGdlID0gZnVuY3Rpb24gKGRpcikge1xuICAgICAgICBzd2l0Y2ggKGRpcikge1xuICAgICAgICAgICAgY2FzZSAndG9wJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55IC0gdGhpcy5nZXRSYWRpdXMoKSk7XG4gICAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdCh0aGlzLnBvc2l0aW9uLnggKyB0aGlzLmdldFJhZGl1cygpLCB0aGlzLnBvc2l0aW9uLnkpO1xuICAgICAgICAgICAgY2FzZSAnYm90dG9tJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55ICsgdGhpcy5nZXRSYWRpdXMoKSk7XG4gICAgICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KHRoaXMucG9zaXRpb24ueCAtIHRoaXMuZ2V0UmFkaXVzKCksIHRoaXMucG9zaXRpb24ueSk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuaW50ZXJzZWN0aW5nID0gZnVuY3Rpb24gKHBhcnRpY2xlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLmRpc3RhbmNlKHBhcnRpY2xlLnBvc2l0aW9uKSA8IHRoaXMuZ2V0UmFkaXVzKCkgKyBwYXJ0aWNsZS5nZXRSYWRpdXMoKTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5idWJibGUgPSBmdW5jdGlvbiAobW91c2UsIHNldHRpbmdzKSB7XG4gICAgICAgIHZhciBkaXN0YW5jZSA9IHRoaXMucG9zaXRpb24uZGlzdGFuY2UobW91c2UucG9zaXRpb24pO1xuICAgICAgICB2YXIgcmF0aW8gPSAxIC0gZGlzdGFuY2UgLyBzZXR0aW5ncy5kaXN0YW5jZTtcbiAgICAgICAgaWYgKHJhdGlvID49IDAgJiYgbW91c2Uub3Zlcikge1xuICAgICAgICAgICAgdGhpcy5idWJibGVkLm9wYWNpdHkgPSByYXRpbyAqIChzZXR0aW5ncy5vcGFjaXR5IC0gdGhpcy5vcGFjaXR5KTtcbiAgICAgICAgICAgIHRoaXMuYnViYmxlZC5yYWRpdXMgPSByYXRpbyAqIChzZXR0aW5ncy5yYWRpdXMgLSB0aGlzLnJhZGl1cyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJ1YmJsZWQub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICB0aGlzLmJ1YmJsZWQucmFkaXVzID0gMDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIFBhcnRpY2xlO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IFBhcnRpY2xlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnNfMSA9IHJlcXVpcmUoXCIuL0FuaW1hdGlvbkZyYW1lRnVuY3Rpb25zXCIpO1xudmFyIERPTV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvRE9NXCIpO1xudmFyIENvb3JkaW5hdGVfMSA9IHJlcXVpcmUoXCIuL0Nvb3JkaW5hdGVcIik7XG52YXIgUGFydGljbGVfMSA9IHJlcXVpcmUoXCIuL1BhcnRpY2xlXCIpO1xudmFyIFBhcnRpY2xlcyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUGFydGljbGVzKGNzc1F1ZXJ5LCBjb250ZXh0KSB7XG4gICAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnBpeGVsUmF0aW9MaW1pdCA9IDg7XG4gICAgICAgIHRoaXMucGl4ZWxSYXRpbyA9IDE7XG4gICAgICAgIHRoaXMucGFydGljbGVzID0gbmV3IEFycmF5KCk7XG4gICAgICAgIHRoaXMubW91c2UgPSB7XG4gICAgICAgICAgICBwb3NpdGlvbjogbmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KDAsIDApLFxuICAgICAgICAgICAgb3ZlcjogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5oYW5kbGVSZXNpemUgPSBudWxsO1xuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5tb3VzZUV2ZW50c0F0dGFjaGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2FudmFzID0gRE9NXzEuRE9NLmdldEZpcnN0RWxlbWVudChjc3NRdWVyeSk7XG4gICAgICAgIGlmICh0aGlzLmNhbnZhcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgXCJDYW52YXMgSUQgXCIgKyBjc3NRdWVyeSArIFwiIG5vdCBmb3VuZC5cIjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoY29udGV4dCk7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBBbmltYXRpb25GcmFtZUZ1bmN0aW9uc18xLkFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zLnJlcXVlc3RBbmltYXRpb25GcmFtZSgpO1xuICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBBbmltYXRpb25GcmFtZUZ1bmN0aW9uc18xLkFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zLmNhbmNlbEFuaW1hdGlvbkZyYW1lKCk7XG4gICAgICAgIHRoaXMucGFydGljbGVTZXR0aW5ncyA9IHtcbiAgICAgICAgICAgIG51bWJlcjogMzUwLFxuICAgICAgICAgICAgZGVuc2l0eTogMTAwMCxcbiAgICAgICAgICAgIGNvbG9yOiAnI0ZGRkZGRicsXG4gICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgcmFkaXVzOiA1LFxuICAgICAgICAgICAgc2hhcGU6ICdjaXJjbGUnLFxuICAgICAgICAgICAgc3Ryb2tlOiB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgY29sb3I6ICcjMDAwMDAwJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1vdmU6IHtcbiAgICAgICAgICAgICAgICBzcGVlZDogMC40LFxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogJ2JvdHRvbScsXG4gICAgICAgICAgICAgICAgc3RyYWlnaHQ6IHRydWUsXG4gICAgICAgICAgICAgICAgcmFuZG9tOiB0cnVlLFxuICAgICAgICAgICAgICAgIGVkZ2VCb3VuY2U6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGF0dHJhY3Q6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAgICAgcmVzaXplOiB0cnVlLFxuICAgICAgICAgICAgICAgIGhvdmVyOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjbGljazogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRlOiB7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogZmFsc2UsXG4gICAgICAgICAgICAgICAgcmFkaXVzOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MgPSB7XG4gICAgICAgICAgICBob3Zlcjoge1xuICAgICAgICAgICAgICAgIGJ1YmJsZToge1xuICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZTogNzUsXG4gICAgICAgICAgICAgICAgICAgIHJhZGl1czogNyxcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmVwdWxzZToge1xuICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZTogMTAwLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbGljazoge1xuICAgICAgICAgICAgICAgIGFkZDoge1xuICAgICAgICAgICAgICAgICAgICBudW1iZXI6IDRcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJlbW92ZToge1xuICAgICAgICAgICAgICAgICAgICBudW1iZXI6IDJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy50cmFja01vdXNlKCk7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8gPj0gdGhpcy5waXhlbFJhdGlvTGltaXQgPyB0aGlzLnBpeGVsUmF0aW9MaW1pdCAtIDIgOiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgICAgIHRoaXMuc2V0Q2FudmFzU2l6ZSgpO1xuICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICAgIHRoaXMucmVtb3ZlUGFydGljbGVzKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlUGFydGljbGVzKCk7XG4gICAgICAgIHRoaXMuZGlzdHJpYnV0ZVBhcnRpY2xlcygpO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS50cmFja01vdXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAodGhpcy5tb3VzZUV2ZW50c0F0dGFjaGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5ldmVudHMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuZXZlbnRzLmhvdmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm1vdXNlLnBvc2l0aW9uLnggPSBldmVudC5vZmZzZXRYICogX3RoaXMucGl4ZWxSYXRpbztcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubW91c2UucG9zaXRpb24ueSA9IGV2ZW50Lm9mZnNldFkgKiBfdGhpcy5waXhlbFJhdGlvO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5tb3VzZS5vdmVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5tb3VzZS5wb3NpdGlvbi54ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubW91c2UucG9zaXRpb24ueSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm1vdXNlLm92ZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuZXZlbnRzLmNsaWNrKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tb3VzZUV2ZW50c0F0dGFjaGVkID0gdHJ1ZTtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuaW5pdGlhbGl6ZVBpeGVsUmF0aW8gPSBmdW5jdGlvbiAobmV3UmF0aW8pIHtcbiAgICAgICAgaWYgKG5ld1JhdGlvID09PSB2b2lkIDApIHsgbmV3UmF0aW8gPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbzsgfVxuICAgICAgICB2YXIgbXVsdGlwbGllciA9IG5ld1JhdGlvIC8gdGhpcy5waXhlbFJhdGlvO1xuICAgICAgICB0aGlzLndpZHRoID0gdGhpcy5jYW52YXMub2Zmc2V0V2lkdGggKiBtdWx0aXBsaWVyO1xuICAgICAgICB0aGlzLmhlaWdodCA9IHRoaXMuY2FudmFzLm9mZnNldEhlaWdodCAqIG11bHRpcGxpZXI7XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MucmFkaXVzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVTZXR0aW5ncy5yYWRpdXMgPSB0aGlzLnBhcnRpY2xlU2V0dGluZ3MucmFkaXVzLm1hcChmdW5jdGlvbiAocikgeyByZXR1cm4gciAqIG11bHRpcGxpZXI7IH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnBhcnRpY2xlU2V0dGluZ3MucmFkaXVzID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIHRoaXMucGFydGljbGVTZXR0aW5ncy5yYWRpdXMgKj0gbXVsdGlwbGllcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUpIHtcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlLnNwZWVkICo9IG11bHRpcGxpZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5hbmltYXRlICYmIHRoaXMucGFydGljbGVTZXR0aW5ncy5hbmltYXRlLnJhZGl1cykge1xuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLmFuaW1hdGUucmFkaXVzLnNwZWVkICo9IG11bHRpcGxpZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaW50ZXJhY3RpdmVTZXR0aW5ncy5ob3Zlcikge1xuICAgICAgICAgICAgaWYgKHRoaXMuaW50ZXJhY3RpdmVTZXR0aW5ncy5ob3Zlci5idWJibGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIuYnViYmxlLnJhZGl1cyAqPSBtdWx0aXBsaWVyO1xuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJhY3RpdmVTZXR0aW5ncy5ob3Zlci5idWJibGUuZGlzdGFuY2UgKj0gbXVsdGlwbGllcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIucmVwdWxzZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJhY3RpdmVTZXR0aW5ncy5ob3Zlci5yZXB1bHNlLmRpc3RhbmNlICo9IG11bHRpcGxpZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5waXhlbFJhdGlvID0gbmV3UmF0aW87XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmNoZWNrWm9vbSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvICE9PSB0aGlzLnBpeGVsUmF0aW8gJiYgd2luZG93LmRldmljZVBpeGVsUmF0aW8gPCB0aGlzLnBpeGVsUmF0aW9MaW1pdCkge1xuICAgICAgICAgICAgdGhpcy5zdG9wRHJhd2luZygpO1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgICAgICAgICB0aGlzLmRyYXcoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5zZXRDYW52YXNTaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmV2ZW50cyAmJiB0aGlzLnBhcnRpY2xlU2V0dGluZ3MuZXZlbnRzLnJlc2l6ZSkge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVSZXNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuY2hlY2tab29tKCk7XG4gICAgICAgICAgICAgICAgX3RoaXMud2lkdGggPSBfdGhpcy5jYW52YXMub2Zmc2V0V2lkdGggKiBfdGhpcy5waXhlbFJhdGlvO1xuICAgICAgICAgICAgICAgIF90aGlzLmhlaWdodCA9IF90aGlzLmNhbnZhcy5vZmZzZXRIZWlnaHQgKiBfdGhpcy5waXhlbFJhdGlvO1xuICAgICAgICAgICAgICAgIF90aGlzLmNhbnZhcy53aWR0aCA9IF90aGlzLndpZHRoO1xuICAgICAgICAgICAgICAgIF90aGlzLmNhbnZhcy5oZWlnaHQgPSBfdGhpcy5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgaWYgKCFfdGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMucmVtb3ZlUGFydGljbGVzKCk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmNyZWF0ZVBhcnRpY2xlcygpO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5kcmF3UGFydGljbGVzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF90aGlzLmRpc3RyaWJ1dGVQYXJ0aWNsZXMoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5oYW5kbGVSZXNpemUpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmdldEZpbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN0eC5maWxsU3R5bGU7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnNldEZpbGwgPSBmdW5jdGlvbiAoY29sb3IpIHtcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gY29sb3I7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnNldFN0cm9rZSA9IGZ1bmN0aW9uIChzdHJva2UpIHtcbiAgICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBzdHJva2UuY29sb3IudG9TdHJpbmcoKTtcbiAgICAgICAgdGhpcy5jdHgubGluZVdpZHRoID0gc3Ryb2tlLndpZHRoO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmRyYXdQYXJ0aWNsZXMoKTtcbiAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlKVxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5zdG9wRHJhd2luZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFuZGxlUmVzaXplKSB7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5oYW5kbGVSZXNpemUpO1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVSZXNpemUgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmFuaW1hdGlvbkZyYW1lKSB7XG4gICAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRpb25GcmFtZSk7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5kcmF3UG9seWdvbiA9IGZ1bmN0aW9uIChjZW50ZXIsIHJhZGl1cywgc2lkZXMpIHtcbiAgICAgICAgdmFyIGRpYWdvbmFsQW5nbGUgPSAzNjAgLyBzaWRlcztcbiAgICAgICAgZGlhZ29uYWxBbmdsZSAqPSBNYXRoLlBJIC8gMTgwO1xuICAgICAgICB0aGlzLmN0eC5zYXZlKCk7XG4gICAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUoY2VudGVyLngsIGNlbnRlci55KTtcbiAgICAgICAgdGhpcy5jdHgucm90YXRlKGRpYWdvbmFsQW5nbGUgLyAoc2lkZXMgJSAyID8gNCA6IDIpKTtcbiAgICAgICAgdGhpcy5jdHgubW92ZVRvKHJhZGl1cywgMCk7XG4gICAgICAgIHZhciBhbmdsZTtcbiAgICAgICAgZm9yICh2YXIgcyA9IDA7IHMgPCBzaWRlczsgcysrKSB7XG4gICAgICAgICAgICBhbmdsZSA9IHMgKiBkaWFnb25hbEFuZ2xlO1xuICAgICAgICAgICAgdGhpcy5jdHgubGluZVRvKHJhZGl1cyAqIE1hdGguY29zKGFuZ2xlKSwgcmFkaXVzICogTWF0aC5zaW4oYW5nbGUpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN0eC5maWxsKCk7XG4gICAgICAgIHRoaXMuY3R4LnJlc3RvcmUoKTtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuZHJhd1BhcnRpY2xlID0gZnVuY3Rpb24gKHBhcnRpY2xlKSB7XG4gICAgICAgIHZhciBvcGFjaXR5ID0gcGFydGljbGUuZ2V0T3BhY2l0eSgpO1xuICAgICAgICB2YXIgcmFkaXVzID0gcGFydGljbGUuZ2V0UmFkaXVzKCk7XG4gICAgICAgIHRoaXMuc2V0RmlsbChwYXJ0aWNsZS5jb2xvci50b1N0cmluZyhvcGFjaXR5KSk7XG4gICAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBpZiAodHlwZW9mIChwYXJ0aWNsZS5zaGFwZSkgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB0aGlzLmRyYXdQb2x5Z29uKHBhcnRpY2xlLnBvc2l0aW9uLCByYWRpdXMsIHBhcnRpY2xlLnNoYXBlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHN3aXRjaCAocGFydGljbGUuc2hhcGUpIHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNhc2UgJ2NpcmNsZSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3R4LmFyYyhwYXJ0aWNsZS5wb3NpdGlvbi54LCBwYXJ0aWNsZS5wb3NpdGlvbi55LCByYWRpdXMsIDAsIE1hdGguUEkgKiAyLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgICBpZiAocGFydGljbGUuc3Ryb2tlLndpZHRoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdHJva2UocGFydGljbGUuc3Ryb2tlKTtcbiAgICAgICAgICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3R4LmZpbGwoKTtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuZ2V0TmV3UG9zaXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ29vcmRpbmF0ZV8xLmRlZmF1bHQoTWF0aC5yYW5kb20oKSAqIHRoaXMuY2FudmFzLndpZHRoLCBNYXRoLnJhbmRvbSgpICogdGhpcy5jYW52YXMuaGVpZ2h0KTtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuY2hlY2tQb3NpdGlvbiA9IGZ1bmN0aW9uIChwYXJ0aWNsZSkge1xuICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZS5lZGdlQm91bmNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLmVkZ2UoJ2xlZnQnKS54IDwgMClcbiAgICAgICAgICAgICAgICAgICAgcGFydGljbGUucG9zaXRpb24ueCArPSBwYXJ0aWNsZS5nZXRSYWRpdXMoKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwYXJ0aWNsZS5lZGdlKCdyaWdodCcpLnggPiB0aGlzLndpZHRoKVxuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi54IC09IHBhcnRpY2xlLmdldFJhZGl1cygpO1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5lZGdlKCd0b3AnKS55IDwgMClcbiAgICAgICAgICAgICAgICAgICAgcGFydGljbGUucG9zaXRpb24ueSArPSBwYXJ0aWNsZS5nZXRSYWRpdXMoKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwYXJ0aWNsZS5lZGdlKCdib3R0b20nKS55ID4gdGhpcy5oZWlnaHQpXG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnkgLT0gcGFydGljbGUuZ2V0UmFkaXVzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmRpc3RyaWJ1dGVQYXJ0aWNsZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuZGVuc2l0eSAmJiB0eXBlb2YgKHRoaXMucGFydGljbGVTZXR0aW5ncy5kZW5zaXR5KSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHZhciBhcmVhID0gdGhpcy5jYW52YXMud2lkdGggKiB0aGlzLmNhbnZhcy5oZWlnaHQgLyAxMDAwO1xuICAgICAgICAgICAgYXJlYSAvPSB0aGlzLnBpeGVsUmF0aW8gKiAyO1xuICAgICAgICAgICAgdmFyIHBhcnRpY2xlc1BlckFyZWEgPSBhcmVhICogdGhpcy5wYXJ0aWNsZVNldHRpbmdzLm51bWJlciAvIHRoaXMucGFydGljbGVTZXR0aW5ncy5kZW5zaXR5O1xuICAgICAgICAgICAgdmFyIG1pc3NpbmcgPSBwYXJ0aWNsZXNQZXJBcmVhIC0gdGhpcy5wYXJ0aWNsZXMubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKG1pc3NpbmcgPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVQYXJ0aWNsZXMobWlzc2luZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZVBhcnRpY2xlcyhNYXRoLmFicyhtaXNzaW5nKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuY3JlYXRlUGFydGljbGVzID0gZnVuY3Rpb24gKG51bWJlciwgcG9zaXRpb24pIHtcbiAgICAgICAgaWYgKG51bWJlciA9PT0gdm9pZCAwKSB7IG51bWJlciA9IHRoaXMucGFydGljbGVTZXR0aW5ncy5udW1iZXI7IH1cbiAgICAgICAgaWYgKHBvc2l0aW9uID09PSB2b2lkIDApIHsgcG9zaXRpb24gPSBudWxsOyB9XG4gICAgICAgIGlmICghdGhpcy5wYXJ0aWNsZVNldHRpbmdzKVxuICAgICAgICAgICAgdGhyb3cgJ1BhcnRpY2xlIHNldHRpbmdzIG11c3QgYmUgaW5pdGFsaXplZCBiZWZvcmUgYSBwYXJ0aWNsZSBpcyBjcmVhdGVkLic7XG4gICAgICAgIHZhciBwYXJ0aWNsZTtcbiAgICAgICAgZm9yICh2YXIgcCA9IDA7IHAgPCBudW1iZXI7IHArKykge1xuICAgICAgICAgICAgcGFydGljbGUgPSBuZXcgUGFydGljbGVfMS5kZWZhdWx0KHRoaXMucGFydGljbGVTZXR0aW5ncyk7XG4gICAgICAgICAgICBpZiAocG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgICBwYXJ0aWNsZS5zZXRQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnNldFBvc2l0aW9uKHRoaXMuZ2V0TmV3UG9zaXRpb24oKSk7XG4gICAgICAgICAgICAgICAgfSB3aGlsZSAoIXRoaXMuY2hlY2tQb3NpdGlvbihwYXJ0aWNsZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZXMucHVzaChwYXJ0aWNsZSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUucmVtb3ZlUGFydGljbGVzID0gZnVuY3Rpb24gKG51bWJlcikge1xuICAgICAgICBpZiAobnVtYmVyID09PSB2b2lkIDApIHsgbnVtYmVyID0gbnVsbDsgfVxuICAgICAgICBpZiAoIW51bWJlcikge1xuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZXMgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVzLnNwbGljZSgwLCBudW1iZXIpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnVwZGF0ZVBhcnRpY2xlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IHRoaXMucGFydGljbGVzOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIHBhcnRpY2xlID0gX2FbX2ldO1xuICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlKSB7XG4gICAgICAgICAgICAgICAgcGFydGljbGUubW92ZSh0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZS5zcGVlZCk7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZS5lZGdlQm91bmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5lZGdlKCdyaWdodCcpLnggPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5zZXRQb3NpdGlvbihuZXcgQ29vcmRpbmF0ZV8xLmRlZmF1bHQodGhpcy53aWR0aCArIHBhcnRpY2xlLmdldFJhZGl1cygpLCBNYXRoLnJhbmRvbSgpICogdGhpcy5oZWlnaHQpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChwYXJ0aWNsZS5lZGdlKCdsZWZ0JykueCA+IHRoaXMud2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnNldFBvc2l0aW9uKG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdCgtMSAqIHBhcnRpY2xlLmdldFJhZGl1cygpLCBNYXRoLnJhbmRvbSgpICogdGhpcy5oZWlnaHQpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAocGFydGljbGUuZWRnZSgnYm90dG9tJykueSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnNldFBvc2l0aW9uKG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdChNYXRoLnJhbmRvbSgpICogdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQgKyBwYXJ0aWNsZS5nZXRSYWRpdXMoKSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBhcnRpY2xlLmVkZ2UoJ3RvcCcpLnkgPiB0aGlzLmhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUuc2V0UG9zaXRpb24obmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KE1hdGgucmFuZG9tKCkgKiB0aGlzLndpZHRoLCAtMSAqIHBhcnRpY2xlLmdldFJhZGl1cygpKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlLmVkZ2VCb3VuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLmVkZ2UoJ2xlZnQnKS54IDwgMCB8fCBwYXJ0aWNsZS5lZGdlKCdyaWdodCcpLnggPiB0aGlzLndpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS52ZWxvY2l0eS5mbGlwKHRydWUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAocGFydGljbGUuZWRnZSgndG9wJykueSA8IDAgfHwgcGFydGljbGUuZWRnZSgnYm90dG9tJykueSA+IHRoaXMuaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS52ZWxvY2l0eS5mbGlwKGZhbHNlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuYW5pbWF0ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuYW5pbWF0ZS5vcGFjaXR5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5vcGFjaXR5ID49IHBhcnRpY2xlLm9wYWNpdHlBbmltYXRpb24ubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5vcGFjaXR5QW5pbWF0aW9uLmluY3JlYXNpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChwYXJ0aWNsZS5vcGFjaXR5IDw9IHBhcnRpY2xlLm9wYWNpdHlBbmltYXRpb24ubWluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5vcGFjaXR5QW5pbWF0aW9uLmluY3JlYXNpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLm9wYWNpdHkgKz0gcGFydGljbGUub3BhY2l0eUFuaW1hdGlvbi5zcGVlZCAqIChwYXJ0aWNsZS5vcGFjaXR5QW5pbWF0aW9uLmluY3JlYXNpbmcgPyAxIDogLTEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFydGljbGUub3BhY2l0eSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLm9wYWNpdHkgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuYW5pbWF0ZS5yYWRpdXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLnJhZGl1cyA+PSBwYXJ0aWNsZS5yYWRpdXNBbmltYXRpb24ubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5yYWRpdXNBbmltYXRpb24uaW5jcmVhc2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBhcnRpY2xlLnJhZGl1cyA8PSBwYXJ0aWNsZS5yYWRpdXNBbmltYXRpb24ubWluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5yYWRpdXNBbmltYXRpb24uaW5jcmVhc2luZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcGFydGljbGUucmFkaXVzICs9IHBhcnRpY2xlLnJhZGl1c0FuaW1hdGlvbi5zcGVlZCAqIChwYXJ0aWNsZS5yYWRpdXNBbmltYXRpb24uaW5jcmVhc2luZyA/IDEgOiAtMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5yYWRpdXMgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5yYWRpdXMgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5ldmVudHMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmV2ZW50cy5ob3ZlciA9PT0gJ2J1YmJsZScgJiYgdGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyICYmIHRoaXMuaW50ZXJhY3RpdmVTZXR0aW5ncy5ob3Zlci5idWJibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFydGljbGUuYnViYmxlKHRoaXMubW91c2UsIHRoaXMuaW50ZXJhY3RpdmVTZXR0aW5ncy5ob3Zlci5idWJibGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5kcmF3UGFydGljbGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICAgIHRoaXMudXBkYXRlUGFydGljbGVzKCk7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSB0aGlzLnBhcnRpY2xlczsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBwYXJ0aWNsZSA9IF9hW19pXTtcbiAgICAgICAgICAgIHRoaXMuZHJhd1BhcnRpY2xlKHBhcnRpY2xlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5zZXRQYXJ0aWNsZVNldHRpbmdzID0gZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICAgIGlmICh0aGlzLnJ1bm5pbmcpIHtcbiAgICAgICAgICAgIHRocm93ICdDYW5ub3QgY2hhbmdlIHNldHRpbmdzIHdoaWxlIENhbnZhcyBpcyBydW5uaW5nLic7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlU2V0dGluZ3MgPSBzZXR0aW5ncztcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5zZXRJbnRlcmFjdGl2ZVNldHRpbmdzID0gZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICAgIGlmICh0aGlzLnJ1bm5pbmcpIHtcbiAgICAgICAgICAgIHRocm93ICdDYW5ub3QgY2hhbmdlIHNldHRpbmdzIHdoaWxlIENhbnZhcyBpcyBydW5uaW5nLic7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MgPSBzZXR0aW5ncztcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncyA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93ICdQYXJ0aWNsZSBzZXR0aW5ncyBtdXN0IGJlIGluaXRhbGl6ZWQgYmVmb3JlIENhbnZhcyBjYW4gc3RhcnQuJztcbiAgICAgICAgaWYgKHRoaXMucnVubmluZylcbiAgICAgICAgICAgIHRocm93ICdDYW52YXMgaXMgYWxyZWFkeSBydW5uaW5nLic7XG4gICAgICAgIHRoaXMucnVubmluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgICAgICB0aGlzLmRyYXcoKTtcbiAgICB9O1xuICAgIHJldHVybiBQYXJ0aWNsZXM7XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gUGFydGljbGVzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgU3Ryb2tlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTdHJva2Uod2lkdGgsIGNvbG9yKSB7XG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgIH1cbiAgICByZXR1cm4gU3Ryb2tlO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IFN0cm9rZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFZlY3RvciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVmVjdG9yKHgsIHkpIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICB9XG4gICAgVmVjdG9yLnByb3RvdHlwZS5mbGlwID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgaWYgKHggPT09IHZvaWQgMCkgeyB4ID0gdHJ1ZTsgfVxuICAgICAgICBpZiAoeSA9PT0gdm9pZCAwKSB7IHkgPSB0cnVlOyB9XG4gICAgICAgIGlmICh4KSB7XG4gICAgICAgICAgICB0aGlzLnggKj0gLTE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHkpIHtcbiAgICAgICAgICAgIHRoaXMueSAqPSAtMTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVmVjdG9yLnByb3RvdHlwZS5tYWduaXR1ZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoKHRoaXMueCAqIHRoaXMueCkgKyAodGhpcy55ICogdGhpcy55KSk7XG4gICAgfTtcbiAgICBWZWN0b3IucHJvdG90eXBlLmFuZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gTWF0aC50YW4odGhpcy55IC8gdGhpcy54KTtcbiAgICB9O1xuICAgIHJldHVybiBWZWN0b3I7XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gVmVjdG9yO1xuIl19
