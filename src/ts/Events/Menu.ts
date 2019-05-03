// Toggle the menu on click

import { Navigation, NavigationAnchors, Sections } from '../Modules/WebPage'

Navigation.Hamburger.addEventListener('click', () => {
    Navigation.toggle();
});

NavigationAnchors.forEach((anchor: HTMLElement) => {
    anchor.addEventListener('click', function(event) {
        event.preventDefault();
        let destination = Sections[this.getAttribute('href').substr(1)];
        destination.element.scrollIntoView({
            behavior: 'smooth'
        });
    });
})