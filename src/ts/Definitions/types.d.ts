import { Key } from "react";

// Types definition file

declare global {
    interface AnonymousObject {
        [key: string]: any
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