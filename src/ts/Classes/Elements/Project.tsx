// Class for a single card in the Projects section

import { ElementFactory } from '../../Definitions/JSX'
import { DataComponent } from '../Component'

export interface ProjectData {
    name: string,
    color: string,
    image: string,
    type: string,
    date: string,
    flavor: string,
    repo: string | null,
    external: string | null,
    details: string[]
}

// Class to craft an element from ProjectData
export class Project extends DataComponent<ProjectData> {
    private infoDisplayed: boolean = false;

    private lessInfo(): void {
        this.infoDisplayed = false;
        this.update();
    }

    private toggleInfo(): void {
        this.infoDisplayed = !this.infoDisplayed;
        this.update();
    }

    protected update(): void {
        if(this.infoDisplayed) {
            this.getReference('slider').setAttribute('opened', '');
        }
        else {
            this.getReference('slider').removeAttribute('opened');
        }

        this.getReference('infoText').innerHTML = `${this.infoDisplayed ? 'Less' : 'More'} Info`;
    }

    protected createElement(): HTMLElement {
        const inlineStyle = {
            '--button-background-color': this.data.color
        } as React.CSSProperties;

        const imageStyle = {
            backgroundImage: `url(${`./out/images/Projects/${this.data.image}`})`
        }

        this.element = (
            <div className="xs-12 sm-6 md-4">
                <div className="project card is-theme-secondary elevation-1 is-in-grid" style={inlineStyle}>
                    <div className="image" style={imageStyle}></div>
                    <div className="content padding-2">
                        <div className="title">
                            <p className="name is-size-6 is-bold-weight" style={{ color: this.data.color }}>{this.data.name}</p>
                            <p className="type is-size-8">{this.data.type}</p>
                            <p className="date is-size-8 is-color-light">{this.data.date}</p>
                        </div>
                        <div className="body">
                            <p className="flavor is-size-7">{this.data.flavor}</p>
                        </div>
                        <div className="slider is-theme-secondary" ref="slider">
                            <div className="content padding-4">
                                <div className="title flex row xs-x-begin xs-y-center">
                                    <p className="is-size-6 is-bold-weight">Details</p>
                                    <button className="btn close is-svg is-primary xs-x-self-end" tabindex="-1" onClick={this.lessInfo.bind(this)}>
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                                <div className="body">
                                    <ul className="details xs-y-padding-between-1 is-size-8">
                                        {this.data.details.map(detail => {
                                            return <li>{detail}</li>
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="options is-theme-secondary xs-x-margin-between-1">
                            <button className="info btn is-primary is-text is-custom" onClick={this.toggleInfo.bind(this)}>
                                <i className="fas fa-info"></i>
                                <span ref="infoText">More Info</span>
                            </button>
                            {
                                this.data.repo ?
                                <a className="code btn is-primary is-text is-custom" href={this.data.repo} target="_blank" tabindex="0">
                                    <i className="fas fa-code"></i>
                                    <span>See Code</span>
                                </a>
                                : null
                            }
                            {
                                this.data.external ? 
                                <a className="external btn is-primary is-text is-custom" href={this.data.external} target="_blank" tabindex="0">
                                    <i className="fas fa-external-link-alt"></i>
                                    <span>View Online</span>
                                </a>
                                : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        );

        return this.element;
    }
}