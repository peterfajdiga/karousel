class MockQt {
    public point(x: number, y: number) {
        return new MockQmlPoint(x, y);
    }

    public rect(x: number, y: number, width: number, height: number) {
        return new MockQmlRect(x, y, width, height);
    }

    public createQmlObject(qml: string, parent: QmlObject) {
        if (qml.includes("Timer")) {
            return new MockQmlTimer();
        } else if (qml.includes("ShortcutHandler")) {
            return new MockShortcutHandler();
        } else {
            assert(false, "Unexpected qml string: " + qml);
        }
    }
}
