// Functions for interacting with the DOM

export module DOM {
    // Get array of elements by query
    export function getElements(query: string): NodeListOf<HTMLElement> {
        return document.querySelectorAll(query);
    }

    // Get first element only by query
    export function getFirstElement(query: string): HTMLElement {
        return this.getElements(query)[0];
    }

    // Get height and width of viewport
    export function getViewport(): { height: number, width: number } {
        return {
            height: Math.max(window.innerHeight, document.documentElement.clientHeight),
            width: Math.max(window.innerWidth, document.documentElement.clientWidth)
        }
    }

    export function scrollTo(element: Element): void {

    }

    export function isIE(): boolean {
        return window.navigator.userAgent.match(/(MSIE|Trident)/) !== null;
    }

    export function load(): Promise<Document> {
        return new Promise((resolve, reject) => {
            if(document.readyState === 'complete') {
                resolve(document);
            }
            else {
                const callback = () => {
                    document.removeEventListener('DOMContentLoaded', callback);
                    resolve(document);
                }
                document.addEventListener('DOMContentLoaded', callback);
            }
        });
    }

    function boundingClientRectToObject(rect: (ClientRect & { x?: number, y?: number }) | DOMRect): object {
        return {
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            x: rect.x ? rect.x : 0,
            y: rect.y ? rect.y : 0
        };
    }

    export function onPage(element: Element): boolean {
        const rect = element.getBoundingClientRect();
        return !Object.values(boundingClientRectToObject(rect)).every(val => val === 0);
    }

    export function inView(element: Element, offset: number = 0): boolean {
        const rect = element.getBoundingClientRect();

        if(Object.values(boundingClientRectToObject(rect)).every(val => val === 0)) {
            return false;
        }

        const viewHeight = getViewport().height;

        if(offset <= 1) {
            offset = viewHeight * offset;
        }

        return (rect.bottom + offset) >= 0 && (rect.top + offset - viewHeight) < 0;
        
    }

    interface FirstAppearanceSettings {
        timeout?: number,
        offset?: number
    }
    export function onFirstAppearance(element: Element, callback: Function, setting?: FirstAppearanceSettings): void {
        const timeout = setting ? setting.timeout : 0;
        const offset = setting ? setting.offset : 0;

        if(inView(element, offset)) {
            setTimeout(callback, timeout);
        }
        else {
            const eventCallback = (event: Event) => {
                if(inView(element, offset)) {
                    setTimeout(callback, timeout);
                    document.removeEventListener('scroll', eventCallback, {
                        capture: true
                    });
                }
            }
            document.addEventListener('scroll', eventCallback, {
                capture: true,
                passive: true
            });
        }
    }
}