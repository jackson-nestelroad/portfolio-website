// Class for a single skill in the Skill section

import { SVG } from '../../Modules/SVG'
import { ElementFactory } from '../../Definitions/JSX'

// Format for data for each skill
export interface SkillData {
    name: string,
    svg: string,
    color: string
}

// Class to craft an element from SkillData
export class Skill {
    private element: JSX.Element = null;
    public readonly data: SkillData;

    private static HexagonSVG: SVGSVGElement;

    constructor(data: SkillData) {
        this.data = data;
    }

    // Creates an element once
    public createElement(): Promise<JSX.Element> {
        return new Promise((resolve, reject) => {
            if(this.element) {
                resolve(this.element);
            }

            SVG.loadSVG(`./out/images/Skills/${this.data.svg}`).then(svg => {
                svg.setAttribute('class', 'icon');

                resolve (
                    <li className='skill'>
                        <div className='hexagon-container' style={{color: this.data.color}}>
                            <span className='tooltip'>{this.data.name}</span>
                            {svg}
                            {Skill.HexagonSVG.cloneNode(true)}
                        </div>
                    </li>
                );
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