// Types definition file

interface AnonymousObject {
    [key: string]: any
}

interface ObjectBuilder {
    [key: string]: () => any
}

declare class NewEvent {
    public readonly name: string;
    public readonly detail: AnonymousObject;
}