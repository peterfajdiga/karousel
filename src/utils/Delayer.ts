class Delayer {
    private readonly timer: QQmlTimer;

    constructor(delay: number, f: () => void) {
        this.timer = initQmlTimer();
        this.timer.interval = delay;
        this.timer.triggered.connect(f);
    }

    run() {
        this.timer.restart();
    }

    destroy() {
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
