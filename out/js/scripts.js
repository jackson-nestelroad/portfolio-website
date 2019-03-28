(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Particles_1 = require("../Particles/Particles");
var Stars_1 = require("./Stars");
var canvas = new Particles_1.default('#particles', '2d');
canvas.setParticleSettings(Stars_1.Stars.Particles);
canvas.setInteractiveSettings(Stars_1.Stars.Interactive);
canvas.start();

},{"../Particles/Particles":19,"./Stars":2}],2:[function(require,module,exports){
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
var EventDispatcher = (function () {
    function EventDispatcher(eventName, detail, cancelable, bubbles) {
        if (cancelable === void 0) { cancelable = true; }
        if (bubbles === void 0) { bubbles = true; }
        this.listeners = new Map();
        this.name = eventName;
        this.event = new CustomEvent(eventName, {
            detail: detail,
            bubbles: bubbles,
            cancelable: cancelable
        });
    }
    EventDispatcher.prototype.subscribe = function (element, callback) {
        element.removeEventListener(this.name, this.listeners.get(element));
        this.listeners.set(element, callback);
        element.addEventListener(this.name, callback);
    };
    EventDispatcher.prototype.unsubscribe = function (element) {
        element.removeEventListener(this.name, this.listeners.get(element));
        this.listeners.delete(element);
    };
    EventDispatcher.prototype.disperse = function () {
        var it = this.listeners.keys();
        var element;
        while (element = it.next().value) {
            element.dispatchEvent(this.event);
        }
    };
    return EventDispatcher;
}());
exports.EventDispatcher = EventDispatcher;

},{}],4:[function(require,module,exports){
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

},{"../Modules/DOM":8}],5:[function(require,module,exports){
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

},{"../Modules/WebPage":10}],6:[function(require,module,exports){
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

},{"../Modules/SVG":9,"../Modules/WebPage":10}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebPage_1 = require("../Modules/WebPage");
var Menu_1 = require("../Namespaces/Menu");
Menu_1.Menu.Hamburger.addEventListener('click', function () {
    Menu_1.Menu.toggle();
});
document.addEventListener('scroll', function () {
    Menu_1.Menu.move(WebPage_1.Sections['canvas'].inView());
});

},{"../Modules/WebPage":10,"../Namespaces/Menu":11}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SVG;
(function (SVG) {
    SVG.svgns = 'http://www.w3.org/2000/svg';
    SVG.xlinkns = 'http://www.w3.org/1999/xlink';
})(SVG = exports.SVG || (exports.SVG = {}));

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DOM_1 = require("./DOM");
var Section_1 = require("../Classes/Section");
exports.Logo = DOM_1.DOM.getFirstElement("header.logo .image svg");
exports.CanvasText = DOM_1.DOM.getFirstElement('div.canvas div.canvas-text-container');
exports.Menu = {
    Hamburger: DOM_1.DOM.getFirstElement('header.menu .hamburger')
};
exports.Sections = {};
for (var _i = 0, _a = Array.from(DOM_1.DOM.getElements('section')); _i < _a.length; _i++) {
    var element = _a[_i];
    exports.Sections[element.id] = new Section_1.default(element);
}

},{"../Classes/Section":4,"./DOM":8}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebPage_1 = require("../Modules/WebPage");
var EventDispatcher_1 = require("../Classes/EventDispatcher");
var Menu;
(function (Menu) {
    var open = false;
    var right = false;
    var dispatcher = new EventDispatcher_1.EventDispatcher("menuToggle", { open: open }, false);
    Menu.Hamburger = WebPage_1.Menu.Hamburger;
    function toggle() {
        open = !open;
        if (open) {
            Menu.Hamburger.classList.add('open');
        }
        else {
            Menu.Hamburger.classList.remove('open');
        }
        dispatcher.disperse();
    }
    Menu.toggle = toggle;
    function move(moveRight) {
        if (right !== moveRight) {
            right = moveRight;
        }
    }
    Menu.move = move;
    Menu.subscribe = function (element, callback) {
        dispatcher.subscribe(element, callback);
    };
    Menu.unsubscribe = function (element) {
        dispatcher.unsubscribe(element);
    };
})(Menu = exports.Menu || (exports.Menu = {}));

},{"../Classes/EventDispatcher":3,"../Modules/WebPage":10}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],17:[function(require,module,exports){
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

},{"./Animation":12,"./Color":14,"./Coordinate":15,"./Stroke":20,"./Vector":21}],18:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"dup":16}],19:[function(require,module,exports){
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

},{"../Modules/DOM":8,"./AnimationFrameFunctions":13,"./Coordinate":15,"./Particle":17}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,19,18,20,21])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJvdXQvdHMvQ2FudmFzL0NhbnZhcy5qcyIsIm91dC90cy9DYW52YXMvU3RhcnMuanMiLCJvdXQvdHMvQ2xhc3Nlcy9FdmVudERpc3BhdGNoZXIuanMiLCJvdXQvdHMvQ2xhc3Nlcy9TZWN0aW9uLmpzIiwib3V0L3RzL0V2ZW50cy9DYW52YXNUZXh0LmpzIiwib3V0L3RzL0V2ZW50cy9Mb2dvLmpzIiwib3V0L3RzL0V2ZW50cy9NZW51LmpzIiwib3V0L3RzL01vZHVsZXMvRE9NLmpzIiwib3V0L3RzL01vZHVsZXMvU1ZHLmpzIiwib3V0L3RzL01vZHVsZXMvV2ViUGFnZS5qcyIsIm91dC90cy9OYW1lc3BhY2VzL01lbnUuanMiLCJvdXQvdHMvUGFydGljbGVzL0FuaW1hdGlvbi5qcyIsIm91dC90cy9QYXJ0aWNsZXMvQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMuanMiLCJvdXQvdHMvUGFydGljbGVzL0NvbG9yLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9Db29yZGluYXRlLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9Nb3VzZS5qcyIsIm91dC90cy9QYXJ0aWNsZXMvUGFydGljbGUuanMiLCJvdXQvdHMvUGFydGljbGVzL1BhcnRpY2xlcy5qcyIsIm91dC90cy9QYXJ0aWNsZXMvU3Ryb2tlLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9WZWN0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3RQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0WUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBQYXJ0aWNsZXNfMSA9IHJlcXVpcmUoXCIuLi9QYXJ0aWNsZXMvUGFydGljbGVzXCIpO1xudmFyIFN0YXJzXzEgPSByZXF1aXJlKFwiLi9TdGFyc1wiKTtcbnZhciBjYW52YXMgPSBuZXcgUGFydGljbGVzXzEuZGVmYXVsdCgnI3BhcnRpY2xlcycsICcyZCcpO1xuY2FudmFzLnNldFBhcnRpY2xlU2V0dGluZ3MoU3RhcnNfMS5TdGFycy5QYXJ0aWNsZXMpO1xuY2FudmFzLnNldEludGVyYWN0aXZlU2V0dGluZ3MoU3RhcnNfMS5TdGFycy5JbnRlcmFjdGl2ZSk7XG5jYW52YXMuc3RhcnQoKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5TdGFycyA9IHtcbiAgICBQYXJ0aWNsZXM6IHtcbiAgICAgICAgbnVtYmVyOiAzNTAsXG4gICAgICAgIGRlbnNpdHk6IDIwMCxcbiAgICAgICAgY29sb3I6ICcjRkZGRkZGJyxcbiAgICAgICAgb3BhY2l0eTogJ3JhbmRvbScsXG4gICAgICAgIHJhZGl1czogWzEsIDEuNSwgMiwgMi41LCAzLCAzLjVdLFxuICAgICAgICBzaGFwZTogJ2NpcmNsZScsXG4gICAgICAgIHN0cm9rZToge1xuICAgICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgICBjb2xvcjogJyMwMDAwMDAnXG4gICAgICAgIH0sXG4gICAgICAgIG1vdmU6IHtcbiAgICAgICAgICAgIHNwZWVkOiAwLjIsXG4gICAgICAgICAgICBkaXJlY3Rpb246ICdyYW5kb20nLFxuICAgICAgICAgICAgc3RyYWlnaHQ6IGZhbHNlLFxuICAgICAgICAgICAgcmFuZG9tOiB0cnVlLFxuICAgICAgICAgICAgZWRnZUJvdW5jZTogZmFsc2UsXG4gICAgICAgICAgICBhdHRyYWN0OiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgIHJlc2l6ZTogdHJ1ZSxcbiAgICAgICAgICAgIGhvdmVyOiAnYnViYmxlJyxcbiAgICAgICAgICAgIGNsaWNrOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBhbmltYXRlOiB7XG4gICAgICAgICAgICBvcGFjaXR5OiB7XG4gICAgICAgICAgICAgICAgc3BlZWQ6IDAuMixcbiAgICAgICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICAgICAgc3luYzogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByYWRpdXM6IHtcbiAgICAgICAgICAgICAgICBzcGVlZDogMyxcbiAgICAgICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICAgICAgc3luYzogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgSW50ZXJhY3RpdmU6IHtcbiAgICAgICAgaG92ZXI6IHtcbiAgICAgICAgICAgIGJ1YmJsZToge1xuICAgICAgICAgICAgICAgIGRpc3RhbmNlOiA3NSxcbiAgICAgICAgICAgICAgICByYWRpdXM6IDcsXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIEV2ZW50RGlzcGF0Y2hlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRXZlbnREaXNwYXRjaGVyKGV2ZW50TmFtZSwgZGV0YWlsLCBjYW5jZWxhYmxlLCBidWJibGVzKSB7XG4gICAgICAgIGlmIChjYW5jZWxhYmxlID09PSB2b2lkIDApIHsgY2FuY2VsYWJsZSA9IHRydWU7IH1cbiAgICAgICAgaWYgKGJ1YmJsZXMgPT09IHZvaWQgMCkgeyBidWJibGVzID0gdHJ1ZTsgfVxuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gZXZlbnROYW1lO1xuICAgICAgICB0aGlzLmV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwge1xuICAgICAgICAgICAgZGV0YWlsOiBkZXRhaWwsXG4gICAgICAgICAgICBidWJibGVzOiBidWJibGVzLFxuICAgICAgICAgICAgY2FuY2VsYWJsZTogY2FuY2VsYWJsZVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5zdWJzY3JpYmUgPSBmdW5jdGlvbiAoZWxlbWVudCwgY2FsbGJhY2spIHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMubmFtZSwgdGhpcy5saXN0ZW5lcnMuZ2V0KGVsZW1lbnQpKTtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMuc2V0KGVsZW1lbnQsIGNhbGxiYWNrKTtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHRoaXMubmFtZSwgY2FsbGJhY2spO1xuICAgIH07XG4gICAgRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS51bnN1YnNjcmliZSA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLm5hbWUsIHRoaXMubGlzdGVuZXJzLmdldChlbGVtZW50KSk7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzLmRlbGV0ZShlbGVtZW50KTtcbiAgICB9O1xuICAgIEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuZGlzcGVyc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpdCA9IHRoaXMubGlzdGVuZXJzLmtleXMoKTtcbiAgICAgICAgdmFyIGVsZW1lbnQ7XG4gICAgICAgIHdoaWxlIChlbGVtZW50ID0gaXQubmV4dCgpLnZhbHVlKSB7XG4gICAgICAgICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQodGhpcy5ldmVudCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBFdmVudERpc3BhdGNoZXI7XG59KCkpO1xuZXhwb3J0cy5FdmVudERpc3BhdGNoZXIgPSBFdmVudERpc3BhdGNoZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL0RPTVwiKTtcbnZhciBTZWN0aW9uID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTZWN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICB9XG4gICAgU2VjdGlvbi5wcm90b3R5cGUuaW5WaWV3ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYm91bmRpbmcgPSB0aGlzLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHZhciB2aWV3ID0gRE9NXzEuRE9NLmdldFZpZXdwb3J0KCk7XG4gICAgICAgIHJldHVybiBib3VuZGluZy5ib3R0b20gPj0gMCAmJlxuICAgICAgICAgICAgYm91bmRpbmcucmlnaHQgPj0gMCAmJlxuICAgICAgICAgICAgYm91bmRpbmcudG9wIDw9IHZpZXcuaGVpZ2h0ICYmXG4gICAgICAgICAgICBib3VuZGluZy5sZWZ0IDw9IHZpZXcud2lkdGg7XG4gICAgfTtcbiAgICBTZWN0aW9uLnByb3RvdHlwZS5nZXRJRCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5pZDtcbiAgICB9O1xuICAgIHJldHVybiBTZWN0aW9uO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IFNlY3Rpb247XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBXZWJQYWdlXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9XZWJQYWdlXCIpO1xudmFyIGRlbGF5ID0gMTAwMDtcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9sb29wXzEgPSBmdW5jdGlvbiAoaSkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIFdlYlBhZ2VfMS5DYW52YXNUZXh0LmNoaWxkcmVuW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ3ByZWxvYWQnKTtcbiAgICAgICAgfSwgZGVsYXkgKiAoaSArIDEpKTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgV2ViUGFnZV8xLkNhbnZhc1RleHQuY2hpbGRFbGVtZW50Q291bnQ7IGkrKykge1xuICAgICAgICBfbG9vcF8xKGkpO1xuICAgIH1cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgV2ViUGFnZV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvV2ViUGFnZVwiKTtcbnZhciBTVkdfMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL1NWR1wiKTtcbmZ1bmN0aW9uIENyZWF0ZUxvZ28oTG9nbywgcGFydCwgZGVsYXkpIHtcbiAgICB2YXIgVXNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR18xLlNWRy5zdmducywgJ3VzZScpO1xuICAgIFVzZS5jbGFzc0xpc3QudmFsdWUgPSBwYXJ0ICsgXCIgcHJlbG9hZFwiO1xuICAgIFVzZS5zZXRBdHRyaWJ1dGVOUyhTVkdfMS5TVkcueGxpbmtucywgJ2hyZWYnLCBcIm91dC9pbWFnZXMvTG9nby5zdmcjXCIgKyBwYXJ0KTtcbiAgICBVc2UuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBVc2UuY2xhc3NMaXN0LnJlbW92ZSgncHJlbG9hZCcpO1xuICAgICAgICB9LCBkZWxheSk7XG4gICAgfSk7XG4gICAgTG9nby5hcHBlbmQoVXNlKTtcbn1cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgQ3JlYXRlTG9nbyhXZWJQYWdlXzEuTG9nbywgJ291dGVyJywgMCk7XG4gICAgQ3JlYXRlTG9nbyhXZWJQYWdlXzEuTG9nbywgJ2lubmVyJywgNDAwKTtcbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgV2ViUGFnZV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvV2ViUGFnZVwiKTtcbnZhciBNZW51XzEgPSByZXF1aXJlKFwiLi4vTmFtZXNwYWNlcy9NZW51XCIpO1xuTWVudV8xLk1lbnUuSGFtYnVyZ2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIE1lbnVfMS5NZW51LnRvZ2dsZSgpO1xufSk7XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBmdW5jdGlvbiAoKSB7XG4gICAgTWVudV8xLk1lbnUubW92ZShXZWJQYWdlXzEuU2VjdGlvbnNbJ2NhbnZhcyddLmluVmlldygpKTtcbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgRE9NO1xuKGZ1bmN0aW9uIChET00pIHtcbiAgICBmdW5jdGlvbiBnZXRFbGVtZW50cyhxdWVyeSkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChxdWVyeSk7XG4gICAgfVxuICAgIERPTS5nZXRFbGVtZW50cyA9IGdldEVsZW1lbnRzO1xuICAgIGZ1bmN0aW9uIGdldEZpcnN0RWxlbWVudChxdWVyeSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRFbGVtZW50cyhxdWVyeSlbMF07XG4gICAgfVxuICAgIERPTS5nZXRGaXJzdEVsZW1lbnQgPSBnZXRGaXJzdEVsZW1lbnQ7XG4gICAgZnVuY3Rpb24gZ2V0Vmlld3BvcnQoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0LFxuICAgICAgICAgICAgd2lkdGg6IHdpbmRvdy5pbm5lcldpZHRoIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aFxuICAgICAgICB9O1xuICAgIH1cbiAgICBET00uZ2V0Vmlld3BvcnQgPSBnZXRWaWV3cG9ydDtcbiAgICBmdW5jdGlvbiBzY3JvbGxUbyh4LCB5KSB7XG4gICAgICAgIHdpbmRvdy5zY3JvbGxUbyh7XG4gICAgICAgICAgICB0b3A6IHksXG4gICAgICAgICAgICBsZWZ0OiB4LFxuICAgICAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBET00uc2Nyb2xsVG8gPSBzY3JvbGxUbztcbn0pKERPTSA9IGV4cG9ydHMuRE9NIHx8IChleHBvcnRzLkRPTSA9IHt9KSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBTVkc7XG4oZnVuY3Rpb24gKFNWRykge1xuICAgIFNWRy5zdmducyA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc7XG4gICAgU1ZHLnhsaW5rbnMgPSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayc7XG59KShTVkcgPSBleHBvcnRzLlNWRyB8fCAoZXhwb3J0cy5TVkcgPSB7fSkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgRE9NXzEgPSByZXF1aXJlKFwiLi9ET01cIik7XG52YXIgU2VjdGlvbl8xID0gcmVxdWlyZShcIi4uL0NsYXNzZXMvU2VjdGlvblwiKTtcbmV4cG9ydHMuTG9nbyA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoXCJoZWFkZXIubG9nbyAuaW1hZ2Ugc3ZnXCIpO1xuZXhwb3J0cy5DYW52YXNUZXh0ID0gRE9NXzEuRE9NLmdldEZpcnN0RWxlbWVudCgnZGl2LmNhbnZhcyBkaXYuY2FudmFzLXRleHQtY29udGFpbmVyJyk7XG5leHBvcnRzLk1lbnUgPSB7XG4gICAgSGFtYnVyZ2VyOiBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdoZWFkZXIubWVudSAuaGFtYnVyZ2VyJylcbn07XG5leHBvcnRzLlNlY3Rpb25zID0ge307XG5mb3IgKHZhciBfaSA9IDAsIF9hID0gQXJyYXkuZnJvbShET01fMS5ET00uZ2V0RWxlbWVudHMoJ3NlY3Rpb24nKSk7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgdmFyIGVsZW1lbnQgPSBfYVtfaV07XG4gICAgZXhwb3J0cy5TZWN0aW9uc1tlbGVtZW50LmlkXSA9IG5ldyBTZWN0aW9uXzEuZGVmYXVsdChlbGVtZW50KTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFdlYlBhZ2VfMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL1dlYlBhZ2VcIik7XG52YXIgRXZlbnREaXNwYXRjaGVyXzEgPSByZXF1aXJlKFwiLi4vQ2xhc3Nlcy9FdmVudERpc3BhdGNoZXJcIik7XG52YXIgTWVudTtcbihmdW5jdGlvbiAoTWVudSkge1xuICAgIHZhciBvcGVuID0gZmFsc2U7XG4gICAgdmFyIHJpZ2h0ID0gZmFsc2U7XG4gICAgdmFyIGRpc3BhdGNoZXIgPSBuZXcgRXZlbnREaXNwYXRjaGVyXzEuRXZlbnREaXNwYXRjaGVyKFwibWVudVRvZ2dsZVwiLCB7IG9wZW46IG9wZW4gfSwgZmFsc2UpO1xuICAgIE1lbnUuSGFtYnVyZ2VyID0gV2ViUGFnZV8xLk1lbnUuSGFtYnVyZ2VyO1xuICAgIGZ1bmN0aW9uIHRvZ2dsZSgpIHtcbiAgICAgICAgb3BlbiA9ICFvcGVuO1xuICAgICAgICBpZiAob3Blbikge1xuICAgICAgICAgICAgTWVudS5IYW1idXJnZXIuY2xhc3NMaXN0LmFkZCgnb3BlbicpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgTWVudS5IYW1idXJnZXIuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xuICAgICAgICB9XG4gICAgICAgIGRpc3BhdGNoZXIuZGlzcGVyc2UoKTtcbiAgICB9XG4gICAgTWVudS50b2dnbGUgPSB0b2dnbGU7XG4gICAgZnVuY3Rpb24gbW92ZShtb3ZlUmlnaHQpIHtcbiAgICAgICAgaWYgKHJpZ2h0ICE9PSBtb3ZlUmlnaHQpIHtcbiAgICAgICAgICAgIHJpZ2h0ID0gbW92ZVJpZ2h0O1xuICAgICAgICB9XG4gICAgfVxuICAgIE1lbnUubW92ZSA9IG1vdmU7XG4gICAgTWVudS5zdWJzY3JpYmUgPSBmdW5jdGlvbiAoZWxlbWVudCwgY2FsbGJhY2spIHtcbiAgICAgICAgZGlzcGF0Y2hlci5zdWJzY3JpYmUoZWxlbWVudCwgY2FsbGJhY2spO1xuICAgIH07XG4gICAgTWVudS51bnN1YnNjcmliZSA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGRpc3BhdGNoZXIudW5zdWJzY3JpYmUoZWxlbWVudCk7XG4gICAgfTtcbn0pKE1lbnUgPSBleHBvcnRzLk1lbnUgfHwgKGV4cG9ydHMuTWVudSA9IHt9KSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBBbmltYXRpb24gPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEFuaW1hdGlvbihzcGVlZCwgbWF4LCBtaW4sIGluY3JlYXNpbmcpIHtcbiAgICAgICAgaWYgKGluY3JlYXNpbmcgPT09IHZvaWQgMCkgeyBpbmNyZWFzaW5nID0gZmFsc2U7IH1cbiAgICAgICAgdGhpcy5zcGVlZCA9IHNwZWVkO1xuICAgICAgICB0aGlzLm1heCA9IG1heDtcbiAgICAgICAgdGhpcy5taW4gPSBtaW47XG4gICAgICAgIHRoaXMuaW5jcmVhc2luZyA9IGluY3JlYXNpbmc7XG4gICAgfVxuICAgIHJldHVybiBBbmltYXRpb247XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gQW5pbWF0aW9uO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnM7XG4oZnVuY3Rpb24gKEFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zKSB7XG4gICAgZnVuY3Rpb24gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCkge1xuICAgICAgICByZXR1cm4gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5zZXRUaW1lb3V0KGNhbGxiYWNrLCAxMDAwIC8gNjApO1xuICAgICAgICAgICAgfTtcbiAgICB9XG4gICAgQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuICAgIGZ1bmN0aW9uIGNhbmNlbEFuaW1hdGlvbkZyYW1lKCkge1xuICAgICAgICByZXR1cm4gd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICB3aW5kb3cud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgIGNsZWFyVGltZW91dDtcbiAgICB9XG4gICAgQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBjYW5jZWxBbmltYXRpb25GcmFtZTtcbn0pKEFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zID0gZXhwb3J0cy5BbmltYXRpb25GcmFtZUZ1bmN0aW9ucyB8fCAoZXhwb3J0cy5BbmltYXRpb25GcmFtZUZ1bmN0aW9ucyA9IHt9KSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBDb2xvciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29sb3IociwgZywgYikge1xuICAgICAgICB0aGlzLnIgPSByO1xuICAgICAgICB0aGlzLmcgPSBnO1xuICAgICAgICB0aGlzLmIgPSBiO1xuICAgIH1cbiAgICBDb2xvci5mcm9tUkdCID0gZnVuY3Rpb24gKHIsIGcsIGIpIHtcbiAgICAgICAgaWYgKHIgPj0gMCAmJiByIDwgMjU2ICYmIGcgPj0gMCAmJiBnIDwgMjU2ICYmIGIgPj0gMCAmJiBiIDwgMjU2KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IENvbG9yKHIsIGcsIGIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIENvbG9yLmZyb21PYmplY3QgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiBDb2xvci5mcm9tUkdCKG9iai5yLCBvYmouZywgb2JqLmIpO1xuICAgIH07XG4gICAgQ29sb3IuZnJvbUhleCA9IGZ1bmN0aW9uIChoZXgpIHtcbiAgICAgICAgcmV0dXJuIENvbG9yLmZyb21PYmplY3QoQ29sb3IuaGV4VG9SR0IoaGV4KSk7XG4gICAgfTtcbiAgICBDb2xvci5oZXhUb1JHQiA9IGZ1bmN0aW9uIChoZXgpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IC9eIyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleCk7XG4gICAgICAgIHJldHVybiByZXN1bHQgPyB7XG4gICAgICAgICAgICByOiBwYXJzZUludChyZXN1bHRbMV0sIDE2KSxcbiAgICAgICAgICAgIGc6IHBhcnNlSW50KHJlc3VsdFsyXSwgMTYpLFxuICAgICAgICAgICAgYjogcGFyc2VJbnQocmVzdWx0WzNdLCAxNilcbiAgICAgICAgfSA6IG51bGw7XG4gICAgfTtcbiAgICBDb2xvci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAob3BhY2l0eSkge1xuICAgICAgICBpZiAob3BhY2l0eSA9PT0gdm9pZCAwKSB7IG9wYWNpdHkgPSAxOyB9XG4gICAgICAgIHJldHVybiBcInJnYmEoXCIgKyB0aGlzLnIgKyBcIixcIiArIHRoaXMuZyArIFwiLFwiICsgdGhpcy5iICsgXCIsXCIgKyBvcGFjaXR5ICsgXCIpXCI7XG4gICAgfTtcbiAgICByZXR1cm4gQ29sb3I7XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ29sb3I7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBDb29yZGluYXRlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDb29yZGluYXRlKHgsIHkpIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICB9XG4gICAgQ29vcmRpbmF0ZS5wcm90b3R5cGUuZGlzdGFuY2UgPSBmdW5jdGlvbiAoY29vcmQpIHtcbiAgICAgICAgdmFyIGR4ID0gY29vcmQueCAtIHRoaXMueDtcbiAgICAgICAgdmFyIGR5ID0gY29vcmQueSAtIHRoaXMueTtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG4gICAgfTtcbiAgICBDb29yZGluYXRlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCArIFwieFwiICsgdGhpcy55O1xuICAgIH07XG4gICAgcmV0dXJuIENvb3JkaW5hdGU7XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ29vcmRpbmF0ZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQW5pbWF0aW9uXzEgPSByZXF1aXJlKFwiLi9BbmltYXRpb25cIik7XG52YXIgQ29sb3JfMSA9IHJlcXVpcmUoXCIuL0NvbG9yXCIpO1xudmFyIENvb3JkaW5hdGVfMSA9IHJlcXVpcmUoXCIuL0Nvb3JkaW5hdGVcIik7XG52YXIgU3Ryb2tlXzEgPSByZXF1aXJlKFwiLi9TdHJva2VcIik7XG52YXIgVmVjdG9yXzEgPSByZXF1aXJlKFwiLi9WZWN0b3JcIik7XG52YXIgUGFydGljbGUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFBhcnRpY2xlKHNldHRpbmdzKSB7XG4gICAgICAgIHRoaXMub3BhY2l0eUFuaW1hdGlvbiA9IG51bGw7XG4gICAgICAgIHRoaXMucmFkaXVzQW5pbWF0aW9uID0gbnVsbDtcbiAgICAgICAgdGhpcy5jb2xvciA9IHRoaXMuY3JlYXRlQ29sb3Ioc2V0dGluZ3MuY29sb3IpO1xuICAgICAgICB0aGlzLm9wYWNpdHkgPSB0aGlzLmNyZWF0ZU9wYWNpdHkoc2V0dGluZ3Mub3BhY2l0eSk7XG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSB0aGlzLmNyZWF0ZVZlbG9jaXR5KHNldHRpbmdzLm1vdmUpO1xuICAgICAgICB0aGlzLnNoYXBlID0gdGhpcy5jcmVhdGVTaGFwZShzZXR0aW5ncy5zaGFwZSk7XG4gICAgICAgIHRoaXMuc3Ryb2tlID0gdGhpcy5jcmVhdGVTdHJva2Uoc2V0dGluZ3Muc3Ryb2tlKTtcbiAgICAgICAgdGhpcy5yYWRpdXMgPSB0aGlzLmNyZWF0ZVJhZGl1cyhzZXR0aW5ncy5yYWRpdXMpO1xuICAgICAgICBpZiAoc2V0dGluZ3MuYW5pbWF0ZSkge1xuICAgICAgICAgICAgaWYgKHNldHRpbmdzLmFuaW1hdGUub3BhY2l0eSkge1xuICAgICAgICAgICAgICAgIHRoaXMub3BhY2l0eUFuaW1hdGlvbiA9IHRoaXMuYW5pbWF0ZU9wYWNpdHkoc2V0dGluZ3MuYW5pbWF0ZS5vcGFjaXR5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5hbmltYXRlLnJhZGl1cykge1xuICAgICAgICAgICAgICAgIHRoaXMucmFkaXVzQW5pbWF0aW9uID0gdGhpcy5hbmltYXRlUmFkaXVzKHNldHRpbmdzLmFuaW1hdGUucmFkaXVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJ1YmJsZWQgPSB7XG4gICAgICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICAgICAgcmFkaXVzOiAwXG4gICAgICAgIH07XG4gICAgfVxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jcmVhdGVDb2xvciA9IGZ1bmN0aW9uIChjb2xvcikge1xuICAgICAgICBpZiAodHlwZW9mIGNvbG9yID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaWYgKGNvbG9yID09PSAncmFuZG9tJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBDb2xvcl8xLmRlZmF1bHQuZnJvbVJHQihNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyNTYpLCBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyNTYpLCBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyNTYpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBDb2xvcl8xLmRlZmF1bHQuZnJvbUhleChjb2xvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIGNvbG9yID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKGNvbG9yIGluc3RhbmNlb2YgQ29sb3JfMS5kZWZhdWx0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbG9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29sb3IgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUNvbG9yKGNvbG9yW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNvbG9yLmxlbmd0aCldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBDb2xvcl8xLmRlZmF1bHQuZnJvbU9iamVjdChjb2xvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIENvbG9yXzEuZGVmYXVsdC5mcm9tUkdCKDAsIDAsIDApO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLmNyZWF0ZU9wYWNpdHkgPSBmdW5jdGlvbiAob3BhY2l0eSkge1xuICAgICAgICBpZiAodHlwZW9mIG9wYWNpdHkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBpZiAob3BhY2l0eSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlT3BhY2l0eShvcGFjaXR5W01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG9wYWNpdHkubGVuZ3RoKV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBvcGFjaXR5ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaWYgKG9wYWNpdHkgPT09ICdyYW5kb20nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIG9wYWNpdHkgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBpZiAob3BhY2l0eSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wYWNpdHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY3JlYXRlVmVsb2NpdHkgPSBmdW5jdGlvbiAobW92ZSkge1xuICAgICAgICBpZiAodHlwZW9mIG1vdmUgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgaWYgKCFtb3ZlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3JfMS5kZWZhdWx0KDAsIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBtb3ZlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdmFyIHZlbG9jaXR5ID0gdm9pZCAwO1xuICAgICAgICAgICAgc3dpdGNoIChtb3ZlLmRpcmVjdGlvbikge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3RvcCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMCwgLTEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICd0b3AtcmlnaHQnOlxuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eSA9IG5ldyBWZWN0b3JfMS5kZWZhdWx0KDAuNywgLTAuNyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICAgICAgICAgICAgdmVsb2NpdHkgPSBuZXcgVmVjdG9yXzEuZGVmYXVsdCgxLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnYm90dG9tLXJpZ2h0JzpcbiAgICAgICAgICAgICAgICAgICAgdmVsb2NpdHkgPSBuZXcgVmVjdG9yXzEuZGVmYXVsdCgwLjcsIDAuNyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2JvdHRvbS1sZWZ0JzpcbiAgICAgICAgICAgICAgICAgICAgdmVsb2NpdHkgPSBuZXcgVmVjdG9yXzEuZGVmYXVsdCgtMC43LCAwLjcpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICAgICAgICAgICAgdmVsb2NpdHkgPSBuZXcgVmVjdG9yXzEuZGVmYXVsdCgtMSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3RvcC1sZWZ0JzpcbiAgICAgICAgICAgICAgICAgICAgdmVsb2NpdHkgPSBuZXcgVmVjdG9yXzEuZGVmYXVsdCgtMC43LCAtMC43KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdmVsb2NpdHkgPSBuZXcgVmVjdG9yXzEuZGVmYXVsdCgwLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobW92ZS5zdHJhaWdodCkge1xuICAgICAgICAgICAgICAgIGlmIChtb3ZlLnJhbmRvbSkge1xuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eS54ICo9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5LnkgKj0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2ZWxvY2l0eS54ICs9IE1hdGgucmFuZG9tKCkgLSAwLjU7XG4gICAgICAgICAgICAgICAgdmVsb2NpdHkueSArPSBNYXRoLnJhbmRvbSgpIC0gMC41O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZlbG9jaXR5O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yXzEuZGVmYXVsdCgwLCAwKTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jcmVhdGVTaGFwZSA9IGZ1bmN0aW9uIChzaGFwZSkge1xuICAgICAgICBpZiAodHlwZW9mIHNoYXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKHNoYXBlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVTaGFwZShzaGFwZVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzaGFwZS5sZW5ndGgpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHNoYXBlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdmFyIHNpZGVzID0gcGFyc2VJbnQoc2hhcGUuc3Vic3RyaW5nKDAsIHNoYXBlLmluZGV4T2YoJy0nKSkpO1xuICAgICAgICAgICAgaWYgKCFpc05hTihzaWRlcykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVTaGFwZShzaWRlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2hhcGU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHNoYXBlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgaWYgKHNoYXBlID49IDMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2hhcGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICdjaXJjbGUnO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLmNyZWF0ZVN0cm9rZSA9IGZ1bmN0aW9uIChzdHJva2UpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzdHJva2UgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHN0cm9rZS53aWR0aCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3Ryb2tlLndpZHRoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFN0cm9rZV8xLmRlZmF1bHQoc3Ryb2tlLndpZHRoLCB0aGlzLmNyZWF0ZUNvbG9yKHN0cm9rZS5jb2xvcikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFN0cm9rZV8xLmRlZmF1bHQoMCwgQ29sb3JfMS5kZWZhdWx0LmZyb21SR0IoMCwgMCwgMCkpO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLmNyZWF0ZVJhZGl1cyA9IGZ1bmN0aW9uIChyYWRpdXMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiByYWRpdXMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBpZiAocmFkaXVzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVSYWRpdXMocmFkaXVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhZGl1cy5sZW5ndGgpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHJhZGl1cyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmIChyYWRpdXMgPT09ICdyYW5kb20nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHJhZGl1cyA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGlmIChyYWRpdXMgPj0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByYWRpdXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDU7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUucGFyc2VTcGVlZCA9IGZ1bmN0aW9uIChzcGVlZCkge1xuICAgICAgICBpZiAoc3BlZWQgPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gc3BlZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDAuNTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5hbmltYXRlT3BhY2l0eSA9IGZ1bmN0aW9uIChhbmltYXRpb24pIHtcbiAgICAgICAgaWYgKGFuaW1hdGlvbikge1xuICAgICAgICAgICAgdmFyIG1heCA9IHRoaXMub3BhY2l0eTtcbiAgICAgICAgICAgIHZhciBtaW4gPSB0aGlzLmNyZWF0ZU9wYWNpdHkoYW5pbWF0aW9uLm1pbik7XG4gICAgICAgICAgICB2YXIgc3BlZWQgPSB0aGlzLnBhcnNlU3BlZWQoYW5pbWF0aW9uLnNwZWVkKSAvIDEwMDtcbiAgICAgICAgICAgIGlmICghYW5pbWF0aW9uLnN5bmMpIHtcbiAgICAgICAgICAgICAgICBzcGVlZCAqPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5vcGFjaXR5ICo9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEFuaW1hdGlvbl8xLmRlZmF1bHQoc3BlZWQsIG1heCwgbWluKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5hbmltYXRlUmFkaXVzID0gZnVuY3Rpb24gKGFuaW1hdGlvbikge1xuICAgICAgICBpZiAoYW5pbWF0aW9uKSB7XG4gICAgICAgICAgICB2YXIgbWF4ID0gdGhpcy5yYWRpdXM7XG4gICAgICAgICAgICB2YXIgbWluID0gdGhpcy5jcmVhdGVSYWRpdXMoYW5pbWF0aW9uLm1pbik7XG4gICAgICAgICAgICB2YXIgc3BlZWQgPSB0aGlzLnBhcnNlU3BlZWQoYW5pbWF0aW9uLnNwZWVkKSAvIDEwMDtcbiAgICAgICAgICAgIGlmICghYW5pbWF0aW9uLnN5bmMpIHtcbiAgICAgICAgICAgICAgICBzcGVlZCAqPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5vcGFjaXR5ICo9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEFuaW1hdGlvbl8xLmRlZmF1bHQoc3BlZWQsIG1heCwgbWluKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5zZXRQb3NpdGlvbiA9IGZ1bmN0aW9uIChwb3NpdGlvbikge1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUubW92ZSA9IGZ1bmN0aW9uIChzcGVlZCkge1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnggKz0gdGhpcy52ZWxvY2l0eS54ICogc3BlZWQ7XG4gICAgICAgIHRoaXMucG9zaXRpb24ueSArPSB0aGlzLnZlbG9jaXR5LnkgKiBzcGVlZDtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5nZXRSYWRpdXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJhZGl1cyArIHRoaXMuYnViYmxlZC5yYWRpdXM7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuZ2V0T3BhY2l0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3BhY2l0eSArIHRoaXMuYnViYmxlZC5vcGFjaXR5O1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLmVkZ2UgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgICAgIHN3aXRjaCAoZGlyKSB7XG4gICAgICAgICAgICBjYXNlICd0b3AnOlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQ29vcmRpbmF0ZV8xLmRlZmF1bHQodGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnkgLSB0aGlzLmdldFJhZGl1cygpKTtcbiAgICAgICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KHRoaXMucG9zaXRpb24ueCArIHRoaXMuZ2V0UmFkaXVzKCksIHRoaXMucG9zaXRpb24ueSk7XG4gICAgICAgICAgICBjYXNlICdib3R0b20nOlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQ29vcmRpbmF0ZV8xLmRlZmF1bHQodGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnkgKyB0aGlzLmdldFJhZGl1cygpKTtcbiAgICAgICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQ29vcmRpbmF0ZV8xLmRlZmF1bHQodGhpcy5wb3NpdGlvbi54IC0gdGhpcy5nZXRSYWRpdXMoKSwgdGhpcy5wb3NpdGlvbi55KTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb247XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5pbnRlcnNlY3RpbmcgPSBmdW5jdGlvbiAocGFydGljbGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb24uZGlzdGFuY2UocGFydGljbGUucG9zaXRpb24pIDwgdGhpcy5nZXRSYWRpdXMoKSArIHBhcnRpY2xlLmdldFJhZGl1cygpO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLmJ1YmJsZSA9IGZ1bmN0aW9uIChtb3VzZSwgc2V0dGluZ3MpIHtcbiAgICAgICAgdmFyIGRpc3RhbmNlID0gdGhpcy5wb3NpdGlvbi5kaXN0YW5jZShtb3VzZS5wb3NpdGlvbik7XG4gICAgICAgIHZhciByYXRpbyA9IDEgLSBkaXN0YW5jZSAvIHNldHRpbmdzLmRpc3RhbmNlO1xuICAgICAgICBpZiAocmF0aW8gPj0gMCAmJiBtb3VzZS5vdmVyKSB7XG4gICAgICAgICAgICB0aGlzLmJ1YmJsZWQub3BhY2l0eSA9IHJhdGlvICogKHNldHRpbmdzLm9wYWNpdHkgLSB0aGlzLm9wYWNpdHkpO1xuICAgICAgICAgICAgdGhpcy5idWJibGVkLnJhZGl1cyA9IHJhdGlvICogKHNldHRpbmdzLnJhZGl1cyAtIHRoaXMucmFkaXVzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYnViYmxlZC5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgIHRoaXMuYnViYmxlZC5yYWRpdXMgPSAwO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gUGFydGljbGU7XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gUGFydGljbGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBBbmltYXRpb25GcmFtZUZ1bmN0aW9uc18xID0gcmVxdWlyZShcIi4vQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnNcIik7XG52YXIgRE9NXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9ET01cIik7XG52YXIgQ29vcmRpbmF0ZV8xID0gcmVxdWlyZShcIi4vQ29vcmRpbmF0ZVwiKTtcbnZhciBQYXJ0aWNsZV8xID0gcmVxdWlyZShcIi4vUGFydGljbGVcIik7XG52YXIgUGFydGljbGVzID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQYXJ0aWNsZXMoY3NzUXVlcnksIGNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMucGl4ZWxSYXRpb0xpbWl0ID0gODtcbiAgICAgICAgdGhpcy5waXhlbFJhdGlvID0gMTtcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgdGhpcy5tb3VzZSA9IHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBuZXcgQ29vcmRpbmF0ZV8xLmRlZmF1bHQoMCwgMCksXG4gICAgICAgICAgICBvdmVyOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmhhbmRsZVJlc2l6ZSA9IG51bGw7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSBudWxsO1xuICAgICAgICB0aGlzLm1vdXNlRXZlbnRzQXR0YWNoZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jYW52YXMgPSBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KGNzc1F1ZXJ5KTtcbiAgICAgICAgaWYgKHRoaXMuY2FudmFzID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBcIkNhbnZhcyBJRCBcIiArIGNzc1F1ZXJ5ICsgXCIgbm90IGZvdW5kLlwiO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dChjb250ZXh0KTtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IEFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zXzEuQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCk7XG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IEFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zXzEuQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMuY2FuY2VsQW5pbWF0aW9uRnJhbWUoKTtcbiAgICAgICAgdGhpcy5wYXJ0aWNsZVNldHRpbmdzID0ge1xuICAgICAgICAgICAgbnVtYmVyOiAzNTAsXG4gICAgICAgICAgICBkZW5zaXR5OiAxMDAwLFxuICAgICAgICAgICAgY29sb3I6ICcjRkZGRkZGJyxcbiAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICByYWRpdXM6IDUsXG4gICAgICAgICAgICBzaGFwZTogJ2NpcmNsZScsXG4gICAgICAgICAgICBzdHJva2U6IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICAgICAgICBjb2xvcjogJyMwMDAwMDAnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbW92ZToge1xuICAgICAgICAgICAgICAgIHNwZWVkOiAwLjQsXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uOiAnYm90dG9tJyxcbiAgICAgICAgICAgICAgICBzdHJhaWdodDogdHJ1ZSxcbiAgICAgICAgICAgICAgICByYW5kb206IHRydWUsXG4gICAgICAgICAgICAgICAgZWRnZUJvdW5jZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgYXR0cmFjdDogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICAgICByZXNpemU6IHRydWUsXG4gICAgICAgICAgICAgICAgaG92ZXI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGNsaWNrOiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGU6IHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiBmYWxzZSxcbiAgICAgICAgICAgICAgICByYWRpdXM6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaW50ZXJhY3RpdmVTZXR0aW5ncyA9IHtcbiAgICAgICAgICAgIGhvdmVyOiB7XG4gICAgICAgICAgICAgICAgYnViYmxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlOiA3NSxcbiAgICAgICAgICAgICAgICAgICAgcmFkaXVzOiA3LFxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAxXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZXB1bHNlOiB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlOiAxMDAsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsaWNrOiB7XG4gICAgICAgICAgICAgICAgYWRkOiB7XG4gICAgICAgICAgICAgICAgICAgIG51bWJlcjogNFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmVtb3ZlOiB7XG4gICAgICAgICAgICAgICAgICAgIG51bWJlcjogMlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnRyYWNrTW91c2UoKTtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyA+PSB0aGlzLnBpeGVsUmF0aW9MaW1pdCA/IHRoaXMucGl4ZWxSYXRpb0xpbWl0IC0gMiA6IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICAgICAgdGhpcy5zZXRDYW52YXNTaXplKCk7XG4gICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5yZW1vdmVQYXJ0aWNsZXMoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVQYXJ0aWNsZXMoKTtcbiAgICAgICAgdGhpcy5kaXN0cmlidXRlUGFydGljbGVzKCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnRyYWNrTW91c2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLm1vdXNlRXZlbnRzQXR0YWNoZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmV2ZW50cykge1xuICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5ldmVudHMuaG92ZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubW91c2UucG9zaXRpb24ueCA9IGV2ZW50Lm9mZnNldFggKiBfdGhpcy5waXhlbFJhdGlvO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5tb3VzZS5wb3NpdGlvbi55ID0gZXZlbnQub2Zmc2V0WSAqIF90aGlzLnBpeGVsUmF0aW87XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm1vdXNlLm92ZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm1vdXNlLnBvc2l0aW9uLnggPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5tb3VzZS5wb3NpdGlvbi55ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubW91c2Uub3ZlciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5ldmVudHMuY2xpY2spIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1vdXNlRXZlbnRzQXR0YWNoZWQgPSB0cnVlO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5pbml0aWFsaXplUGl4ZWxSYXRpbyA9IGZ1bmN0aW9uIChuZXdSYXRpbykge1xuICAgICAgICBpZiAobmV3UmF0aW8gPT09IHZvaWQgMCkgeyBuZXdSYXRpbyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvOyB9XG4gICAgICAgIHZhciBtdWx0aXBsaWVyID0gbmV3UmF0aW8gLyB0aGlzLnBpeGVsUmF0aW87XG4gICAgICAgIHRoaXMud2lkdGggPSB0aGlzLmNhbnZhcy5vZmZzZXRXaWR0aCAqIG11bHRpcGxpZXI7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5jYW52YXMub2Zmc2V0SGVpZ2h0ICogbXVsdGlwbGllcjtcbiAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5yYWRpdXMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLnJhZGl1cyA9IHRoaXMucGFydGljbGVTZXR0aW5ncy5yYWRpdXMubWFwKGZ1bmN0aW9uIChyKSB7IHJldHVybiByICogbXVsdGlwbGllcjsgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMucGFydGljbGVTZXR0aW5ncy5yYWRpdXMgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLnJhZGl1cyAqPSBtdWx0aXBsaWVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZSkge1xuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUuc3BlZWQgKj0gbXVsdGlwbGllcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmFuaW1hdGUgJiYgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLmFuaW1hdGUucmFkaXVzKSB7XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlU2V0dGluZ3MuYW5pbWF0ZS5yYWRpdXMuc3BlZWQgKj0gbXVsdGlwbGllcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyLmJ1YmJsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJhY3RpdmVTZXR0aW5ncy5ob3Zlci5idWJibGUucmFkaXVzICo9IG11bHRpcGxpZXI7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyLmJ1YmJsZS5kaXN0YW5jZSAqPSBtdWx0aXBsaWVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuaW50ZXJhY3RpdmVTZXR0aW5ncy5ob3Zlci5yZXB1bHNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyLnJlcHVsc2UuZGlzdGFuY2UgKj0gbXVsdGlwbGllcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBpeGVsUmF0aW8gPSBuZXdSYXRpbztcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuY2hlY2tab29tID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAod2luZG93LmRldmljZVBpeGVsUmF0aW8gIT09IHRoaXMucGl4ZWxSYXRpbyAmJiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyA8IHRoaXMucGl4ZWxSYXRpb0xpbWl0KSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BEcmF3aW5nKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICAgICAgICAgIHRoaXMuZHJhdygpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnNldENhbnZhc1NpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuZXZlbnRzICYmIHRoaXMucGFydGljbGVTZXR0aW5ncy5ldmVudHMucmVzaXplKSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZVJlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5jaGVja1pvb20oKTtcbiAgICAgICAgICAgICAgICBfdGhpcy53aWR0aCA9IF90aGlzLmNhbnZhcy5vZmZzZXRXaWR0aCAqIF90aGlzLnBpeGVsUmF0aW87XG4gICAgICAgICAgICAgICAgX3RoaXMuaGVpZ2h0ID0gX3RoaXMuY2FudmFzLm9mZnNldEhlaWdodCAqIF90aGlzLnBpeGVsUmF0aW87XG4gICAgICAgICAgICAgICAgX3RoaXMuY2FudmFzLndpZHRoID0gX3RoaXMud2lkdGg7XG4gICAgICAgICAgICAgICAgX3RoaXMuY2FudmFzLmhlaWdodCA9IF90aGlzLmhlaWdodDtcbiAgICAgICAgICAgICAgICBpZiAoIV90aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZSkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5yZW1vdmVQYXJ0aWNsZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuY3JlYXRlUGFydGljbGVzKCk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmRyYXdQYXJ0aWNsZXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX3RoaXMuZGlzdHJpYnV0ZVBhcnRpY2xlcygpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLmhhbmRsZVJlc2l6ZSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuZ2V0RmlsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3R4LmZpbGxTdHlsZTtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuc2V0RmlsbCA9IGZ1bmN0aW9uIChjb2xvcikge1xuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuc2V0U3Ryb2tlID0gZnVuY3Rpb24gKHN0cm9rZSkge1xuICAgICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IHN0cm9rZS5jb2xvci50b1N0cmluZygpO1xuICAgICAgICB0aGlzLmN0eC5saW5lV2lkdGggPSBzdHJva2Uud2lkdGg7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZHJhd1BhcnRpY2xlcygpO1xuICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUpXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnN0b3BEcmF3aW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5oYW5kbGVSZXNpemUpIHtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLmhhbmRsZVJlc2l6ZSk7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZVJlc2l6ZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGlvbkZyYW1lKTtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSBudWxsO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmRyYXdQb2x5Z29uID0gZnVuY3Rpb24gKGNlbnRlciwgcmFkaXVzLCBzaWRlcykge1xuICAgICAgICB2YXIgZGlhZ29uYWxBbmdsZSA9IDM2MCAvIHNpZGVzO1xuICAgICAgICBkaWFnb25hbEFuZ2xlICo9IE1hdGguUEkgLyAxODA7XG4gICAgICAgIHRoaXMuY3R4LnNhdmUoKTtcbiAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZShjZW50ZXIueCwgY2VudGVyLnkpO1xuICAgICAgICB0aGlzLmN0eC5yb3RhdGUoZGlhZ29uYWxBbmdsZSAvIChzaWRlcyAlIDIgPyA0IDogMikpO1xuICAgICAgICB0aGlzLmN0eC5tb3ZlVG8ocmFkaXVzLCAwKTtcbiAgICAgICAgdmFyIGFuZ2xlO1xuICAgICAgICBmb3IgKHZhciBzID0gMDsgcyA8IHNpZGVzOyBzKyspIHtcbiAgICAgICAgICAgIGFuZ2xlID0gcyAqIGRpYWdvbmFsQW5nbGU7XG4gICAgICAgICAgICB0aGlzLmN0eC5saW5lVG8ocmFkaXVzICogTWF0aC5jb3MoYW5nbGUpLCByYWRpdXMgKiBNYXRoLnNpbihhbmdsZSkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3R4LmZpbGwoKTtcbiAgICAgICAgdGhpcy5jdHgucmVzdG9yZSgpO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5kcmF3UGFydGljbGUgPSBmdW5jdGlvbiAocGFydGljbGUpIHtcbiAgICAgICAgdmFyIG9wYWNpdHkgPSBwYXJ0aWNsZS5nZXRPcGFjaXR5KCk7XG4gICAgICAgIHZhciByYWRpdXMgPSBwYXJ0aWNsZS5nZXRSYWRpdXMoKTtcbiAgICAgICAgdGhpcy5zZXRGaWxsKHBhcnRpY2xlLmNvbG9yLnRvU3RyaW5nKG9wYWNpdHkpKTtcbiAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGlmICh0eXBlb2YgKHBhcnRpY2xlLnNoYXBlKSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhd1BvbHlnb24ocGFydGljbGUucG9zaXRpb24sIHJhZGl1cywgcGFydGljbGUuc2hhcGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc3dpdGNoIChwYXJ0aWNsZS5zaGFwZSkge1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY2FzZSAnY2lyY2xlJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdHguYXJjKHBhcnRpY2xlLnBvc2l0aW9uLngsIHBhcnRpY2xlLnBvc2l0aW9uLnksIHJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdHguY2xvc2VQYXRoKCk7XG4gICAgICAgIGlmIChwYXJ0aWNsZS5zdHJva2Uud2lkdGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0cm9rZShwYXJ0aWNsZS5zdHJva2UpO1xuICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdHguZmlsbCgpO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5nZXROZXdQb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdChNYXRoLnJhbmRvbSgpICogdGhpcy5jYW52YXMud2lkdGgsIE1hdGgucmFuZG9tKCkgKiB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5jaGVja1Bvc2l0aW9uID0gZnVuY3Rpb24gKHBhcnRpY2xlKSB7XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlLmVkZ2VCb3VuY2UpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFydGljbGUuZWRnZSgnbGVmdCcpLnggPCAwKVxuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi54ICs9IHBhcnRpY2xlLmdldFJhZGl1cygpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBhcnRpY2xlLmVkZ2UoJ3JpZ2h0JykueCA+IHRoaXMud2lkdGgpXG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnggLT0gcGFydGljbGUuZ2V0UmFkaXVzKCk7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLmVkZ2UoJ3RvcCcpLnkgPCAwKVxuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi55ICs9IHBhcnRpY2xlLmdldFJhZGl1cygpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBhcnRpY2xlLmVkZ2UoJ2JvdHRvbScpLnkgPiB0aGlzLmhlaWdodClcbiAgICAgICAgICAgICAgICAgICAgcGFydGljbGUucG9zaXRpb24ueSAtPSBwYXJ0aWNsZS5nZXRSYWRpdXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuZGlzdHJpYnV0ZVBhcnRpY2xlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5kZW5zaXR5ICYmIHR5cGVvZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmRlbnNpdHkpID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdmFyIGFyZWEgPSB0aGlzLmNhbnZhcy53aWR0aCAqIHRoaXMuY2FudmFzLmhlaWdodCAvIDEwMDA7XG4gICAgICAgICAgICBhcmVhIC89IHRoaXMucGl4ZWxSYXRpbyAqIDI7XG4gICAgICAgICAgICB2YXIgcGFydGljbGVzUGVyQXJlYSA9IGFyZWEgKiB0aGlzLnBhcnRpY2xlU2V0dGluZ3MubnVtYmVyIC8gdGhpcy5wYXJ0aWNsZVNldHRpbmdzLmRlbnNpdHk7XG4gICAgICAgICAgICB2YXIgbWlzc2luZyA9IHBhcnRpY2xlc1BlckFyZWEgLSB0aGlzLnBhcnRpY2xlcy5sZW5ndGg7XG4gICAgICAgICAgICBpZiAobWlzc2luZyA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVBhcnRpY2xlcyhtaXNzaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlUGFydGljbGVzKE1hdGguYWJzKG1pc3NpbmcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5jcmVhdGVQYXJ0aWNsZXMgPSBmdW5jdGlvbiAobnVtYmVyLCBwb3NpdGlvbikge1xuICAgICAgICBpZiAobnVtYmVyID09PSB2b2lkIDApIHsgbnVtYmVyID0gdGhpcy5wYXJ0aWNsZVNldHRpbmdzLm51bWJlcjsgfVxuICAgICAgICBpZiAocG9zaXRpb24gPT09IHZvaWQgMCkgeyBwb3NpdGlvbiA9IG51bGw7IH1cbiAgICAgICAgaWYgKCF0aGlzLnBhcnRpY2xlU2V0dGluZ3MpXG4gICAgICAgICAgICB0aHJvdyAnUGFydGljbGUgc2V0dGluZ3MgbXVzdCBiZSBpbml0YWxpemVkIGJlZm9yZSBhIHBhcnRpY2xlIGlzIGNyZWF0ZWQuJztcbiAgICAgICAgdmFyIHBhcnRpY2xlO1xuICAgICAgICBmb3IgKHZhciBwID0gMDsgcCA8IG51bWJlcjsgcCsrKSB7XG4gICAgICAgICAgICBwYXJ0aWNsZSA9IG5ldyBQYXJ0aWNsZV8xLmRlZmF1bHQodGhpcy5wYXJ0aWNsZVNldHRpbmdzKTtcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbikge1xuICAgICAgICAgICAgICAgIHBhcnRpY2xlLnNldFBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgcGFydGljbGUuc2V0UG9zaXRpb24odGhpcy5nZXROZXdQb3NpdGlvbigpKTtcbiAgICAgICAgICAgICAgICB9IHdoaWxlICghdGhpcy5jaGVja1Bvc2l0aW9uKHBhcnRpY2xlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlcy5wdXNoKHBhcnRpY2xlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5yZW1vdmVQYXJ0aWNsZXMgPSBmdW5jdGlvbiAobnVtYmVyKSB7XG4gICAgICAgIGlmIChudW1iZXIgPT09IHZvaWQgMCkgeyBudW1iZXIgPSBudWxsOyB9XG4gICAgICAgIGlmICghbnVtYmVyKSB7XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlcyA9IG5ldyBBcnJheSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZXMuc3BsaWNlKDAsIG51bWJlcik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUudXBkYXRlUGFydGljbGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gdGhpcy5wYXJ0aWNsZXM7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgcGFydGljbGUgPSBfYVtfaV07XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUpIHtcbiAgICAgICAgICAgICAgICBwYXJ0aWNsZS5tb3ZlKHRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlLnNwZWVkKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlLmVkZ2VCb3VuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLmVkZ2UoJ3JpZ2h0JykueCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnNldFBvc2l0aW9uKG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdCh0aGlzLndpZHRoICsgcGFydGljbGUuZ2V0UmFkaXVzKCksIE1hdGgucmFuZG9tKCkgKiB0aGlzLmhlaWdodCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBhcnRpY2xlLmVkZ2UoJ2xlZnQnKS54ID4gdGhpcy53aWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUuc2V0UG9zaXRpb24obmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KC0xICogcGFydGljbGUuZ2V0UmFkaXVzKCksIE1hdGgucmFuZG9tKCkgKiB0aGlzLmhlaWdodCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5lZGdlKCdib3R0b20nKS55IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUuc2V0UG9zaXRpb24obmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KE1hdGgucmFuZG9tKCkgKiB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCArIHBhcnRpY2xlLmdldFJhZGl1cygpKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocGFydGljbGUuZWRnZSgndG9wJykueSA+IHRoaXMuaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5zZXRQb3NpdGlvbihuZXcgQ29vcmRpbmF0ZV8xLmRlZmF1bHQoTWF0aC5yYW5kb20oKSAqIHRoaXMud2lkdGgsIC0xICogcGFydGljbGUuZ2V0UmFkaXVzKCkpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUuZWRnZUJvdW5jZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFydGljbGUuZWRnZSgnbGVmdCcpLnggPCAwIHx8IHBhcnRpY2xlLmVkZ2UoJ3JpZ2h0JykueCA+IHRoaXMud2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnZlbG9jaXR5LmZsaXAodHJ1ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5lZGdlKCd0b3AnKS55IDwgMCB8fCBwYXJ0aWNsZS5lZGdlKCdib3R0b20nKS55ID4gdGhpcy5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnZlbG9jaXR5LmZsaXAoZmFsc2UsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5hbmltYXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5hbmltYXRlLm9wYWNpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLm9wYWNpdHkgPj0gcGFydGljbGUub3BhY2l0eUFuaW1hdGlvbi5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLm9wYWNpdHlBbmltYXRpb24uaW5jcmVhc2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBhcnRpY2xlLm9wYWNpdHkgPD0gcGFydGljbGUub3BhY2l0eUFuaW1hdGlvbi5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLm9wYWNpdHlBbmltYXRpb24uaW5jcmVhc2luZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcGFydGljbGUub3BhY2l0eSArPSBwYXJ0aWNsZS5vcGFjaXR5QW5pbWF0aW9uLnNwZWVkICogKHBhcnRpY2xlLm9wYWNpdHlBbmltYXRpb24uaW5jcmVhc2luZyA/IDEgOiAtMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5vcGFjaXR5IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5hbmltYXRlLnJhZGl1cykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFydGljbGUucmFkaXVzID49IHBhcnRpY2xlLnJhZGl1c0FuaW1hdGlvbi5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnJhZGl1c0FuaW1hdGlvbi5pbmNyZWFzaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocGFydGljbGUucmFkaXVzIDw9IHBhcnRpY2xlLnJhZGl1c0FuaW1hdGlvbi5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnJhZGl1c0FuaW1hdGlvbi5pbmNyZWFzaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5yYWRpdXMgKz0gcGFydGljbGUucmFkaXVzQW5pbWF0aW9uLnNwZWVkICogKHBhcnRpY2xlLnJhZGl1c0FuaW1hdGlvbi5pbmNyZWFzaW5nID8gMSA6IC0xKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLnJhZGl1cyA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnJhZGl1cyA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmV2ZW50cykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuZXZlbnRzLmhvdmVyID09PSAnYnViYmxlJyAmJiB0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIgJiYgdGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyLmJ1YmJsZSkge1xuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5idWJibGUodGhpcy5tb3VzZSwgdGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyLmJ1YmJsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmRyYXdQYXJ0aWNsZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy51cGRhdGVQYXJ0aWNsZXMoKTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IHRoaXMucGFydGljbGVzOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIHBhcnRpY2xlID0gX2FbX2ldO1xuICAgICAgICAgICAgdGhpcy5kcmF3UGFydGljbGUocGFydGljbGUpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnNldFBhcnRpY2xlU2V0dGluZ3MgPSBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgICAgaWYgKHRoaXMucnVubmluZykge1xuICAgICAgICAgICAgdGhyb3cgJ0Nhbm5vdCBjaGFuZ2Ugc2V0dGluZ3Mgd2hpbGUgQ2FudmFzIGlzIHJ1bm5pbmcuJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVTZXR0aW5ncyA9IHNldHRpbmdzO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnNldEludGVyYWN0aXZlU2V0dGluZ3MgPSBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgICAgaWYgKHRoaXMucnVubmluZykge1xuICAgICAgICAgICAgdGhyb3cgJ0Nhbm5vdCBjaGFuZ2Ugc2V0dGluZ3Mgd2hpbGUgQ2FudmFzIGlzIHJ1bm5pbmcuJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaW50ZXJhY3RpdmVTZXR0aW5ncyA9IHNldHRpbmdzO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgJ1BhcnRpY2xlIHNldHRpbmdzIG11c3QgYmUgaW5pdGFsaXplZCBiZWZvcmUgQ2FudmFzIGNhbiBzdGFydC4nO1xuICAgICAgICBpZiAodGhpcy5ydW5uaW5nKVxuICAgICAgICAgICAgdGhyb3cgJ0NhbnZhcyBpcyBhbHJlYWR5IHJ1bm5pbmcuJztcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgICAgIHRoaXMuZHJhdygpO1xuICAgIH07XG4gICAgcmV0dXJuIFBhcnRpY2xlcztcbn0oKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBQYXJ0aWNsZXM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBTdHJva2UgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFN0cm9rZSh3aWR0aCwgY29sb3IpIHtcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgfVxuICAgIHJldHVybiBTdHJva2U7XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gU3Ryb2tlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgVmVjdG9yID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBWZWN0b3IoeCwgeSkge1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgIH1cbiAgICBWZWN0b3IucHJvdG90eXBlLmZsaXAgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICBpZiAoeCA9PT0gdm9pZCAwKSB7IHggPSB0cnVlOyB9XG4gICAgICAgIGlmICh5ID09PSB2b2lkIDApIHsgeSA9IHRydWU7IH1cbiAgICAgICAgaWYgKHgpIHtcbiAgICAgICAgICAgIHRoaXMueCAqPSAtMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoeSkge1xuICAgICAgICAgICAgdGhpcy55ICo9IC0xO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBWZWN0b3IucHJvdG90eXBlLm1hZ25pdHVkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCgodGhpcy54ICogdGhpcy54KSArICh0aGlzLnkgKiB0aGlzLnkpKTtcbiAgICB9O1xuICAgIFZlY3Rvci5wcm90b3R5cGUuYW5nbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnRhbih0aGlzLnkgLyB0aGlzLngpO1xuICAgIH07XG4gICAgcmV0dXJuIFZlY3Rvcjtcbn0oKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBWZWN0b3I7XG4iXX0=
