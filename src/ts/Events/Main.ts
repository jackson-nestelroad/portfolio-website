// Event attached to the <main> tag

import { Main, ScrollHook, MenuButton, SectionToMenu } from '../Modules/WebPage'
import Section from '../Classes/Elements/Section'
import { DOM } from '../Modules/DOM'

// Shift <main> tag over when menu is opened
MenuButton.subscribe(Main, (event: NewEvent) => {
    if(event.name === 'toggle') {
        if(event.detail.open) {
            Main.setAttribute('shifted', '');
        }
        else {
            Main.removeAttribute('shifted');
        }
    }
});

// Toggle navigation sections when scrolled into view
ScrollHook.addEventListener('scroll', event => {
    let section: Section;
    let anchor: HTMLElement;
    let iter = SectionToMenu.values();
    let current: IteratorResult<[Section, HTMLElement]> = iter.next();
    for(let done = false; !done; current = iter.next(), done = current.done) {
        [section, anchor] = current.value;
        if(section.inView()) {
            anchor.setAttribute('selected', '');
        }
        else {
            anchor.removeAttribute('selected');
        }
    }
}, {
    capture: true,
    passive: true
});