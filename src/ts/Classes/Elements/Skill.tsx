// Class for a single skill in the Skill section

import { SVG } from '../../Modules/SVG'
import { ElementFactory } from '../../Definitions/JSX'
import { DataComponent } from '../Component'

export enum SkillCategory {
    Programming,
    Web,
    Database,
    DevOps,
    Other
}

// Format for data for each skill
export interface SkillData {
    name: string,
    svg: string,
    color: string,
    category: SkillCategory
}

// Class to craft an element from SkillData
export class Skill extends DataComponent<SkillData> {
    private static HexagonSVG: SVGSVGElement;

    public getCategory(): SkillCategory {
        return this.data.category;
    }

    protected update(): void { }

    private created(): void {
        SVG.loadSVG(`./out/images/Skills/${this.data.svg}`).then(svg => {
            svg.setAttribute('class', 'icon');
            const hexagon = this.getReference('hexagon');
            hexagon.parentNode.insertBefore(svg, hexagon);
        });
    }

    protected createElement(): HTMLElement {
        if(!Skill.HexagonSVG) {
            throw 'Cannot create Skill element without being initialized.';
        }
        return (
            <li className='skill tooltip-container'>
                <div className='hexagon-container' style={{color: this.data.color}}>
                    <span className='tooltip top is-size-7'>{this.data.name}</span>
                    {Skill.HexagonSVG.cloneNode(true)}
                </div>
            </li>
        )
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
                    element.setAttribute('ref', 'hexagon');
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