// Events attached to the navigation menu

import { DOM } from '../Modules/DOM'
import { MenuButton, SectionToMenu } from '../Modules/WebPage'
import Section from '../Classes/Elements/Section'

document.addEventListener('scroll', event => {
    MenuButton.updateContrast();
}, {
    capture: true,
    passive: true
});

// Toggle menu to open when clicked
MenuButton.Hamburger.addEventListener('click', () => {
    MenuButton.toggle();
});

// Attach event listener to each anchor in the navigation menu to smooth scroll its section into view
let iter = SectionToMenu.values();
let current: IteratorResult<[Section, HTMLElement]> = iter.next();
for(let done = false; !done; current = iter.next(), done = current.done) {
    let section: Section;
    let anchor: HTMLElement;
    [section, anchor] = current.value;
    anchor.addEventListener('click', event => {
        event.preventDefault();
        section.element.scrollIntoView({
            behavior: 'smooth'
        });
    });
}