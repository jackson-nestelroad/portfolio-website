// Events for handling logo animation

import { Logo } from '../Modules/WebPage'
import { DOM } from '../Modules/DOM';

// window.addEventListener('load', () => {
//     if(!DOM.isIE()) {
//         Logo.Outer.classList.remove('preload');
//         setTimeout(() => {
//             Logo.Inner.classList.remove('preload');
//         }, 400);
//     }
//     else {
//         Logo.Outer.className = 'outer';
//         setTimeout(() => {
//             Logo.Inner.className = 'inner';
//         }, 400);
//     }
// });

DOM.load().then(document => {
    if(!DOM.isIE()) {
        Logo.Outer.classList.remove('preload');
        setTimeout(() => {
            Logo.Inner.classList.remove('preload');
        }, 400);
    }
    else {
        Logo.Outer.className = 'outer';
        setTimeout(() => {
            Logo.Inner.className = 'inner';
        }, 400);
    }
});