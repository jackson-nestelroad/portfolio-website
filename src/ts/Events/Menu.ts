// Toggle the menu on click

import { Sections } from '../Modules/WebPage'
import { TopMenu } from '../Namespaces/Menu'

TopMenu.Hamburger.addEventListener('click', () => {
    TopMenu.toggle();
});

document.addEventListener('scroll', () => {
    // TopMenu.move(Sections['canvas'].inView());
});