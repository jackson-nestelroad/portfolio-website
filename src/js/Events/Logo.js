// Events for handling logo animation

import DOM from '../Classes/DOM'

let innerSVG = DOM.getFirstElement('header.logo .image svg .inner');
let outerSVG = DOM.getFirstElement('header.logo .image svg .outer');

document.addEventListener('DOMContentLoaded', () => {
    DOM.removeClass(outerSVG, 'preload');
    setTimeout(() => {
        DOM.removeClass(innerSVG, 'preload');
    }, 400);
});