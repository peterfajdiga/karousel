type Console = {
    __brand: "Console";

    log(...args: any[]): void;
    assert(assertion: boolean, message?: string): void;
};

type Qt = {
    __brand: "Qt";

    rect(x: number, y: number, width: number, height: number): QmlRect;
    createQmlObject(qml: string, parent: QmlObject): QmlObject;
};

type QmlObject = { __brand: "QmlObject" };

type QmlPoint = {
    __brand: "QmlPoint";

    x: number;
    y: number;
};

type QmlRect = {
    __brand: "QmlRect";

    x: number;
    y: number;
    width: number;
    height: number;
    readonly top: number;
    readonly bottom: number; // top + height
    readonly left: number;
    readonly right: number; // left + width
};

type QmlSize = {
    __brand: "QmlSize";

    width: number;
    height: number;
};

type QSignal<T extends unknown[]> = {
    __brand: "QSignal";

    connect(handler: (...args: [...T]) => void): void;
    disconnect(handler: (...args: [...T]) => void): void;
};

type QmlTimer = QmlObject & {
    interval: number;
    readonly triggered: QSignal<[]>;
    restart(): void;
    destroy(): void;
};
