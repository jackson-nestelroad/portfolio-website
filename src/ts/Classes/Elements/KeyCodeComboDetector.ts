import { Events } from "../../Modules/EventDispatcher";

export class KeyCodeComboDetector extends Events.EventDispatcher {
    private static readonly KonamiCombo = [
        'ArrowUp',
        'ArrowUp',
        'ArrowDown',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'ArrowLeft',
        'ArrowRight',
        'b',
        'a',
        'Enter',
    ];

    private nextComboIndex: number = 0;

    constructor() {
        super();
        this.register('konamicode');
        this.initializeEventListeners();
    }

    private initializeEventListeners() {
        document.addEventListener('keydown', event => {
            if (event.key === KeyCodeComboDetector.KonamiCombo[this.nextComboIndex]) {
                ++this.nextComboIndex;
                if (this.nextComboIndex >= KeyCodeComboDetector.KonamiCombo.length) {
                    this.nextComboIndex = 0;
                    this.dispatch('konamicode');
                }
            } else {
                this.nextComboIndex = 0;
            }
        });
    }
}