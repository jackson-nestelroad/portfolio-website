// Class for a single quality in the About section

import { ElementFactory } from '../../Definitions/JSX'

// Format for data
export interface QualityData {
    faClass: string,
    name: string,
    description: string
}

export class Quality {
    public readonly data: QualityData;

    constructor(data: QualityData) {
        this.data = data;
    }

    public createElement(): HTMLElement {
        return (
            <div className="grid-col sm12 md4 sm-block">
                <i className={`icon ${this.data.faClass}`}></i>
                <p className="quality is-size-2 is-bold is-uppercase">{this.data.name}</p>
                <p className="desc is-light-weight is-size-3">{this.data.description}</p>
            </div>
        );
    }
}