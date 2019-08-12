// Class for a single social media icon in the Connect section

import { ElementFactory } from '../../Definitions/JSX'
import { DataComponent } from '../Component'

export interface SocialData {
    name: string,
    faClass: string,
    link: string
}

export class Social extends DataComponent<SocialData> {
    protected update(): void { }

    protected createElement(): HTMLElement {
        return (
            <div className="social">
                <a className="btn is-svg is-primary" href={this.data.link} target="_blank">
                    <i className={this.data.faClass}></i>
                </a>
            </div>
        );
    }
}