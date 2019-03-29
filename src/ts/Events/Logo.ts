// Events for handling logo animation

import { Logo } from '../Modules/WebPage'
import { SVG } from '../Modules/SVG'
import { DOM } from '../Modules/DOM';

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
    Logo.appendChild(Use);
}

// Function to create logo in Internet Explorer
// Internet Explorer does not support the <use> tag with references to external URIs
function CreateLogoIE() {
    // Send an HTTP request to get the SVG code
    const SVGLocation: string = `${window.location.href}out/images/Logo.svg`;
    let request = new XMLHttpRequest();

    // Runs when we receive the SVG code
    request.addEventListener('load', function (this: XMLHttpRequest) {
        // Parse SVG as HTML by throwing it in a random element
        let temp = document.createElement('x');
        temp.innerHTML = this.responseText;
        let svg = temp.getElementsByTagName('svg')[0];

        // Set our class
        let parts = svg.getElementsByTagName('use');
        parts[0].setAttribute('class', 'outer preload');
        parts[1].setAttribute('class', 'inner preload');

        // No parentElement, so get the parent container the long way
        let container = DOM.getFirstElement('header.logo .image');
        container.innerHTML = temp.innerHTML;

        // We have to re-fetch our parts to 
        parts = container.getElementsByTagName('use');

        // Remove the preload class after a timeout
        // Good luck animating SVGs in IE...
        setTimeout(() => {
            parts[0].setAttribute('class', 'outer');
        }, 100);

        setTimeout(() => {
            parts[1].setAttribute('class', 'inner');
        }, 500);
    });
    request.open('get', SVGLocation);
    request.send();
}

// We must create each part of the logo after the page loads in order for it to be correctly animated
// We cannot only use the DOMContentLoaded event because the SVG might not have loaded yet
// We cannot only use the load event for the SVG image itself because the script might not be ready to receive it
// The solution here is to wait until the DOM is loaded to draw the logo itself so it can be properly animated when it loads
document.addEventListener('DOMContentLoaded', () => {
    if(!DOM.isIE()) {
        CreateLogo(Logo, 'outer', 0);
        CreateLogo(Logo, 'inner', 400);
    }
    else {
        CreateLogoIE();
    }
});