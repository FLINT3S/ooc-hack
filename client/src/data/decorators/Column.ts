import 'reflect-metadata'

type ColumnOptions = {
    type?: any,
    excludeFromJSON?: boolean,
    jsonKey?: string
}

export const Column = (options: ColumnOptions = {}): PropertyDecorator => {
    return (target: Object, property: string | symbol) => {
        const classConstructor = target.constructor;
        const metadata = Reflect.getMetadata("columns", classConstructor) || {};
        metadata[property] = options;
        Reflect.defineMetadata("columns", metadata, classConstructor);
    }
}
