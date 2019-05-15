// Class for a single skill in the Skill section

import { SVG } from '../../Modules/SVG'

// Format for data for each skill
export interface SkillData {
    name: string,
    svg: string,
    color: string
}

// Class to craft an element from SkillData
export class Skill {
    private element: HTMLElement = null;
    public readonly data: SkillData;

    private static HexagonSVG: SVGSVGElement;

    constructor(data: SkillData) {
        this.data = data;
    }

    // Creates an element once
    public createElement(): Promise<HTMLElement> {
        return new Promise((resolve, reject) => {
            if(this.element) {
                resolve(this.element);
            }

            SVG.loadSVG(`./out/images/Skills/${this.data.svg}`).then(svg => {
                svg.setAttribute('class', 'icon');

                let parent = document.createElement('li');
                parent.classList.add('skill');
                parent.setAttribute('name', this.data.name);
                
                let hexagonContainer = document.createElement('div');
                hexagonContainer.classList.add('hexagon-container');
                hexagonContainer.setAttribute('style', `color: ${this.data.color}`);

                let tooltip = document.createElement('span');
                tooltip.classList.add('tooltip');
                tooltip.innerText = this.data.name;

                hexagonContainer.appendChild(tooltip);
                hexagonContainer.appendChild(svg);

                let hexagon = Skill.HexagonSVG.cloneNode(true);
                hexagonContainer.appendChild(hexagon);
        
                parent.appendChild(hexagonContainer);

                this.element = parent;

                resolve(parent);
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    // Initializes static members
    public static initialize(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            // Resolve immediately if we already have initialized
            if(Skill.HexagonSVG) {
                resolve(true);
            }
            else {
                SVG.loadSVG('./out/images/Content/Hexagon').then(element => {
                    element.setAttribute('class', 'hexagon');
                    Skill.HexagonSVG = element;
                    resolve(true);
                })
                .catch(err => {
                    resolve(false);
                });
            }
        });
    }
}
// Initialize now
Skill.initialize();