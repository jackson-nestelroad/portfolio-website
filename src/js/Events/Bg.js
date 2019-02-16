// Events for handling the <bg> tag

// This is old code that might be recycled or trashed later

import DOM from '../Classes/DOM';

// Mouse move over animation to change speed of background
document.addEventListener('mousemove', event => {
    let mousePos = event.clientX;
    let width = window.innerWidth / 2;
    let ratio = (mousePos - width) / width;
    let speed = 20 / ratio;
    let animation = ratio < 0 ? 'grid-animate-right' : 'grid-animate-left';
    // DOM.getFirstElement('bg').style.animation = `${animation} ${Math.abs(speed)}s linear infinite`;
});