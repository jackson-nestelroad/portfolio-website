// Class for a single card in the Education section

import { ElementFactory } from '../../Definitions/JSX'
import { DOM } from '../../Modules/DOM'
import { Skill, SkillData, SkillCategory } from './Skill'
import { SkillsGrid, ScrollHook } from '../../Modules/WebPage'
import { Skills } from '../../Data/Skills'

// Class for managing SkillsFilter dropdown
export class SkillsFilter {
    private filter: number = 0;
    private active: boolean = false;
    private top: boolean = false;
    private optionElements: Map<Element, number> = new Map();
    private skillElements: Skill[] = [];
    private maxHeight: number = 224;

    public readonly Container: HTMLElement = DOM.getFirstElement('section#skills .skills-filter');
    public readonly Dropdown: HTMLElement = this.Container.querySelector('.dropdown');
    public readonly SelectedOptionsDisplay: HTMLElement = this.Dropdown.querySelector('.selected-options .display');
    public readonly Menu: HTMLElement = this.Dropdown.querySelector('.menu');
    public readonly MenuOptions: HTMLElement = this.Menu.querySelector('.options');

    public readonly CategoryMap: { [num: number]: string } = Object.entries(SkillCategory)
        // Get all entries where the number is the key
        .filter(([key, val]) => !isNaN(Number(key)))
        // Reduce back to option
        .reduce((obj, [key, val]) => {
            return {
                ...obj,
                [key]: val,
            };
        }, { });

    constructor() {
        DOM.load().then(document => {
            Skill.initialize().then(() => {
                this.initialize();
                this.createSkillElements();
                this.createOptions();
                this.update();
                this.createEventListeners();
            });
        });
    }

    private initialize(): void {
        this.Menu.style.maxHeight = `${this.maxHeight}px`;
        this.checkPosition();
    }

    private createOptions(): void {
        Object.entries(this.CategoryMap).forEach(([key, val]) => {
            const element = <li className="is-size-7">{val}</li>;
            this.optionElements.set(element, Number(key));
            this.MenuOptions.appendChild(element);
        });
    }

    private createSkillElements(): void {
        // We only have to create each skill element once
        for (const skill of Skills) {
            this.skillElements.push(new Skill(skill));
        }
    }

    private update(): void {
        // Remove children without destroying them
        for (let i = SkillsGrid.children.length - 1; i >= 0; --i) {
            SkillsGrid.removeChild(SkillsGrid.children.item(i));
        }

        // No filter => show all skills
        if (this.filter === 0) {
            this.skillElements.forEach(skill => skill.appendTo(SkillsGrid));
            this.SelectedOptionsDisplay.innerText = 'None';
        }
        else {
            this.skillElements.filter(skill => (skill.getCategory() & this.filter) !== 0)
                .forEach(skill => skill.appendTo(SkillsGrid));
            
            let text = Object.entries(this.CategoryMap).filter(([key, val]) =>  (this.filter & Number(key)) !== 0)
                .map(([key, val]) => val).join(', ');
            this.SelectedOptionsDisplay.innerText = text;
        }
    }

    private createEventListeners(): void {
        document.addEventListener('click', (event: MouseEvent) => {
            // Clicked an option
            if (this.optionElements.has(event.target as Element)) {
                this.toggleOption(event.target as Element);
            }
            else {
                const path = DOM.getPathToRoot(event.target as Element);
                if (path.indexOf(this.Dropdown) === -1) {
                    this.close();
                }
                else {
                    this.open();
                }
            }
        }, {
            passive: true,
        });

        document.addEventListener('keydown', (event: KeyboardEvent) => {
            // Space
            if (event.keyCode === 32) {
                const path = DOM.getPathToRoot(document.activeElement);
                if (path.indexOf(this.Dropdown) !== -1) {
                    this.toggle();
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
            else if (this.active) {
                // Left arrow or up arrow
                if (event.keyCode === 37 || event.keyCode === 38) {

                    event.preventDefault();
                    event.stopPropagation();
                }
                // Right arrow or down arrow
                else if (event.keyCode === 39 || event.keyCode === 40) {

                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        });

        this.Dropdown.addEventListener('blur', (event: FocusEvent) => {
            if (this.active) {
                this.close();
            }
        });

        ScrollHook.addEventListener('scroll', (event: Event) => {
            this.checkPosition();
        },
        {
            passive: true,
        });
    }

    private close(): void {
        this.active = false;
        this.Dropdown.classList.remove('active');
    }

    private open(): void {
        this.active = true;
        this.Dropdown.classList.add('active');
    }

    private toggle(): void {
        this.active ? this.close() : this.open();
    }

    private toggleOption(option: Element) {
        const bit = this.optionElements.get(option);
        if ((this.filter & bit) !== 0) {
            option.classList.remove('selected');    
        }
        else {
            option.classList.add('selected');
        }
        this.filter ^= bit;
        this.update();
    }

    private checkPosition(): void {
        if (DOM.pixelsAboveScreenBottom(this.Dropdown) <= this.maxHeight) {
            if (!this.top) {
                this.top = true;
                this.Dropdown.classList.add('top');   
            }
        }
        else {
            if (this.top) {
                this.top = false;
                this.Dropdown.classList.remove('top');
            }
        }
    }
}