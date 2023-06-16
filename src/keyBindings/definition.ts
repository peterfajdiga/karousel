interface KeyBinding {
    name: string;
    description: string;
    defaultKeySequence: string;
    action: keyof ReturnType<typeof initActions>;
}

interface NumKeyBinding {
    name: string;
    description: string;
    defaultModifiers: string;
    fKeys: boolean;
    action: keyof ReturnType<typeof initNumActions>;
}

const keyBindings: KeyBinding[] = [
    {
        "name": "window-toggle-floating",
        "description": "Toggle floating",
        "defaultKeySequence": "Meta+Space",
        "action": "windowToggleFloating",
    },
    {
        "name": "focus-left",
        "description": "Move focus left",
        "defaultKeySequence": "Meta+A",
        "action": "focusLeft",
    },
    {
        "name": "focus-right",
        "description": "Move focus right",
        "defaultKeySequence": "Meta+D",
        "action": "focusRight",
    },
    {
        "name": "focus-up",
        "description": "Move focus up",
        "defaultKeySequence": "Meta+W",
        "action": "focusUp",
    },
    {
        "name": "focus-down",
        "description": "Move focus down",
        "defaultKeySequence": "Meta+S",
        "action": "focusDown",
    },
    {
        "name": "focus-start",
        "description": "Move focus to start",
        "defaultKeySequence": "Meta+Home",
        "action": "focusStart",
    },
    {
        "name": "focus-end",
        "description": "Move focus to end",
        "defaultKeySequence": "Meta+End",
        "action": "focusEnd",
    },
    {
        "name": "window-move-left",
        "description": "Move window left",
        "defaultKeySequence": "Meta+Shift+A",
        "action": "windowMoveLeft",
    },
    {
        "name": "window-move-right",
        "description": "Move window right",
        "defaultKeySequence": "Meta+Shift+D",
        "action": "windowMoveRight",
    },
    {
        "name": "window-move-up",
        "description": "Move window up",
        "defaultKeySequence": "Meta+Shift+W",
        "action": "windowMoveUp",
    },
    {
        "name": "window-move-down",
        "description": "Move window down",
        "defaultKeySequence": "Meta+Shift+S",
        "action": "windowMoveDown",
    },
    {
        "name": "window-move-start",
        "description": "Move window to start",
        "defaultKeySequence": "Meta+Shift+Home",
        "action": "windowMoveStart",
    },
    {
        "name": "window-move-end",
        "description": "Move window to end",
        "defaultKeySequence": "Meta+Shift+End",
        "action": "windowMoveEnd",
    },
    {
        "name": "window-expand",
        "description": "Expand window",
        "defaultKeySequence": "Meta+X",
        "action": "windowExpand",
    },
    {
        "name": "column-move-left",
        "description": "Move column left",
        "defaultKeySequence": "Meta+Ctrl+Shift+A",
        "action": "columnMoveLeft",
    },
    {
        "name": "column-move-right",
        "description": "Move column right",
        "defaultKeySequence": "Meta+Ctrl+Shift+D",
        "action": "columnMoveRight",
    },
    {
        "name": "column-move-start",
        "description": "Move column to start",
        "defaultKeySequence": "Meta+Ctrl+Shift+Home",
        "action": "columnMoveStart",
    },
    {
        "name": "column-move-end",
        "description": "Move column to end",
        "defaultKeySequence": "Meta+Ctrl+Shift+End",
        "action": "columnMoveEnd",
    },
    {
        "name": "column-expand",
        "description": "Expand column",
        "defaultKeySequence": "Meta+Ctrl+X",
        "action": "columnExpand",
    },
    {
        "name": "column-expand-visible",
        "description": "Expand visible columns",
        "defaultKeySequence": "Meta+Ctrl+Alt+X",
        "action": "columnExpandVisible",
    },
    {
        "name": "grid-scroll-focused",
        "description": "Scroll to focused window",
        "defaultKeySequence": "Meta+Alt+Return",
        "action": "gridScrollFocused",
    },
    {
        "name": "grid-scroll-left-column",
        "description": "Scroll one column to the left",
        "defaultKeySequence": "Meta+Alt+A",
        "action": "gridScrollLeftColumn",
    },
    {
        "name": "grid-scroll-left-column",
        "description": "Scroll one column to the left",
        "defaultKeySequence": "Meta+Alt+A",
        "action": "gridScrollLeftColumn",
    },
    {
        "name": "grid-scroll-right-column",
        "description": "Scroll one column to the right",
        "defaultKeySequence": "Meta+Alt+D",
        "action": "gridScrollRightColumn",
    },
    {
        "name": "grid-scroll-left",
        "description": "Scroll left",
        "defaultKeySequence": "Meta+Alt+PgUp",
        "action": "gridScrollLeft",
    },
    {
        "name": "grid-scroll-right",
        "description": "Scroll right",
        "defaultKeySequence": "Meta+Alt+PgDown",
        "action": "gridScrollRight",
    },
    {
        "name": "grid-scroll-start",
        "description": "Scroll to start",
        "defaultKeySequence": "Meta+Alt+Home",
        "action": "gridScrollStart",
    },
    {
        "name": "grid-scroll-end",
        "description": "Scroll to end",
        "defaultKeySequence": "Meta+Alt+End",
        "action": "gridScrollEnd",
    },
];

const numKeyBindings: NumKeyBinding[] = [
    {
        "name": "focus-",
        "description": "Move focus to column ",
        "defaultModifiers": "Meta",
        "fKeys": false,
        "action": "focusColumn",
    },
    {
        "name": "window-move-to-column-",
        "description": "Move window to column ",
        "defaultModifiers": "Meta+Shift",
        "fKeys": false,
        "action": "windowMoveToColumn",
    },
    {
        "name": "column-move-to-column-",
        "description": "Move column to position ",
        "defaultModifiers": "Meta+Ctrl+Shift",
        "fKeys": false,
        "action": "columnMoveToColumn",
    },
    {
        "name": "column-move-to-desktop-",
        "description": "Move column to desktop ",
        "defaultModifiers": "Meta+Ctrl+Shift",
        "fKeys": true,
        "action": "columnMoveToDesktop",
    },
    {
        "name": "tail-move-to-desktop-",
        "description": "Move this and all following columns to desktop ",
        "defaultModifiers": "Meta+Ctrl+Shift+Alt",
        "fKeys": true,
        "action": "tailMoveToDesktop",
    },
];
