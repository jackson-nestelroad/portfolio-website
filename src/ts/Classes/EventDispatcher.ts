// Class for dispatching events to subscribed HTML elements

type CustomEventDetail = { [key: string]: any };
export type EventCallback = (event: UIEvent) => void;

export class EventDispatcher {
    
    public readonly name: string;
    private readonly event: CustomEvent;
    private listeners: Map<HTMLElement, (event: UIEvent) => void> = new Map();

    constructor(eventName: string, detail?: CustomEventDetail, cancelable: boolean = true, bubbles: boolean = true) {
        this.name = eventName;
        this.event = new CustomEvent(eventName, {
            detail: detail,
            bubbles: bubbles,
            cancelable: cancelable
        });
    }

    public subscribe(element: HTMLElement, callback: EventCallback): void {
        element.removeEventListener(this.name, this.listeners.get(element));
        this.listeners.set(element, callback);
        element.addEventListener(this.name, callback);
    }

    public unsubscribe(element: HTMLElement): void {
        element.removeEventListener(this.name, this.listeners.get(element));
        this.listeners.delete(element);
    }

    public disperse(): void {
        let it: IterableIterator<HTMLElement> = this.listeners.keys();
        let element: HTMLElement;
        while(element = it.next().value) {
            element.dispatchEvent(this.event);
        }
    }
}