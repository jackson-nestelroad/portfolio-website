// Class for getting information about a <section> tag

import { DOM } from '../../Modules/DOM'

export default class Section {
    constructor(private element: HTMLElement) { }

    public inView(): boolean {
        let bounding = this.element.getBoundingClientRect();
        let view = DOM.getViewport();

        return bounding.bottom >= 0 &&
               bounding.right >= 0 &&
               bounding.top <= view.height && 
               bounding.left <= view.width;
    }

    public getID(): string {
        return this.element.id;
    }
}