// Toggle the menu on click

import { Sections } from '../Modules/WebPage'
import { Navigation } from '../Modules/WebPage'

Navigation.Hamburger.addEventListener('click', () => {
    Navigation.toggle();
});

document.addEventListener('scroll', () => {
    // Menu.move(Sections['canvas'].inView());
});