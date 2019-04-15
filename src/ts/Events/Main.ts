// Shift <main> tag over when menu is opened

import { Main, Navigation } from '../Modules/WebPage'

Navigation.subscribe(Main, (event: NewEvent) => {
    if(event.name === 'toggle') {
        if(event.detail.open) {
            Main.setAttribute('shifted', '');
        }
        else {
            Main.removeAttribute('shifted');
        }
    }
});