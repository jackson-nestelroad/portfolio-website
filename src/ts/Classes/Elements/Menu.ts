// Class for Menu data

import { DOM } from '../../Modules/DOM'
import { Events } from '../../Modules/EventDispatcher'

export class Menu extends Events.EventDispatcher {

    private open: boolean = false;

    private readonly RGBRegExp: RegExp = /(rgb\(([0-9]{1,3}), ([0-9]{1,3}), ([0-9]{1,3})\))|(rgba\(([0-9]{1,3}), ([0-9]{1,3}), ([0-9]{1,3}), (0(?:\.[0-9]{1,2})?)\))/g;

    public readonly Container: HTMLElement = DOM.getFirstElement('header.menu');
    public readonly Hamburger: HTMLElement = DOM.getFirstElement('header.menu .hamburger');

    constructor() { 
        super();
        this.register('toggle');
    }

    public toggle(): void {
        this.open = !this.open;
        this.open ? this.openMenu() : this.closeMenu();
        this.dispatch('toggle', { open: this.open });
    }

    private openMenu(): void {
        this.Container.setAttribute('open', '');
        this.darken();
    }

    private closeMenu(): void {
        this.Container.removeAttribute('open');
        setTimeout(() => this.updateContrast(), 750);
    }

    private darken(): void {
        this.Hamburger.classList.remove('light');
    }

    private lighten(): void {
        this.Hamburger.classList.add('light');
    }

    public updateContrast(): void {
        if(!this.open) {
            const backgroundColor = this.getBackgroundColor();
            this.changeContrast(backgroundColor);
        }
    }

    private getBackgroundColor(): number[] {
        const elementsFromPoint = document.elementsFromPoint ? 'elementsFromPoint' : 'msElementsFromPoint';
        const { top, left } = this.Hamburger.getBoundingClientRect();
        let elements: Element[] = document[elementsFromPoint as 'elementsFromPoint'](left, top);
        
        const length = elements.length;
        let RGB: number[] = [];
        let background: string, regExResult: RegExpExecArray;
        let styles: CSSStyleDeclaration;

        // Get first background color that is not transparent (iterates from top to bottom)
        for(let i = 1; i < length; ++i, this.RGBRegExp.lastIndex = 0) {
            styles = window.getComputedStyle(elements[i]);

            // Some browsers do not calculate the background property
            background = styles.background || styles.backgroundColor + styles.backgroundImage;

            while(regExResult = this.RGBRegExp.exec(background)) {
                if(regExResult[1]) {
                    RGB = regExResult.slice(2, 5).map(val => parseInt(val));
                    return RGB;
                }
                else if(regExResult[5]) {
                    RGB = regExResult.slice(6, 10).map(val => parseInt(val));
                    if(!RGB.every(val => val === 0)) {
                        return RGB;
                    }
                }
            }
        }
        return RGB;
    }

    private changeContrast(RGB: number[]): void {
        let contrast, luminance;

        // Got three values (R, G, B)
        if(RGB.length === 3) {
            /**
             * @see https://www.w3.org/TR/WCAG20/
             * @see https://www.w3.org/TR/WCAG20/#relativeluminancedef
             * @see https://en.wikipedia.org/wiki/Luma_(video)#Rec._601_luma_versus_Rec._709_luma_coefficients
             */
            contrast = RGB.map(val => val / 255).map(val => {
                return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
            });

            luminance = 0.2126 * contrast[0] + 0.7152 * contrast[1] + 0.0722 * contrast[2];

            if(luminance > 0.179) {
                this.darken();
            }
            else {
                this.lighten();
            }
        }
        else {
            this.darken();
        }
    }
}