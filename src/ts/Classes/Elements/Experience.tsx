// Class for a single card in the Experience section

import { DataComponent } from '../Component'
import { ElementFactory } from '../../Definitions/JSX'

// Format for data
export interface ExperienceData {
    collapse?: boolean,
    svg: string,
    link: string,
    disableLink?: boolean,
    company: string,
    team: string,
    location: string,
    position: string,
    begin: string,
    end: string,
    flavor: string,
    roles: string[]
}

// Class to craft an element from ExperienceData
export class Experience extends DataComponent<ExperienceData> {
    private collapsible: boolean;
    private collapsed: boolean;

    private beforeCreate(): void {
        if (this.data.collapse === undefined) {
            this.collapsible = false;
            this.collapsed = false;
        } else {
            this.collapsible = true;
            this.collapsed = !!this.data.collapse;
        }
    }

    private setAccordionAttribute(): void {
        if (!this.collapsed) {
            this.getReference('accordion').setAttribute('open', '');
        } else {
            this.getReference('accordion').removeAttribute('open');
        }
    }

    private created(): void {
        if (this.collapsible) {
            this.setAccordionAttribute();
        }
    }

    private toggleAccordion(): void {
        this.collapsed = !this.collapsed;
        this.update();
    }

    protected update(): void {
        if (this.collapsible) {
            this.setAccordionAttribute();

            const panel = this.getReference('accordion').getElementsByClassName('panel').item(0) as HTMLElement;
            if (!panel?.style) {
                throw new Error('Failed to modify style of panel in accordion');
            }

            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }
        }
    }

    private createCardBody(): HTMLElement {
        return (
            <div className="panel">
                <hr />
                <div className="content info">
                    <p className="description is-size-8 is-color-light is-italic is-justified is-quote">{this.data.flavor}</p>
                    <ul className="job is-left-aligned is-size-7 xs-y-padding-between-1">
                        {this.data.roles.map(role => {
                            return <li>{role}</li>
                        })}
                    </ul>
                </div>
            </div>
        );
    }

    private createIcon(): HTMLElement {
        return <img src={`./images/Experience/${this.data.svg}.svg`} />;
    }

    public createElement(): HTMLElement {
        return (
            <div className="card is-theme-secondary elevation-1 experience">
                <div className="content padding-2">
                    <div className="header">
                        <div className="icon">
                            {this.data.disableLink
                                ? <div>{this.createIcon()}</div>
                                : <a href={this.data.link} target="_blank">{this.createIcon()}</a>
                            }
                        </div>
                        <div className="company">
                            <p className="name is-size-6 is-bold-weight is-colored-link">
                                {this.data.disableLink
                                    ? <div>{this.data.company}</div>
                                    : <a href={this.data.link} target="_blank">{this.data.company}</a>
                                }
                            </p>
                            <p className="team is-size-7 is-bold-weight is-color-light">{this.data.team}</p>
                            <p className="location is-size-8 is-italic is-color-light">{this.data.location}</p>
                        </div>
                        <div className="role">
                            <p className="name is-size-7 is-bold-weight">{this.data.position}</p>
                            <p className="date is-size-8 is-italic is-color-light">{`(${this.data.begin} \u2014 ${this.data.end})`}</p>
                        </div>
                    </div>
                    {this.collapsible
                        ? <div className="accordion" ref="accordion">
                            {this.createCardBody()}
                            <div className="toggle-wrapper is-color-light" onClick={this.toggleAccordion.bind(this)}>
                                <button type="button"
                                    className="toggle btn is-svg is-primary is-center-sligned is-size-6">
                                    <i className="fa-solid fa-chevron-down"></i>
                                </button>
                            </div>
                        </div>
                        : this.createCardBody()
                    }
                </div>
            </div>
        );
    }
}