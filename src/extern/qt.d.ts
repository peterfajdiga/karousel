declare const console: {
    log(...args: any[]);
    assert(boolean);
};

declare const Qt: {
    rect(x: number, y: number, width: number, height: number): QRect;
    createQmlObject(qml: string, parent: QmlObject);
};

type QmlObject = any;

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
}

type QSize = {
    width: number;
    height: number;
}

type QSignal = {
    connect(handler: (...args: any[]) => void): void;
    disconnect(handler: (...args: any[]) => void): void;
}

type QQmlTimer = {
    interval: number;
    triggered: QSignal;
    restart(): void;
    destroy(): void;
}
