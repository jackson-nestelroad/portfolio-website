// Class for a single card in the Education section

import { DOM } from '../../Modules/DOM'
import { DataComponent } from '../Component'
import { ElementFactory } from '../../Definitions/JSX'

// Format for data
export interface EducationData {
    name: string,
    color: string,
    image: string,
    link: string,
    location: string,
    degree: string,
    start: string,
    end: string,
    credits: {
        total: number;
        completed: number;
        taking: number;
    },
    gpa: string,
    notes: string[] | null,
    courses?: string[]
}

// Class to craft an element from EducationData
export class Education extends DataComponent<EducationData> {
    protected update(): void { }

    private created(): void {
        DOM.onFirstAppearance(this.element, () => {
            this.setProgress();
        }, { timeout: 500, offset: 0.3 });
    }

    private isComplete(): boolean {
        return this.data.credits.completed === this.data.credits.total;
    }

    private setProgress() {
        if (!this.isComplete()) {
            const completed = `${this.data.credits.completed / this.data.credits.total * 100}%`;
            const taking = `${(this.data.credits.completed + this.data.credits.taking) / this.data.credits.total * 100}%`;

            this.getReference('completedTrack').style.width = completed;
            this.getReference('takingTrack').style.width = taking;

            const completedMarker = this.getReference('completedMarker');
            const takingMarker = this.getReference('takingMarker');

            completedMarker.style.opacity = '1';
            completedMarker.style.left = completed;

            takingMarker.style.opacity = '1';
            takingMarker.style.left = taking;
        } else {
            this.getReference('completedTrack').style.width = '100%';
        }
    }

    protected createElement(): HTMLElement {
        const inlineStyle = {
            '--progress-bar-color': this.data.color
        } as React.CSSProperties;

        return (
            <div className="education card is-theme-secondary elevation-1" style={inlineStyle}>
                <div className="content padding-2">
                    <div className="body">
                        <div className="header flex row sm-wrap md-nowrap xs-x-center">
                            <a className="icon xs-auto" href={this.data.link} target="_blank">
                                <img src={`./images/Education/${this.data.image}`} />
                            </a>
                            <div className="about xs-full">
                                <div className="institution flex row xs-x-center xs-y-center md-x-begin">
                                    <a className="name xs-full md-auto is-center-aligned is-bold-weight is-size-6 is-colored-link" href={this.data.link} target="_blank">{this.data.name}</a>
                                    <p className="location md-x-self-end is-italic is-size-8 is-color-light">{this.data.location}</p>
                                </div>
                                <div className="degree flex row xs-x-center xs-y-center md-x-begin">
                                    <p className="name xs-full md-auto is-center-aligned is-bold-weight is-size-7 is-color-light">{this.data.degree}</p>
                                    {this.isComplete()
                                        ? <p className="date md-x-self-end is-italic is-bold-weight is-size-8 is-color-light">
                                            Graduated {this.data.end}
                                        </p>
                                        : <p className="date md-x-self-end is-italic is-size-8 is-color-light">
                                            ({this.data.start} &mdash; {this.data.end})
                                        </p>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className={`progress flex row xs-nowrap xs-y-center progress-bar-hover-container${!this.isComplete() ? ' incomplete' : ''}`}>
                            <div className="progress-bar">
                                <div className="completed marker" style={{ opacity: 0 }} ref="completedMarker">
                                    <p className="is-size-8">{this.data.credits.completed}</p>
                                </div>
                                <div className="taking marker" style={{ opacity: 0 }} ref="takingMarker">
                                    <p className="is-size-8">{this.data.credits.completed + this.data.credits.taking}</p>
                                </div>
                                <div className="track"></div>
                                <div className="buffer" ref="takingTrack"></div>
                                <div className="fill" ref="completedTrack"></div>
                            </div>
                            <p className="credits is-size-8 xs-auto">{this.data.credits.total} credits</p>
                        </div>
                        <div className="info content padding-x-4 padding-y-2">
                            <p className="is-light-color is-size-8 is-italic">
                                <span className="is-bold-weight">GPA:</span>&nbsp;{this.data.gpa}
                            </p>
                            {this.data.notes.map(note => {
                                return <p className="is-light-color is-size-8 is-italic">{note}</p>
                            })}
                            {!this.data.courses ? null : <div>
                                <hr />
                                <div className="courses">
                                    <p className="is-bold-weight is-size-6">Recent Coursework</p>
                                    <ul className="flex row is-size-7">
                                        {this.data.courses.map(course => {
                                            return <li className="xs-12 md-6">{course}</li>
                                        })}
                                    </ul>
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}