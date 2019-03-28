// Toggle the menu on click

import { Sections } from '../Modules/WebPage'
import { Menu } from '../Namespaces/Menu'

Menu.Hamburger.addEventListener('click', () => {
    Menu.toggle();
});

document.addEventListener('scroll', () => {
    Menu.move(Sections['canvas'].inView());
});