// Namespace with HTML Elements for JavaScript interaction

import { DOM } from './DOM'
import Section from '../Classes/Elements/Section'
import { Menu } from '../Classes/Elements/Menu'

// Main tag
export const Main: HTMLElement = DOM.getFirstElement('main');

// Scroll container in Main tag
export const MainScroll: HTMLElement = DOM.getFirstElement('main .scroll');

// Logo images
export const Logo = {
    Outer: DOM.getFirstElement('header.logo .image img.outer'),
    Inner: DOM.getFirstElement('header.logo .image img.inner')
}

// Container for text over canvas
export const CanvasText: HTMLElement = DOM.getFirstElement('div.canvas div.canvas-text-container');

// Fixed button to open menu
export const MenuButton: Menu = new Menu();

// All section tags
export const Sections: Map<string, Section> = new Map();
for(let element of Array.from(DOM.getElements('section'))) {
    Sections.set(element.id, new Section(element));
}

// Maps a section to its corresponding button in the navigation menu
export const SectionToMenu: Map<string, [Section, HTMLElement]> = new Map();
for(let anchor of Array.from(DOM.getElements('header.navigation .sections a'))) {
    let id = anchor.getAttribute('href').substr(1);
    if(Sections.get(id) && Sections.get(id).inMenu()) {
        SectionToMenu.set(id, [Sections.get(id), anchor]);
    }
}

// Grid to draw skills onto
export const SkillsGrid: HTMLElement = DOM.getFirstElement('section#skills .hex-grid');