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

function registerKeyBinding(title: string, text: string, keySequence: string, callback: () => void) {
    KWin.registerShortcut("karousel-"+title, "Karousel: "+text, keySequence, catchWrap(callback));
}

function registerNumKeyBindings(title: string, text: string, keySequence: string, callback: (i: number) => void, n: number) {
    for (let i = 0; i < n; i++) {
        const numKey = String(i + 1);
        registerKeyBinding(title+numKey, text+numKey, keySequence+numKey, () => callback(i));
    }
}

function registerKeyBindings(world: World) {
    const actions = initActions(world);

    registerKeyBinding("window-toggle-floating", "Toggle floating", "Meta+Space", actions.windowToggleFloating);

    registerKeyBinding("focus-left", "Move focus left", "Meta+A", actions.focusLeft);
    registerKeyBinding("focus-right", "Move focus right", "Meta+D", actions.focusRight);
    registerKeyBinding("focus-up", "Move focus up", "Meta+W", actions.focusUp);
    registerKeyBinding("focus-down", "Move focus down", "Meta+S", actions.focusDown);
    registerKeyBinding("focus-start", "Move focus to start", "Meta+Home", actions.focusStart);
    registerKeyBinding("focus-end", "Move focus to end", "Meta+End", actions.focusEnd);

    registerKeyBinding("window-move-left", "Move window left", "Meta+Shift+A", actions.windowMoveLeft);
    registerKeyBinding("window-move-right", "Move window right", "Meta+Shift+D", actions.windowMoveRight);
    registerKeyBinding("window-move-up", "Move window up", "Meta+Shift+W", actions.windowMoveUp);
    registerKeyBinding("window-move-down", "Move window down", "Meta+Shift+S", actions.windowMoveDown);
    registerKeyBinding("window-move-start", "Move window to start", "Meta+Shift+Home", actions.windowMoveStart);
    registerKeyBinding("window-move-end", "Move window to end", "Meta+Shift+End", actions.windowMoveEnd);
    registerKeyBinding("window-expand", "Expand window", "Meta+X", actions.windowExpand);

    registerKeyBinding("column-move-left", "Move column left", "Meta+Ctrl+Shift+A", actions.columnMoveLeft);
    registerKeyBinding("column-move-right", "Move column right", "Meta+Ctrl+Shift+D", actions.columnMoveRight);
    registerKeyBinding("column-move-start", "Move column to start", "Meta+Ctrl+Shift+Home", actions.columnMoveStart);
    registerKeyBinding("column-move-end", "Move column to end", "Meta+Ctrl+Shift+End", actions.columnMoveEnd);
    registerKeyBinding("column-expand", "Expand column", "Meta+Ctrl+X", actions.columnExpand);
    registerKeyBinding("column-expand-visible", "Expand visible columns", "Meta+Ctrl+Alt+X", actions.columnExpandVisible)

    registerKeyBinding("grid-scroll-focused", "Scroll to focused window", "Meta+Alt+Return", actions.gridScrollFocused);
    registerKeyBinding("grid-scroll-left-column", "Scroll one column to the left", "Meta+Alt+A", actions.gridScrollLeftColumn);
    registerKeyBinding("grid-scroll-left-column", "Scroll one column to the left", "Meta+Alt+A", actions.gridScrollLeftColumn);
    registerKeyBinding("grid-scroll-right-column", "Scroll one column to the right", "Meta+Alt+D", actions.gridScrollRightColumn);
    registerKeyBinding("grid-scroll-left", "Scroll left", "Meta+Alt+PgUp", actions.gridScrollLeft);
    registerKeyBinding("grid-scroll-right", "Scroll right", "Meta+Alt+PgDown", actions.gridScrollRight);
    registerKeyBinding("grid-scroll-start", "Scroll to start", "Meta+Alt+Home", actions.gridScrollStart);
    registerKeyBinding("grid-scroll-end", "Scroll to end", "Meta+Alt+End", actions.gridScrollEnd);

    registerNumKeyBindings("focus-", "Move focus to column ", "Meta+", actions.focusColumn, 9);
    registerNumKeyBindings("window-move-to-column-", "Move window to column ", "Meta+Shift+", actions.windowMoveToColumn, 9);
    registerNumKeyBindings("column-move-to-column-", "Move column to position ", "Meta+Ctrl+Shift+", actions.columnMoveToColumn, 9);
    registerNumKeyBindings("column-move-to-desktop-", "Move column to desktop ", "Meta+Ctrl+Shift+F", actions.columnMoveToDesktop, 12);
    registerNumKeyBindings("tail-move-to-desktop-", "Move this and all following columns to desktop ", "Meta+Ctrl+Shift+Alt+F", actions.tailMoveToDesktop, 12);
}
