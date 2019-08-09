import { Key } from "react";

// Types definition file

declare global {
    interface AnonymousObject {
        [key: string]: any
    }

    interface Dictionary<T> {
        [key: string]: T
    }
    
    interface ObjectBuilder {
        [key: string]: () => any
    }
    
    class NewEvent {
        public readonly name: string;
        public readonly detail: AnonymousObject;
    }

    namespace JSX {
        interface Element extends HTMLElement { }
    }
}

declare module 'react' {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        tabindex?: string;
    }
}