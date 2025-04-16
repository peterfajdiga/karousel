interface Console {
    __brand: "Console";

    log(...args: any[]): void;
    assert(assertion: boolean, message?: string): void;
}

interface Qt {
    __brand: "Qt";

    rect(x: number, y: number, width: number, height: number): QmlRect;
    createQmlObject(qml: string, parent: QmlObject): QmlObject;
}

interface QmlObject { __brand: "QmlObject" }

interface QmlPoint {
    __brand: "QmlPoint";

    x: number;
    y: number;
}

interface QmlRect {
    __brand: "QmlRect";

    x: number;
    y: number;
    width: number;
    height: number;
    readonly top: number;
    readonly bottom: number; // top + height
    readonly left: number;
    readonly right: number; // left + width
}

interface QmlSize {
    __brand: "QmlSize";

    width: number;
    height: number;
}

interface QSignal<T extends unknown[]> {
    __brand: "QSignal";

    connect(handler: (...args: [...T]) => void): void;
    disconnect(handler: (...args: [...T]) => void): void;
}

interface QmlTimer extends QmlObject {
    interval: number;
    readonly triggered: QSignal<[]>;
    restart(): void;
    destroy(): void;
}
