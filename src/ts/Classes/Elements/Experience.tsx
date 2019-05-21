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

    // Creates an element once
    public createElement(): JSX.Element {
        return (
            <div className="card is-primary experience">
                <div className="content">
                    <div className="header">
                        <div className="icon">
                            <a href={this.data.link}>
                                <img src={`./out/images/Experience/${this.data.svg}.svg`}/>
                            </a>
                        </div>
                        <div className="company">
                            <a href={this.data.link} className="name is-size-1 is-normal-weight is-uppercase">{this.data.company}</a>
                            <p className="location is-size-5 is-italic is-light-color is-normal-weight">{this.data.location}</p>
                        </div>
                        <div className="role">
                            <p className="name is-size-3 is-bold">{this.data.position}</p>
                            <p className="date is-size-5 is-italic is-light-color is-normal-weight">{`(${this.data.begin} \u2014 ${this.data.end})`}</p>
                        </div>
                    </div>
                    <hr/>
                    <div className="content info">
                        <p className="description is-size-4 is-normal-weight is-light-color is-italic is-justified is-quote">{this.data.flavor}</p>
                        <ul className="job is-left-aligned is-size-4">
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