// Namespace for Menu data

import { Menu as Elements } from '../Modules/WebPage'
import { EventCallback, EventDispatcher } from '../Classes/EventDispatcher';

export namespace Menu {
    let open: boolean = false;
    let right: boolean = false;
    const dispatcher = new EventDispatcher("menuToggle", { open: open }, false);

    export let Hamburger: HTMLElement = Elements.Hamburger;

    export function toggle(): void {
        open = !open;
        if(open) {
            Hamburger.classList.add('open');
        }
        else {
            Hamburger.classList.remove('open');
        }
        dispatcher.disperse();
    }

    export function move(moveRight: boolean): void {
        if(right !== moveRight) {
            right = moveRight;
        }
    }

    export const subscribe = (element: HTMLElement, callback: EventCallback): void => {
        dispatcher.subscribe(element, callback);
    }

    export const unsubscribe = (element: HTMLElement): void => {
        dispatcher.unsubscribe(element);
    }
}