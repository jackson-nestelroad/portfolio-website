// Namespace for Menu data

import { Menu as Elements } from '../Modules/WebPage'

export namespace Menu {
    let open: boolean = false;
    let right: boolean = false;

    export let hamburger: HTMLElement = Elements.Hamburger;

    export function toggle(): void {
        open = !open;
        if(open) {
            hamburger.classList.add('open');
        }
        else {
            hamburger.classList.remove('open');
        }
    }
}