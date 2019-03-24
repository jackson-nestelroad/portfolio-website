// Animating text over particles canvas

import { CanvasText } from '../Modules/WebPage'

const delay = 1000;

document.addEventListener('DOMContentLoaded', () => {
    for(let i = 0; i < CanvasText.childElementCount; i++) {
        setTimeout(() => {
            CanvasText.children[i].classList.remove('preload');
        }, delay * (i + 1));
    }
});