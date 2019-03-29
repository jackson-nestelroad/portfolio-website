// Namespace for Menu data

import { DOM } from '../../Modules/DOM'
import { Events } from '../../Modules/EventDispatcher'

export class Menu extends Events.EventDispatcher {

    private open: boolean = false;
    private right: boolean = false;
    public Hamburger: HTMLElement =  DOM.getFirstElement('header.menu .hamburger');

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