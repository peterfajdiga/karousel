class MockQt {
    public readonly __brand = "Qt";

    private shortcuts = new Map<string, MockShortcutHandler>();

    public point(x: number, y: number) {
        return new MockQmlPoint(x, y);
    }

    public rect(x: number, y: number, width: number, height: number) {
        return new MockQmlRect(x, y, width, height);
    }

    public createQmlObject(qml: string, parent: QmlObject): QmlObject {
        if (qml.includes("Timer")) {
            return new MockQmlTimer();
        } else if (qml.includes("ShortcutHandler")) {
            const shortcutName = MockQt.extractShortcutName(qml);
            const shortcutHandler = new MockShortcutHandler();
            this.shortcuts.set(shortcutName, shortcutHandler);
            return shortcutHandler;
        } else {
            throw new Error("Unexpected qml string: " + qml);
        }
    }

    public fireShortcut(shortcutName: string) {
        const shortcutHandler = this.shortcuts.get(shortcutName);
        if (shortcutHandler === undefined) {
            Assert.truth(false);
            return;
        }
        shortcutHandler.activated.fire();
    }

    private static extractShortcutName(qml: string) {
        const nameLine = qml.split("\n").find((line) => line.trimStart().startsWith("name:"));
        if (nameLine === undefined) {
            Assert.truth(false);
            return "";
        }
        return nameLine.substring(
            nameLine.indexOf('"') + 1,
            nameLine.lastIndexOf('"'),
        );
    }
}
