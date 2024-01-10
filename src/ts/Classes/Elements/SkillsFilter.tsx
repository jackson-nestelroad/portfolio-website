// Class for managing SkillsFilter dropdown

import { ElementFactory } from '../../Definitions/JSX'
import { DOM } from '../../Modules/DOM'
import { Skill, SkillCategory, SkillData } from './Skill'
import { SkillsGrid, ScrollHook, KeyCodeCombos } from '../../Modules/WebPage'
import { NonSkills, Skills } from '../../Data/Skills'

// Class for managing SkillsFilter dropdown
export class SkillsFilter {
    private filter: number = 0;
    private active: boolean = false;
    private top: boolean = false;
    private maxHeight: number = 224;
    private optionElements: Map<HTMLElement, number> = new Map();
    private skillElements: Skill[] = [];
    private nonSkillsToAdd: number = 1;
    private nonSkillsNotAdded: SkillData[] = NonSkills;

    private usingArrowKeys: boolean = false;
    private lastSelected: HTMLElement = null;

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

    private addRandomNonSkillElement(): void {
        if (this.nonSkillsNotAdded.length === 0) {
            return;
        }
        let index = Math.floor(Math.random() * this.nonSkillsNotAdded.length);
        let nonSkillsToAdd = this.nonSkillsNotAdded.splice(index, this.nonSkillsToAdd);
        this.nonSkillsToAdd *= 2;
        this.skillElements.push(...nonSkillsToAdd.map(nonSkill => new Skill(nonSkill)));
        this.skillElements.sort((a, b) => a.getName().localeCompare(b.getName()));
        this.update();
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
            if (this.optionElements.has(event.target as HTMLElement)) {
                this.toggleOption(event.target as HTMLElement);
            }
            else {
                const path = DOM.getPathToRoot(event.target as Element);
                if (path.indexOf(this.Dropdown) === -1) {
                    this.close();
                }
                else {
                    this.active ? this.close() : this.open();
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
                    if (this.active && this.usingArrowKeys) {
                        this.toggleOption(this.lastSelected);
                    }
                    this.toggle();
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
            else if (this.active) {
                // Left arrow or up arrow
                if (event.keyCode === 37 || event.keyCode === 38) {
                    this.moveArrowSelection(-1);
                    event.preventDefault();
                    event.stopPropagation();
                }
                // Right arrow or down arrow
                else if (event.keyCode === 39 || event.keyCode === 40) {
                    this.moveArrowSelection(1);
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        });

        this.MenuOptions.addEventListener('mouseover', (event: MouseEvent) => {
            if (this.lastSelected) {
                this.usingArrowKeys = false;
                this.lastSelected.classList.remove('hover');
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

        KeyCodeCombos.subscribe(this.Container, () => {
            this.addRandomNonSkillElement();
        });
    }

    private close(): void {
        this.active = false;
        this.Dropdown.classList.remove('active');
    }

    private open(): void {
        this.active = true;
        this.Dropdown.classList.add('active');
        if (this.lastSelected) {
            this.lastSelected.classList.add('hover');
        }
    }

    private toggle(): void {
        this.active ? this.close() : this.open();
    }

    private toggleOption(option: HTMLElement): void {
        const bit = this.optionElements.get(option as HTMLElement);
        if ((this.filter & bit) !== 0) {
            option.classList.remove('selected');    
        }
        else {
            option.classList.add('selected');
        }
        this.filter ^= bit;
        this.lastSelected = option;
        this.update();
    }

    private moveArrowSelection(dir: number): void {
        if (!this.lastSelected) {
            this.lastSelected = this.MenuOptions.firstElementChild as HTMLElement;
            this.lastSelected.classList.add('hover');
        }
        else {
            if (this.usingArrowKeys) {
                this.lastSelected.classList.remove('hover');
                // Up
                if (dir < 0) {
                    this.lastSelected = (this.lastSelected.previousElementSibling || this.MenuOptions.lastElementChild) as HTMLElement;
                }
                // Down
                else {
                    this.lastSelected = (this.lastSelected.nextElementSibling || this.MenuOptions.firstElementChild) as HTMLElement;
                }
            }
            else {
                this.usingArrowKeys = true;
            }
            
            this.lastSelected.classList.add('hover');

            // Add scrolling functionality
            // If the option moved to is out of view, put it in view
            if (!DOM.inOffsetView(this.lastSelected, { ignoreX: true, whole: true })) {
                DOM.scrollContainerToViewWholeChild(this.Menu, this.lastSelected, { ignoreX: true, smooth: true });
            }
        }
        this.usingArrowKeys = true;
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
