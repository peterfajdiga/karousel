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

    registerShortcutDbg("karousel-window-toggle-floating", "Karousel: Toggle floating", "Meta+Space", actions.windowToggleFloating);

    registerShortcutDbg("karousel-focus-left", "Karousel: Move focus left", "Meta+A", actions.focusLeft);
    registerShortcutDbg("karousel-focus-right", "Karousel: Move focus right", "Meta+D", actions.focusRight);
    registerShortcutDbg("karousel-focus-up", "Karousel: Move focus up", "Meta+W", actions.focusUp);
    registerShortcutDbg("karousel-focus-down", "Karousel: Move focus down", "Meta+S", actions.focusDown);
    registerShortcutDbg("karousel-focus-start", "Karousel: Move focus to start", "Meta+Home", actions.focusStart);
    registerShortcutDbg("karousel-focus-end", "Karousel: Move focus to end", "Meta+End", actions.focusEnd);

    registerShortcutDbg("karousel-window-move-left", "Karousel: Move window left", "Meta+Shift+A", actions.windowMoveLeft);
    registerShortcutDbg("karousel-window-move-right", "Karousel: Move window right", "Meta+Shift+D", actions.windowMoveRight);
    registerShortcutDbg("karousel-window-move-up", "Karousel: Move window up", "Meta+Shift+W", actions.windowMoveUp);
    registerShortcutDbg("karousel-window-move-down", "Karousel: Move window down", "Meta+Shift+S", actions.windowMoveDown);
    registerShortcutDbg("karousel-window-move-start", "Karousel: Move window to start", "Meta+Shift+Home", actions.windowMoveStart);
    registerShortcutDbg("karousel-window-move-end", "Karousel: Move window to end", "Meta+Shift+End", actions.windowMoveEnd);
    registerShortcutDbg("karousel-window-expand", "Karousel: Expand window", "Meta+X", actions.windowExpand);

    registerShortcutDbg("karousel-column-move-left", "Karousel: Move column left", "Meta+Ctrl+Shift+A", actions.columnMoveLeft);
    registerShortcutDbg("karousel-column-move-right", "Karousel: Move column right", "Meta+Ctrl+Shift+D", actions.columnMoveRight);
    registerShortcutDbg("karousel-column-move-start", "Karousel: Move column to start", "Meta+Ctrl+Shift+Home", actions.columnMoveStart);
    registerShortcutDbg("karousel-column-move-end", "Karousel: Move column to end", "Meta+Ctrl+Shift+End", actions.columnMoveEnd);
    registerShortcutDbg("karousel-column-expand", "Karousel: Expand column", "Meta+Ctrl+X", actions.columnExpand);

    registerShortcutDbg("karousel-grid-scroll-focused", "Karousel: Scroll to focused window", "Meta+Alt+Return", actions.gridScrollFocused);
    registerShortcutDbg("karousel-grid-scroll-left-column", "Karousel: Scroll one column to the left", "Meta+Alt+A", actions.gridScrollLeftColumn);
    registerShortcutDbg("karousel-grid-scroll-left-column", "Karousel: Scroll one column to the left", "Meta+Alt+A", actions.gridScrollLeftColumn);
    registerShortcutDbg("karousel-grid-scroll-right-column", "Karousel: Scroll one column to the right", "Meta+Alt+D", actions.gridScrollRightColumn);
    registerShortcutDbg("karousel-grid-scroll-left", "Karousel: Scroll left", "Meta+Alt+PgUp", actions.gridScrollLeft);
    registerShortcutDbg("karousel-grid-scroll-right", "Karousel: Scroll right", "Meta+Alt+PgDown", actions.gridScrollRight);
    registerShortcutDbg("karousel-grid-scroll-start", "Karousel: Scroll to start", "Meta+Alt+Home", actions.gridScrollStart);
    registerShortcutDbg("karousel-grid-scroll-end", "Karousel: Scroll to end", "Meta+Alt+End", actions.gridScrollEnd);

    registerNumShortcuts("karousel-focus-", "Karousel: Move focus to column ", "Meta+", actions.focusColumn, 9);
    registerNumShortcuts("karousel-window-move-to-column-", "Karousel: Move window to column ", "Meta+Shift+", actions.windowMoveToColumn, 9);
    registerNumShortcuts("karousel-column-move-to-column-", "Karousel: Move column to position ", "Meta+Ctrl+Shift+", actions.columnMoveToColumn, 9);
    registerNumShortcuts("karousel-column-move-to-desktop-", "Karousel: Move column to desktop ", "Meta+Ctrl+Shift+F", actions.columnMoveToDesktop, 12);
    registerNumShortcuts("karousel-tail-move-to-desktop-", "Karousel: Move this and all following columns to desktop ", "Meta+Ctrl+Shift+Alt+F", actions.tailMoveToDesktop, 12);
}
