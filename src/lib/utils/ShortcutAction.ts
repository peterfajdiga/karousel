class ShortcutAction {
    private readonly shortcutHandler: ShortcutHandler;

    constructor(keyBinding: ShortcutAction.KeyBinding, f: () => void) {
        this.shortcutHandler = ShortcutAction.initShortcutHandler(keyBinding);
        this.shortcutHandler.activated.connect(f);
    }

    public destroy() {
        this.shortcutHandler.destroy();
    }

    private static initShortcutHandler(keyBinding: ShortcutAction.KeyBinding) {
        return <ShortcutHandler>Qt.createQmlObject(
            `import QtQuick 6.0
import org.kde.kwin 3.0
ShortcutHandler {
    name: "karousel-${keyBinding.name}";
    text: "Karousel: ${keyBinding.description}";
    sequence: "${keyBinding.defaultKeySequence}";
}`,
            qmlBase,
        );
    }
}

namespace ShortcutAction {
    export type KeyBinding = {
        name: string;
        description: string;
        defaultKeySequence: string;
    };
}
