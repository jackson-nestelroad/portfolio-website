// Setting touchstart event for momentum scrolling on mobile

import { Body } from '../Modules/WebPage'

Body.addEventListener('touchstart', () => {
    // Empty body
}, {
    capture: true,
    passive: true
});