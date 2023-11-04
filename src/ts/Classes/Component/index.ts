// Classes for JSX-rendered components

namespace Components {

    namespace Helpers {
        export function runIfDefined(_this: any, method: string, data?: any): void {
            if (_this[method] && _this[method] instanceof Function) {
                _this[method](data);
            }
        }

        export function attachInterface(_this: Component, name: keyof typeof Interface) {
            Reflect.defineProperty(_this, name, {
                value: Interface[name],
                configurable: false,
                writable: false
            });
        }
    }

    namespace Interface {
        export function appendTo(parent: Element): void {
            parent.appendChild(this.element);

            // Use setTimeout to wait for element to appended
            setTimeout(() => {
                if (!this._mounted) {
                    Events.dispatch(this, 'mounted', { parent });
                    this._mounted = true;
                }
            }, 0);
        }
    }

    namespace Events {
        type BeforeCreateEventData = never;
        type CreatedEventData = never;
        interface MountedEventData {
            parent: Element
        }

        export function dispatch(_this: Component, event: 'beforeCreate', data?: BeforeCreateEventData): void;
        export function dispatch(_this: Component, event: 'created', data?: CreatedEventData): void;
        export function dispatch(_this: Component, event: 'mounted', data?: MountedEventData): void;

        export function dispatch<T extends string, D extends object>(_this: Component, event: T, data?: D): void {
            Helpers.runIfDefined(_this, event, data);
        }
    }

    abstract class __Base<E> {
        protected element: E = null;

        protected abstract getReference(ref: string): E;

        protected abstract createElement(): E;
        protected abstract update(): void;
    }

    abstract class Component extends __Base<HTMLElement> {
        protected element: HTMLElement = null;

        private _mounted: boolean = false;

        constructor() {
            super();
            this._setupInterface();
        }

        private _setupInterface() {
            Helpers.attachInterface(this, 'appendTo');
        }

        public appendTo(parent: Element) { }

        protected getReference(ref: string): HTMLElement {
            return this.element.querySelector(`[ref="${ref}"]`) || null;
        }
    }

    namespace Initialize {
        function __Initialize(): void {
            Events.dispatch(this, 'beforeCreate');
            this.element = this.createElement();
            Events.dispatch(this, 'created');
        }

        export function Main<C extends __Base<any>>(_this: C): void {
            (__Initialize.bind(_this))();
        }
    }

    export abstract class HTMLComponent extends Component {
        constructor() {
            super();
            Initialize.Main(this);
        }
    }

    export abstract class DataComponent<T extends {}> extends Component {
        protected data: T;

        constructor(data: T) {
            super();
            this.data = data;
            Initialize.Main(this);
        }
    }
}

export = Components;