// Class for a single card in the Experience section

import { ElementFactory } from '../../Definitions/JSX'

// Format for data
export interface ExperienceData {
    svg: string,
    link: string,
    company: string,
    location: string,
    position: string,
    begin: string,
    end: string,
    flavor: string,
    roles: Array<string>
}

// Class to craft an element from ExperienceData
export class Experience {
    public readonly data: ExperienceData;

    constructor(data: ExperienceData) {
        this.data = data;
    }

    public createElement(): HTMLElement {
        return (
            <div className="card is-theme-secondary elevation-1 experience">
                <div className="content padding-2">
                    <div className="header">
                        <div className="icon">
                            <a href={this.data.link} target="_blank">
                                <img src={`./out/images/Experience/${this.data.svg}.svg`}/>
                            </a>
                        </div>
                        <div className="company">
                            <a href={this.data.link} target="_blank" className="name is-size-4 is-normal-weight is-uppercase is-colored-link">{this.data.company}</a>
                            <p className="location is-size-8 is-italic is-color-light is-normal-weight">{this.data.location}</p>
                        </div>
                        <div className="role">
                            <p className="name is-size-6 is-bold-weight">{this.data.position}</p>
                            <p className="date is-size-8 is-italic is-color-light is-normal-weight">{`(${this.data.begin} \u2014 ${this.data.end})`}</p>
                        </div>
                    </div>
                    <hr/>
                    <div className="content info">
                        <p className="description is-size-8 is-normal-weight is-color-light is-italic is-justified is-quote">{this.data.flavor}</p>
                        <ul className="job is-left-aligned is-size-7 xs-y-padding-between-1">
                            {this.data.roles.map(role => {
                                return <li>{role}</li>
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}