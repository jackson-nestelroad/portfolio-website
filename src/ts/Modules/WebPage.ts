// Namespace with HTML Elements for JavaScript interaction

import { DOM } from './DOM'
import Section from '../Classes/Elements/Section'
import { Menu } from '../Classes/Elements/Menu'

// Main tag
export const Main: HTMLElement = DOM.getFirstElement('main');

// Logo images
export const Logo = {
    Outer: DOM.getFirstElement('header.logo .image img.outer'),
    Inner: DOM.getFirstElement('header.logo .image img.inner')
}

// Container for text over canvas
export let CanvasText: HTMLElement = DOM.getFirstElement('div.canvas div.canvas-text-container');

// Fixed navigation menu
export const Navigation: Menu = new Menu();

// All section tags
export let Sections: { [key: string]: Section } = {};
for(let element of Array.from(DOM.getElements('section'))) {
    Sections[element.id] = new Section(element);
}