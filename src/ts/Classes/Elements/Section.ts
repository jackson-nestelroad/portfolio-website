// Class for getting information about a <section> tag

import { DOM } from '../../Modules/DOM'

export default class Section {
    constructor(public readonly element: HTMLElement) { }

    public inView(): boolean {
        return DOM.inVerticalWindowView(this.element);
    }

    public getID(): string {
        return this.element.id;
    }

    public inMenu(): boolean {
        return !this.element.classList.contains('no-menu');
    }
}