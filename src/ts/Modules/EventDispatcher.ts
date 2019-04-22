// Class to dispatch events to listening elements

export module Events {
    // Callback functions from an event must be able to receive an event object
    export type EventCallback = (event: NewEvent) => void;

    // Simple class to create a "Custom Event"
    // The CustomEvent object does not work in IE, so this is a simple alternative
    export class NewEvent {
        constructor(
            public readonly name: string,
            public readonly detail: AnonymousObject = null
        ) { }
    }

    // Class to extend to create an event dispatcher
    // HTML elements can subscribe to an event dispatcher to run a function based on the event
    export abstract class EventDispatcher {
        protected events: Set<string> = new Set();
        protected listeners: Map<HTMLElement, EventCallback> = new Map();

        protected constructor() { }

        // Register a new event
        protected register(name: string) {
            this.events.add(name);
        }

        // Unregister an event
        protected unregister(name: string) {
            this.events.delete(name);
        }

        // Subscribe to receive an event
        public subscribe(element: HTMLElement, callback: EventCallback): void {
            this.listeners.set(element, callback);
        }

        // Unsubscribe to stop receiving an event
        public unsubscribe(element: HTMLElement): void {
            this.listeners.delete(element);
        }

        // Dispatch an event to all listeners
        protected dispatch(name: string, detail: AnonymousObject = null): boolean {
            if(!this.events.has(name)) {
                return false;
            }

            const event = new NewEvent(name, detail);
            let it = this.listeners.values();
            let callback: EventCallback;
            while(callback = it.next().value) {
                callback(event);
            }
            return true;
        }
    }
}