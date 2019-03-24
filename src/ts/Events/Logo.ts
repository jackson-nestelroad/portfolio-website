// Events for handling logo animation

import { Logo } from '../Modules/WebPage'

document.addEventListener('DOMContentLoaded', () => {
    Logo.Outer.classList.remove('preload');
    setTimeout(() => {
        Logo.Inner.classList.remove('preload');
    }, 400);
});