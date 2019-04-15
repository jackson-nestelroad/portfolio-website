// Namespace for Menu data

import { DOM } from '../../Modules/DOM'
import { Events } from '../../Modules/EventDispatcher'

export class Menu extends Events.EventDispatcher {

    private open: boolean = false;
    public readonly Container: HTMLElement = DOM.getFirstElement('header.menu');
    public readonly Hamburger: HTMLElement =  DOM.getFirstElement('header.menu .hamburger');

    constructor() { 
        super();
        this.register('toggle');
    }

    public toggle(): void {
        this.open = !this.open;
        if(this.open) {
            this.Container.setAttribute('open', '');
        }
        else {
            this.Container.removeAttribute('open');
        }
        this.dispatch('toggle', { open: this.open });
    }
}