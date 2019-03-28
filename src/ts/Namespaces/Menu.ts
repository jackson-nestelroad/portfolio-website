// Namespace for Menu data

import { Menu as Elements } from '../Modules/WebPage'
import { Events } from '../Modules/EventDispatcher'

class Menu extends Events.EventDispatcher {

    private open: boolean = false;
    private right: boolean = false;
    public Hamburger: HTMLElement = Elements.Hamburger;

    constructor() { 
        super();
        this.register('toggle', { open: this.open });
    }

    public toggle(): void {
        this.open = !this.open;
        if(this.open) {
            this.Hamburger.classList.add('open');
        }
        else {
            this.Hamburger.classList.remove('open');
        }
        this.dispatch('toggle');
    }
}

export const TopMenu = new Menu();