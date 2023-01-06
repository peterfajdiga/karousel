function catchWrap(f) {
    return () => {
        try {
            f();
        } catch (error) {
            print(error);
        }
    }
}

function registerShortcutDbg(title, text, keySequence, callback) {
    registerShortcut(title, text, keySequence, catchWrap(callback))
}

function registerShortcuts() {
    registerShortcutDbg("basalt-window-move-left", "Basalt: Move window left", "Meta+Shift+A", moveLeft);
    registerShortcutDbg("basalt-window-toggle-floating", "Basalt: Toggle floating", "Meta+Space", toggleFloating);
}
