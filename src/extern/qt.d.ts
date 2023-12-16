declare const console: {
    log(...args: any[]);
    assert(boolean);
};

declare const Qt: {
    rect(x: number, y: number, width: number, height: number): QmlRect;
    createQmlObject(qml: string, parent: QmlObject);
};

type QmlObject = unknown;

type QByteArray = string;

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
    triggered: QSignal<[void]>;
    restart(): void;
    destroy(): void;
};
