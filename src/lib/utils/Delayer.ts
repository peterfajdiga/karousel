class Delayer {
    private readonly timer: QmlTimer;

    constructor(delay: number, f: () => void) {
        this.timer = initQmlTimer();
        this.timer.interval = delay;
        this.timer.triggered.connect(f);
    }

    public run() {
        this.timer.restart();
    }

    public destroy() {
        this.timer.destroy();
    }
}

function initQmlTimer() {
    return <QmlTimer>Qt.createQmlObject(
        `import QtQuick 6.0
        Timer {}`,
        qmlBase
    );
}
