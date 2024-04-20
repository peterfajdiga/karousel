type Console = {
    log(...args: any[]): void;
    trace(): void;
    assert(assertion: boolean, message?: string): void;
}

type Qt = {
    rect(x: number, y: number, width: number, height: number): QmlRect;
    createQmlObject(qml: string, parent: QmlObject): QmlObject;
}

type QmlObject = unknown;

type QmlPoint = {
    x: number;
    y: number;
}

type QmlRect = {
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    bottom: number; // top + height
    left: number;
    right: number; // left + width
};

type QmlSize = {
    width: number;
    height: number;
};

type QSignal<T extends unknown[]> = {
    connect(handler: (...args: [...T]) => void): void;
    disconnect(handler: (...args: [...T]) => void): void;
};

type QmlTimer = {
    interval: number;
    readonly triggered: QSignal<[]>;
    restart(): void;
    destroy(): void;
};
