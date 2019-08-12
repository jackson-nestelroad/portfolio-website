// Class for the connect form

import { ElementFactory } from '../../Definitions/JSX'
import { DOM } from '../../Modules/DOM'
import { HTMLComponent } from '../Component'

export class Form extends HTMLComponent {
    protected update(): void { }

    protected createElement(): HTMLElement {
        return (
            <div></div>
        );
    }
}