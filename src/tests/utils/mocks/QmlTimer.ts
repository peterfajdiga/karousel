namespace Mocks {
    export class QmlTimer {
        public interval: number = 0;
        public readonly triggered: QSignal<[]> = new QSignal();

        public restart() {
            // no need to wait in tests, just fire immediately
            this.triggered.fire();
        };

        public destroy() {}
    }
}
