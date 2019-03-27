// Events for handling logo animation

import { Logo } from '../Modules/WebPage'
import { SVG } from '../Modules/SVG'

// Function to create inner and outer logo
function CreateLogo(Logo: HTMLElement, part: 'outer' | 'inner', delay: number): void {
    let Use: SVGUseElement = <SVGUseElement>document.createElementNS(SVG.svgns, 'use');
    Use.classList.value = `${part} preload`;
    Use.setAttributeNS(SVG.xlinkns, 'href', `out/images/Logo.svg#${part}`);
    Use.addEventListener('load', () => {
        setTimeout(() => {
            Use.classList.remove('preload');
        }, delay);
    });
    Logo.append(Use);
}

// We must create each part of the logo after the page loads in order for it to be correctly animated
// We cannot only use the DOMContentLoaded event because the SVG might not have loaded yet
// We cannot only use the load event for the SVG image itself because the script might not be ready to receive it
// The solution here is to wait until the DOM is loaded to draw the logo itself so it can be properly animated when it loads
document.addEventListener('DOMContentLoaded', () => {
    CreateLogo(Logo, 'outer', 0);
    CreateLogo(Logo, 'inner', 400);
});