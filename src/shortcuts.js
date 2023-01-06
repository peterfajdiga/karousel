function catchWrap(f) {
    return () => {
        try {
            f();
        } catch (error) {
            print(error);
        }
    }
}

function registerShortcuts() {
    registerShortcut("basalt-window-move-left", "Basalt: Move window left", "Meta+Shift+A", moveLeft);
    registerShortcut("basalt-window-toggle-floating", "Basalt: Toggle floating", "Meta+Space", catchWrap(toggleFloating));
}
