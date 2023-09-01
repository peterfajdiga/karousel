declare const console: {
    log(...args: any[]);
    assert(boolean);
};

declare const Qt: {
    rect(x: number, y: number, width: number, height: number): QRect;
    createQmlObject(qml: string, parent: QmlObject);
};

type QmlObject = unknown;

type QByteArray = string;

type QRect = {
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    bottom: number;
    left: number;
    right: number;
};

type QSize = {
    width: number;
    height: number;
};

type QSignal<T extends unknown[]> = {
    connect(handler: (...args: [...T]) => void): void;
    disconnect(handler: (...args: [...T]) => void): void;
};

type QQmlTimer = {
    interval: number;
    triggered: QSignal<[void]>;
    restart(): void;
    destroy(): void;
};
