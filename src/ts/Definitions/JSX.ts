// Custom element factory for rendering JSX to DOM

// Very simple and not meant to be used as a complete framework
// but it serves the purposes of rendering small, non-dynamic components on the site

export namespace ElementFactory {
    const Fragment = '<></>';

    export function createElement(
        tagName: string, 
        attributes: { [name: string]: any } | null | JSX.IntrinsicAttributes, 
        ...children: any[]): Element | DocumentFragment {

        if(tagName === Fragment) {
            return document.createDocumentFragment();
        }

        const element = document.createElement(tagName);
        if(attributes) {
            for(const [key, value] of Object.entries(attributes)) {
                if(key === 'className') {
                    element.setAttribute('class', value);
                }
                else if(key === 'style') {
                    if(typeof value === 'object') {
                        element.setAttribute('style', JStoCSS(value));
                    }
                    else {
                        element.setAttribute('style', value);
                    }
                }
                else if(key.startsWith('on') && typeof value === 'function') {
                    element.addEventListener(key.substring(2).toLowerCase(), value);
                }
                else {
                    if(typeof value === 'boolean' && value) {
                        element.setAttribute(key, '');
                    }
                    else {
                        element.setAttribute(key, value);
                    }
                }
            }
        }

        for(const child of children) {
            appendChild(element, child);
        }

        return element;
    }

    export function appendChild(parent: Node, child: any) {
        if(typeof child === 'undefined' || child === null) {
            return;
        }

        if(Array.isArray(child)) {
            for(const value of child) {
                appendChild(parent, value);
            }
        }
        else if(typeof child === 'string') {
            parent.appendChild(document.createTextNode(child));
        }
        else if(child instanceof Node) {
            parent.appendChild(child);
        }
        else if(typeof child === 'boolean') {

        }
        else {
            parent.appendChild(document.createTextNode(String(child)));
        }
    }

    function JStoCSS(cssObject: CSSStyleDeclaration): string {
        let cssString: string = "";
        let rules = Object.keys(cssObject);
        for(let i = 0; i < rules.length; i++, cssString += ' ') {
            let rule = rules[i];
            cssString += `${rule.replace(/([A-Z])/g, upper => `-${upper[0].toLowerCase()}`)}: ${cssObject[rule as any]};`;
        }
        return cssString;
    }
}