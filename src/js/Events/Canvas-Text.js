
import DOM from '../Classes/DOM'

let textContainer = DOM.getFirstElement('div.canvas div.canvas-text-container');
const delay = 1000;

document.addEventListener('DOMContentLoaded', () => {
    for(let i = 0; i < textContainer.childElementCount; i++) {
        setTimeout(() => {
            DOM.removeClass(textContainer.children[i], 'preload')
        }, delay * (i + 1));
    }
});