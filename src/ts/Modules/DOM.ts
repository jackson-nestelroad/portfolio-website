// Functions for interacting with the DOM

export module DOM {
    // Gets an array of elements by query
    export function getElements(query: string): NodeListOf<HTMLElement> {
        return document.querySelectorAll(query);
    }

    // Gets the first element only by query
    export function getFirstElement(query: string): HTMLElement {
        return this.getElements(query)[0];
    }

    // Gets the height and width of the viewport
    export function getViewport(): { height: number, width: number } {
        return {
            height: Math.max(window.innerHeight, document.documentElement.clientHeight),
            width: Math.max(window.innerWidth, document.documentElement.clientWidth)
        }
    }

    // Gets the point in the center of the viewport
    export function getCenterOfViewport(): { x: number, y: number } {
        const { height, width } = getViewport();
        return { 
            x: width / 2,
            y: height / 2
        }
    }

    // Checks if the browser is Internet Explorer
    export function isIE(): boolean {
        return window.navigator.userAgent.match(/(MSIE|Trident)/) !== null;
    }

    // Waits for the page to load before resolving
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

    // Needed for a few validations
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

    // Checks if an element is on the page
    export function onPage(element: Element): boolean {
        const rect = element.getBoundingClientRect();
        return !Object.values(boundingClientRectToObject(rect)).every(val => val === 0);
    }

    // Creates the DOM name (local CSS selector) for an element
    export function getDOMName(element: Element): string {
        let str = element.tagName.toLowerCase();
        if (element.id) {
            str += '#' + element.id;
        }
        if (element.className) {
            str += '.' + element.className.replace(/ /g, '.');
        }
        return str;
    }

    // Returns the DOM path to an element
    export function getDOMPath(element: Element): Element[] {
        if (!element) {
            return [];
        }
        
        const path: Element[] = [element];
        while (element = element.parentElement) {
            if (element.tagName.toLowerCase() === 'html') {
                break;
            }
            path.unshift(element);
        }
        return path;
    }

    // Returns the DOM path to an element as an array of element names
    export function getDOMPathNames(element: Element): string[] {
        const path = getDOMPath(element);
        if (path.length === 0) {
            return [];
        }

        return path.map(element => getDOMName(element));
    }

    // Returns the CSS selector for an element
    export function getCSSSelector(element: Element, condense: boolean = true): string {
        const names = getDOMPathNames(element);
        if (!condense || names.length <= 6) {
            return names.join(' > ');
        }

        const length = names.length;
        let begin = names.slice(0, 3);
        let end = names.slice(length - 3, length);
        return `${begin.join(' > ')} > ... > ${end.join(' > ')}`;
    }

    // Returns the total offsetTop/offsetLeft pair for a child in a container up the DOM tree
    export function getChildOffsetPosForContainer(container: Element, child: HTMLElement, caller: string = ''): { offsetTop: number, offsetLeft: number } {
        let offsetTop: number = 0;
        let offsetLeft: number = 0;

        // Iterate upwards to make sure container is valid and get proper scroll position
        let curr: HTMLElement = child;
        while (curr && curr !== container) {
            offsetTop += curr.offsetTop;
            offsetLeft += curr.offsetLeft;
            curr = (curr.offsetParent) as HTMLElement;
        }
        if (!curr) {
            throw new Error(`${caller ? `${caller} => ` : ''}"${getCSSSelector(child)}" does not contain "${getCSSSelector(container)}" as an offset parent. Check that the container has "position: relative" set or that it is in the DOM path.`);
        }

        return { offsetTop, offsetLeft };
    }

    interface ContainerViewSettings {
        xOffset?: number,
        yOffset?: number,
        ignoreX?: boolean,
        ignoreY?: boolean,
        whole?: boolean,
        container?: Element,
    }

    type ScrollSettings = ContainerViewSettings & {
        smooth?: boolean,
    }

    // Generates line pairs in one direction (horizontal or vertical) for two rectangles
    function lines(top1: number, size1: number, top2: number, size2: number, offset: number): [number, number, number, number] {
        return [
            top1 - offset,
            top1 - offset + size1,
            top2,
            top2 + size2,
        ];
    }

    // Resolves offset settings by converting decimals to percentages of the width/height
    function xyOffset(xOffset: number, yOffset: number, width: number, height: number): { xOffset: number, yOffset: number } {
        if (xOffset && xOffset <= 1) {
            xOffset = width * xOffset;
        }
        else {
            xOffset = 0;
        }

        if (yOffset && yOffset <= 1) {
            yOffset = height * yOffset;
        }
        else {
            yOffset = 0;
        }

        return { xOffset, yOffset };
    }

