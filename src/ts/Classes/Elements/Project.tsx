// Class for a single card in the Projects section

import { DOM } from '../../Modules/DOM';
import { DataComponent } from '../Component'
import { ElementFactory } from '../../Definitions/JSX'

export interface ProjectData {
    name: string,
    color: string,
    image: string,
    type: string,
    date: string,
    award: string,
    flavor: string,
    repo: string | null,
    external: string | null,
    chrome?: string,
    firefox?: string,
    details: string[]
}

// Class to craft an element from ProjectData
export class Project extends DataComponent<ProjectData> {
    private infoDisplayed: boolean = false;
    private tooltipLeft: boolean = true;

    private created(): void {
        if (this.data.award) {
            window.addEventListener('resize', () => this.checkTooltipSide(), { passive: true });
        }
    }

    private mounted(): void {
        // Check tooltip side on initial mount if applicable
        if (this.data.award) {
            this.checkTooltipSide();
        }
    }

    private checkTooltipSide(): void {
        const tooltip = this.getReference('tooltip');

        const tooltipPos = tooltip.getBoundingClientRect().left;
        const screenWidth = DOM.getViewport().width;

        if (this.tooltipLeft !== (tooltipPos >= screenWidth / 2)) {
            this.tooltipLeft = !this.tooltipLeft;

            const add = this.tooltipLeft ? 'left' : 'top';
            const remove = this.tooltipLeft ? 'top' : 'left';

            tooltip.classList.remove(remove);
            tooltip.classList.add(add);
        }
    }

    private lessInfo(): void {
        this.infoDisplayed = false;
        this.update();
    }

    private toggleInfo(): void {
        this.infoDisplayed = !this.infoDisplayed;
        this.update();
    }

    protected update(): void {
        if (this.infoDisplayed) {
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
            backgroundImage: `url(${`./images/Projects/${this.data.image}`})`
        }

        return (
            <div className="xs-12 sm-6 md-4">
                {
                    this.data.award ?
                        <div className="award">
                            <div className="tooltip-container">
                                <img src="./images/Projects/award.png" />
                                <span ref="tooltip" className="tooltip left is-size-8">{this.data.award}</span>
                            </div>
                        </div>
                        : null
                }
                <div className="project card is-theme-secondary elevation-1 is-in-grid hide-overflow" style={inlineStyle}>
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
                                    <div className="close-btn-wrapper xs-x-self-end">
                                        <button className="btn close is-svg is-primary" tabindex="-1" onClick={this.lessInfo.bind(this)}>
                                            <i className="fa-solid fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="body">
                                    <ul className="details xs-y-padding-between-1 is-size-9">
                                        {this.data.details.map(detail => {
                                            return <li>{detail}</li>
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="options is-theme-secondary xs-x-margin-between-1">
                            <button className="info btn is-primary is-text is-custom" onClick={this.toggleInfo.bind(this)}>
                                <i className="fa-solid fa-info"></i>
                                <span ref="infoText">More Info</span>
                            </button>
                            {
                                this.data.repo ?
                                    <a className="code btn is-primary is-text is-custom" href={this.data.repo} target="_blank" tabindex="0">
                                        <i className="fa-solid fa-code"></i>
                                        <span>See Code</span>
                                    </a>
                                    : null
                            }
                            {
                                this.data.external ?
                                    <a className="external btn is-primary is-text is-custom" href={this.data.external} target="_blank" tabindex="0">
                                        <i className="fa-solid fa-external-link-alt"></i>
                                        <span>View Online</span>
                                    </a>
                                    : null
                            }
                            {
                                this.data.chrome ?
                                    <a className="external btn is-primary is-text is-custom" href={this.data.chrome} target="_blank" tabindex="0">
                                        <i className="fa-brands fa-chrome"></i>
                                        <span>For Chrome</span>
                                    </a>
                                    : null
                            }
                            {
                                this.data.firefox ?
                                    <a className="external btn is-primary is-text is-custom" href={this.data.firefox} target="_blank" tabindex="0">
                                        <i className="fa-brands fa-firefox-browser"></i>
                                        <span>For Firefox</span>
                                    </a>
                                    : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}