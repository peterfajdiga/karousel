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
    return Qt.createQmlObject(
        `import QtQuick 2.15
        Timer {}`,
        qmlBase
    );
}
