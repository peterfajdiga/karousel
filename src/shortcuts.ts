function catchWrap(f: () => void) {
    return () => {
        try {
            f();
        } catch (error: any) {
            console.log(error);
            console.log(error.stack);
        }
    };
}

function registerShortcutDbg(title: string, text: string, keySequence: string, callback: () => void) {
    KWin.registerShortcut(title, text, keySequence, catchWrap(callback));
}

function registerNumShortcuts(title: string, text: string, keySequence: string, callback: (i: number) => void, n: number) {
    for (let i = 0; i < n; i++) {
        const numKey = String(i + 1);
        registerShortcutDbg(title+numKey, text+numKey, keySequence+numKey, () => callback(i));
    }
}

function registerShortcuts(world: World) {
    const actions = initActions(world);

    registerShortcutDbg("basalt-window-toggle-floating", "Basalt: Toggle floating", "Meta+Space", actions.windowToggleFloating);

    registerShortcutDbg("basalt-focus-left", "Basalt: Move focus left", "Meta+A", actions.focusLeft);
    registerShortcutDbg("basalt-focus-right", "Basalt: Move focus right", "Meta+D", actions.focusRight);
    registerShortcutDbg("basalt-focus-up", "Basalt: Move focus up", "Meta+W", actions.focusUp);
    registerShortcutDbg("basalt-focus-down", "Basalt: Move focus down", "Meta+S", actions.focusDown);
    registerShortcutDbg("basalt-focus-start", "Basalt: Move focus to start", "Meta+Home", actions.focusStart);
    registerShortcutDbg("basalt-focus-end", "Basalt: Move focus to end", "Meta+End", actions.focusEnd);

    registerShortcutDbg("basalt-window-move-left", "Basalt: Move window left", "Meta+Shift+A", actions.windowMoveLeft);
    registerShortcutDbg("basalt-window-move-right", "Basalt: Move window right", "Meta+Shift+D", actions.windowMoveRight);
    registerShortcutDbg("basalt-window-move-up", "Basalt: Move window up", "Meta+Shift+W", actions.windowMoveUp);
    registerShortcutDbg("basalt-window-move-down", "Basalt: Move window down", "Meta+Shift+S", actions.windowMoveDown);
    registerShortcutDbg("basalt-window-move-start", "Basalt: Move window to start", "Meta+Shift+Home", actions.windowMoveStart);
    registerShortcutDbg("basalt-window-move-end", "Basalt: Move window to end", "Meta+Shift+End", actions.windowMoveEnd);
    registerShortcutDbg("basalt-window-expand", "Basalt: Expand window", "Meta+X", actions.windowExpand);

    registerShortcutDbg("basalt-column-move-left", "Basalt: Move column left", "Meta+Ctrl+Shift+A", actions.columnMoveLeft);
    registerShortcutDbg("basalt-column-move-right", "Basalt: Move column right", "Meta+Ctrl+Shift+D", actions.columnMoveRight);
    registerShortcutDbg("basalt-column-move-start", "Basalt: Move column to start", "Meta+Ctrl+Shift+Home", actions.columnMoveStart);
    registerShortcutDbg("basalt-column-move-end", "Basalt: Move column to end", "Meta+Ctrl+Shift+End", actions.columnMoveEnd);
    registerShortcutDbg("basalt-column-expand", "Basalt: Expand column", "Meta+Ctrl+X", actions.columnExpand);

    registerShortcutDbg("basalt-grid-scroll-focused", "Basalt: Scroll to focused window", "Meta+Alt+Return", actions.gridScrollFocused);
    registerShortcutDbg("basalt-grid-scroll-left-column", "Basalt: Scroll one column to the left", "Meta+Alt+A", actions.gridScrollLeftColumn);
    registerShortcutDbg("basalt-grid-scroll-left-column", "Basalt: Scroll one column to the left", "Meta+Alt+A", actions.gridScrollLeftColumn);
    registerShortcutDbg("basalt-grid-scroll-right-column", "Basalt: Scroll one column to the right", "Meta+Alt+D", actions.gridScrollRightColumn);
    registerShortcutDbg("basalt-grid-scroll-left", "Basalt: Scroll left", "Meta+Alt+PgUp", actions.gridScrollLeft);
    registerShortcutDbg("basalt-grid-scroll-right", "Basalt: Scroll right", "Meta+Alt+PgDown", actions.gridScrollRight);
    registerShortcutDbg("basalt-grid-scroll-start", "Basalt: Scroll to start", "Meta+Alt+Home", actions.gridScrollStart);
    registerShortcutDbg("basalt-grid-scroll-end", "Basalt: Scroll to end", "Meta+Alt+End", actions.gridScrollEnd);

    registerNumShortcuts("basalt-focus-", "Basalt: Move focus to column ", "Meta+", actions.focusColumn, 9);
    registerNumShortcuts("basalt-window-move-to-column-", "Basalt: Move window to column ", "Meta+Shift+", actions.windowMoveToColumn, 9);
    registerNumShortcuts("basalt-column-move-to-column-", "Basalt: Move column to position ", "Meta+Ctrl+Shift+", actions.columnMoveToColumn, 9);
    registerNumShortcuts("basalt-column-move-to-desktop-", "Basalt: Move column to desktop ", "Meta+Ctrl+Shift+F", actions.columnMoveToDesktop, 12);
}
