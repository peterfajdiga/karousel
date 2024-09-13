namespace Mocks {
    export class Qt {
        public point(x: number, y: number) {
            return new Mocks.QmlPoint(x, y);
        }

        public rect(x: number, y: number, width: number, height: number) {
            return new Mocks.QmlRect(x, y, width, height);
        }

        public createQmlObject(qml: string, parent: QmlObject) {
            if (qml.includes("Timer")) {
                return new QmlTimer();
            } else if (qml.includes("ShortcutHandler")) {
                return new ShortcutHandler();
            } else {
                assert(false, "Unexpected qml string: " + qml);
            }
        }
    }
}
