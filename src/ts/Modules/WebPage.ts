// Namespace with HTML Elements for JavaScript interaction

import { DOM } from './DOM'
import Section from '../Classes/Section'

// SVG container for logo
export let Logo: HTMLElement = DOM.getFirstElement("header.logo .image svg");

// Container for text over canvas
export let CanvasText: HTMLElement = DOM.getFirstElement('div.canvas div.canvas-text-container');

// Menu components
export let Menu = {
    Hamburger: DOM.getFirstElement('header.menu .hamburger')
}

// All section tags
export let Sections: { [key: string]: Section } = {};
for(let element of Array.from(DOM.getElements('section'))) {
    Sections[element.id] = new Section(element);
}