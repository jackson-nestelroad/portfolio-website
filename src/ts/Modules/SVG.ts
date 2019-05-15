// Variables for using SVGs with JavaScript

export module SVG {
    export const svgns: string = 'http://www.w3.org/2000/svg';
    export const xlinkns: string = 'http://www.w3.org/1999/xlink';

    // Load an SVG from a URL/file
    export const loadSVG = (url: string): Promise<SVGSVGElement> => {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open('GET', `${url}.svg`, true);
            request.onload = () => {
                let parser = new DOMParser();
                let parsedDocument: Document = parser.parseFromString(request.responseText, 'image/svg+xml');
                resolve(parsedDocument.querySelector('svg'));
            }
            request.onerror = () => {
                reject("Failed to read SVG.");
            }
            request.send();
        });
    }
}