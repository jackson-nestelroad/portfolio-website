// Class for a single skill in the Skill section

import { DataComponent } from '../Component'
import { ElementFactory } from '../../Definitions/JSX'
import { SVG } from '../../Modules/SVG'

export enum SkillCategory {
    Programming = 1 << 0,
    Scripting = 1 << 1,
    Web = 1 << 2,
    Server = 1 << 3,
    Database = 1 << 4,
    DevOps = 1 << 5,
    Framework = 1 << 6,
    Other = 1 << 7
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

    public getName(): string {
        return this.data.name;
    }

    protected update(): void { }

    private created(): void {
        SVG.loadSVG(`./images/Skills/${this.data.svg}`).then(svg => {
            svg.setAttribute('class', 'icon');
            const hexagon = this.getReference('hexagon');
            hexagon.parentNode.insertBefore(svg, hexagon);
        });
    }

    protected createElement(): HTMLElement {
        if (!Skill.HexagonSVG) {
            throw 'Cannot create Skill element without being initialized.';
        }
        return (
            <li className='skill tooltip-container'>
                <div className='hexagon-container' style={{ color: this.data.color }}>
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
            if (Skill.HexagonSVG) {
                resolve(true);
            }
            else {
                SVG.loadSVG('./images/Content/Hexagon').then(element => {
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