function catchWrap(f) {
    return () => {
        try {
            f();
        } catch (error) {
            print(error);
            print(error.stack);
        }
    }
}

function registerShortcutDbg(title, text, keySequence, callback) {
    registerShortcut(title, text, keySequence, catchWrap(callback))
}

function registerShortcuts() {
    registerShortcutDbg("basalt-window-move-left", "Basalt: Move window left", "Meta+Shift+A", windowMoveLeft);
    registerShortcutDbg("basalt-window-toggle-floating", "Basalt: Toggle floating", "Meta+Space", windowToggleFloating);
    registerShortcutDbg("basalt-column-move-left", "Basalt: Move column left", "Ctrl+Meta+Shift+A", columnMoveLeft);
    registerShortcutDbg("basalt-column-move-right", "Basalt: Move column right", "Ctrl+Meta+Shift+D", columnMoveRight);
}
