declare const console: {
    log(...args: any[]);
    assert(boolean);
};

declare const Qt: {
    rect(x: number, y: number, width: number, height: number): QRect;
    createQmlObject(qml: string, parent: QmlObject);
};

type QmlObject = any;

type QRect = {
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    bottom: number;
    left: number;
    right: number;
}

type QSignal = {
    connect(handler: (...args: any[]) => void);
    disconnect(handler: (...args: any[]) => void);
}

type QQmlTimer = {
    interval: number;
    triggered: QSignal;
    restart(): void;
    destroy(): void;
}
