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

function registerShortcut(title: string, text: string, keySequence: string, callback: () => void) {
    KWin.registerShortcut("karousel-"+title, "Karousel: "+text, keySequence, catchWrap(callback));
}

function registerNumShortcuts(title: string, text: string, keySequence: string, callback: (i: number) => void, n: number) {
    for (let i = 0; i < n; i++) {
        const numKey = String(i + 1);
        registerShortcut(title+numKey, text+numKey, keySequence+numKey, () => callback(i));
    }
}

function registerShortcuts(world: World) {
    const actions = initActions(world);

    registerShortcut("window-toggle-floating", "Toggle floating", "Meta+Space", actions.windowToggleFloating);

    registerShortcut("focus-left", "Move focus left", "Meta+A", actions.focusLeft);
    registerShortcut("focus-right", "Move focus right", "Meta+D", actions.focusRight);
    registerShortcut("focus-up", "Move focus up", "Meta+W", actions.focusUp);
    registerShortcut("focus-down", "Move focus down", "Meta+S", actions.focusDown);
    registerShortcut("focus-start", "Move focus to start", "Meta+Home", actions.focusStart);
    registerShortcut("focus-end", "Move focus to end", "Meta+End", actions.focusEnd);

    registerShortcut("window-move-left", "Move window left", "Meta+Shift+A", actions.windowMoveLeft);
    registerShortcut("window-move-right", "Move window right", "Meta+Shift+D", actions.windowMoveRight);
    registerShortcut("window-move-up", "Move window up", "Meta+Shift+W", actions.windowMoveUp);
    registerShortcut("window-move-down", "Move window down", "Meta+Shift+S", actions.windowMoveDown);
    registerShortcut("window-move-start", "Move window to start", "Meta+Shift+Home", actions.windowMoveStart);
    registerShortcut("window-move-end", "Move window to end", "Meta+Shift+End", actions.windowMoveEnd);
    registerShortcut("window-expand", "Expand window", "Meta+X", actions.windowExpand);

    registerShortcut("column-move-left", "Move column left", "Meta+Ctrl+Shift+A", actions.columnMoveLeft);
    registerShortcut("column-move-right", "Move column right", "Meta+Ctrl+Shift+D", actions.columnMoveRight);
    registerShortcut("column-move-start", "Move column to start", "Meta+Ctrl+Shift+Home", actions.columnMoveStart);
    registerShortcut("column-move-end", "Move column to end", "Meta+Ctrl+Shift+End", actions.columnMoveEnd);
    registerShortcut("column-expand", "Expand column", "Meta+Ctrl+X", actions.columnExpand);
    registerShortcut("column-expand-visible", "Expand visible columns", "Meta+Ctrl+Alt+X", actions.columnExpandVisible)

    registerShortcut("grid-scroll-focused", "Scroll to focused window", "Meta+Alt+Return", actions.gridScrollFocused);
    registerShortcut("grid-scroll-left-column", "Scroll one column to the left", "Meta+Alt+A", actions.gridScrollLeftColumn);
    registerShortcut("grid-scroll-left-column", "Scroll one column to the left", "Meta+Alt+A", actions.gridScrollLeftColumn);
    registerShortcut("grid-scroll-right-column", "Scroll one column to the right", "Meta+Alt+D", actions.gridScrollRightColumn);
    registerShortcut("grid-scroll-left", "Scroll left", "Meta+Alt+PgUp", actions.gridScrollLeft);
    registerShortcut("grid-scroll-right", "Scroll right", "Meta+Alt+PgDown", actions.gridScrollRight);
    registerShortcut("grid-scroll-start", "Scroll to start", "Meta+Alt+Home", actions.gridScrollStart);
    registerShortcut("grid-scroll-end", "Scroll to end", "Meta+Alt+End", actions.gridScrollEnd);

    registerNumShortcuts("focus-", "Move focus to column ", "Meta+", actions.focusColumn, 9);
    registerNumShortcuts("window-move-to-column-", "Move window to column ", "Meta+Shift+", actions.windowMoveToColumn, 9);
    registerNumShortcuts("column-move-to-column-", "Move column to position ", "Meta+Ctrl+Shift+", actions.columnMoveToColumn, 9);
    registerNumShortcuts("column-move-to-desktop-", "Move column to desktop ", "Meta+Ctrl+Shift+F", actions.columnMoveToDesktop, 12);
    registerNumShortcuts("tail-move-to-desktop-", "Move this and all following columns to desktop ", "Meta+Ctrl+Shift+Alt+F", actions.tailMoveToDesktop, 12);
}