    // Checks if the child element is in view for its offset container
    // Offset container is retrieved automatically via child.offsetParent unless
    // a container is passed to the settings object
    export function inOffsetView(child: HTMLElement, settings: ContainerViewSettings = { }): boolean {
        let container: Element;
        let offsetTop: number;
        let offsetLeft: number;

        // No container given, use immediate parent
        if (!settings.container) {
            container = child.offsetParent;
            if (!container) {
                throw new Error('inOffsetView(child, ...) => child.offsetParent cannot be null. Check that it is in a container with "position: relative" set.');
            }
            offsetTop = child.offsetTop;
            offsetLeft = child.offsetLeft;
        }
        // Container is given
        else {
            const result = getChildOffsetPosForContainer(settings.container, child, 'inOffsetView(child, ...)');
            offsetTop = result.offsetTop;
            offsetLeft = result.offsetLeft;
        }

        const childRect = child.getBoundingClientRect();

        if (Object.values(boundingClientRectToObject(childRect)).every(val => val === 0)) {
            return false;
        }

        const containerRect = container.getBoundingClientRect();

        const { xOffset, yOffset } = xyOffset(settings.xOffset, settings.yOffset, containerRect.width, containerRect.height);

        let x = true;
        let y = true;

        if (!settings.ignoreY) {
            const [containerTopLine, containerBottomLine, childTopLine, childBottomLine]
                = lines(container.scrollTop, containerRect.height, offsetTop, childRect.height, yOffset);

            y = settings.whole ? 
                childBottomLine < containerBottomLine
                && childTopLine > containerTopLine
                : childBottomLine > containerTopLine 
                && childTopLine < containerBottomLine;
        }

        if (!settings.ignoreX) {
            const [containerLeftLine, containerRightLine, childLeftLine, childRightLine]
                = lines(container.scrollLeft, containerRect.width, offsetLeft, childRect.width, xOffset);

            x = settings.whole ? 
                childRightLine < containerRightLine
                && childLeftLine > containerLeftLine
                : childRightLine > containerLeftLine
                && childLeftLine < containerRightLine;
        }

        return x && y;
    }

    // Scrolls the element to the given position
    function scrollTo(container: Element, left: number, top: number, settings: ScrollSettings = { }): void {
        if (isIE()) {
            container.scrollLeft = left;
            container.scrollTop = top;
        }
        else {
            container.scrollTo({
                left: left,
                top: top,
                behavior: settings.smooth ? 'smooth' : 'auto',
            });
        }
    }

    // Scrolls the container element until the child is completely visible in the container
    // The child element must be in the container and be smaller than the container
    export function scrollContainerToViewWholeChild(container: Element, child: HTMLElement, settings: ScrollSettings = { }): void {
        const result = getChildOffsetPosForContainer(container, child, 'scrollContainerToViewChildWhole(...)');
        const offsetTop = result.offsetTop;
        const offsetLeft = result.offsetLeft;

        const containerRect = container.getBoundingClientRect();
        const childRect = child.getBoundingClientRect();

        const { xOffset, yOffset } = xyOffset(settings.xOffset, settings.yOffset, containerRect.width, containerRect.height);

        const [containerTopLine, containerBottomLine, childTopLine, childBottomLine]
            = lines(container.scrollTop, containerRect.height, offsetTop, childRect.height, yOffset);

        const [containerLeftLine, containerRightLine, childLeftLine, childRightLine]
            = lines(container.scrollLeft, containerRect.width, offsetLeft, childRect.width, xOffset);

        let x = container.scrollLeft;
        let y = container.scrollTop;

        if (!settings.ignoreY) {
            const above = childTopLine < containerTopLine;
            const below = childBottomLine > containerBottomLine;
            if (above && !below) {
                y = childTopLine;
            }
            else if (!above && below) {
                y += childBottomLine - containerBottomLine;
            }
        }

        if (!settings.ignoreX) {
            const left = childLeftLine < containerLeftLine;
            const right = childRightLine > containerRightLine;
            if (left && !right) {
                x = childLeftLine;
            }
            else if (!left && right) {
                x += childRightLine - containerRightLine;
            }
        }

        scrollTo(container, x, y, settings);
    }

    // Checks if the element is in the vertical viewport
    export function inVerticalWindowView(element: Element, offset: number = 0): boolean {
        const rect = element.getBoundingClientRect();

        if (Object.values(boundingClientRectToObject(rect)).every(val => val === 0)) {
            return false;
        }

        const viewHeight = getViewport().height;

        if (offset <= 1) {
            offset = viewHeight * offset;
        }

        return (rect.bottom + offset) >= 0 && (rect.top + offset - viewHeight) < 0;
    }

    // Returns how many pixels from the top of the viewport the element is
    export function pixelsBelowScreenTop(element: Element): number {
        return element.getBoundingClientRect().top;
    }

    // Returns how many pixels from the bottom of the viewport the element is
    export function pixelsAboveScreenBottom(element: Element): number {
        const rect = element.getBoundingClientRect();
        const viewHeight = getViewport().height;
        return viewHeight - rect.bottom;
    }

    interface FirstAppearanceSettings {
        timeout?: number,
        offset?: number,
    }

    // Sets an event that calls the callback function when the element first comes into the main viewport
    export function onFirstAppearance(element: Element, callback: Function, setting?: FirstAppearanceSettings): void {
        const timeout = setting ? setting.timeout : 0;
        const offset = setting ? setting.offset : 0;

        if(inVerticalWindowView(element, offset)) {
            setTimeout(callback, timeout);
        }
        else {
            const eventCallback = (event: Event) => {
                if(inVerticalWindowView(element, offset)) {
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

    // Path to root of DOM (window)
    export function getPathToRoot(element: Element): Array<Element | Document | Window> {
        const path: Array<Element | Document | Window> = [];
        let curr = element;
        while (curr) {
            path.push(curr);
            curr = curr.parentElement;
        }
        
        if (path.indexOf(window) === -1 && path.indexOf(document) === -1) {
            path.push(document);
        }
        if (path.indexOf(window) === -1) {
            path.push(window);
        }
        
        return path;
    }
}