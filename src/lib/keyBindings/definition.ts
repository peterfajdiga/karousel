const keyBindings: KeyBinding[] = [
    {
        name: "window-toggle-floating",
        description: "Toggle floating",
        defaultKeySequence: "Meta+Space",
    },
    {
        name: "focus-left",
        description: "Move focus left",
        defaultKeySequence: "Meta+A",
    },
    {
        name: "focus-right",
        description: "Move focus right",
        comment: "Clashes with default KDE shortcuts, may require manual remapping",
        defaultKeySequence: "Meta+D",
    },
    {
        name: "focus-up",
        description: "Move focus up",
        comment: "Clashes with default KDE shortcuts, may require manual remapping",
        defaultKeySequence: "Meta+W",
    },
    {
        name: "focus-down",
        description: "Move focus down",
        comment: "Clashes with default KDE shortcuts, may require manual remapping",
        defaultKeySequence: "Meta+S",
    },
    {
        name: "focus-start",
        description: "Move focus to start",
        defaultKeySequence: "Meta+Home",
    },
    {
        name: "focus-end",
        description: "Move focus to end",
        defaultKeySequence: "Meta+End",
    },
    {
        name: "window-move-left",
        description: "Move window left",
        comment: "Moves window out of and into columns",
        defaultKeySequence: "Meta+Shift+A",
    },
    {
        name: "window-move-right",
        description: "Move window right",
        comment: "Moves window out of and into columns",
        defaultKeySequence: "Meta+Shift+D",
    },
    {
        name: "window-move-up",
        description: "Move window up",
        defaultKeySequence: "Meta+Shift+W",
    },
    {
        name: "window-move-down",
        description: "Move window down",
        defaultKeySequence: "Meta+Shift+S",
    },
    {
        name: "window-move-start",
        description: "Move window to start",
        defaultKeySequence: "Meta+Shift+Home",
    },
    {
        name: "window-move-end",
        description: "Move window to end",
        defaultKeySequence: "Meta+Shift+End",
    },
    {
        name: "column-toggle-stacked",
        description: "Toggle stacked layout for focused column",
        comment: "One window in the column visible, others shaded; not supported on Wayland",
        defaultKeySequence: "Meta+X",
    },
    {
        name: "column-move-left",
        description: "Move column left",
        defaultKeySequence: "Meta+Ctrl+Shift+A",
    },
    {
        name: "column-move-right",
        description: "Move column right",
        defaultKeySequence: "Meta+Ctrl+Shift+D",
    },
    {
        name: "column-move-start",
        description: "Move column to start",
        defaultKeySequence: "Meta+Ctrl+Shift+Home",
    },
    {
        name: "column-move-end",
        description: "Move column to end",
        defaultKeySequence: "Meta+Ctrl+Shift+End",
    },
    {
        name: "column-width-increase",
        description: "Increase column width",
        defaultKeySequence: "Meta+Ctrl++",
    },
    {
        name: "column-width-decrease",
        description: "Decrease column width",
        defaultKeySequence: "Meta+Ctrl+-",
    },
    {
        name: "columns-width-equalize",
        description: "Equalize widths of visible columns",
        defaultKeySequence: "Meta+Ctrl+X",
    },
    {
        name: "grid-scroll-focused",
        description: "Center focused window",
        comment: "Scrolls so that the focused window is centered in the screen",
        defaultKeySequence: "Meta+Alt+Return",
    },
    {
        name: "grid-scroll-left-column",
        description: "Scroll one column to the left",
        defaultKeySequence: "Meta+Alt+A",
    },
    {
        name: "grid-scroll-right-column",
        description: "Scroll one column to the right",
        defaultKeySequence: "Meta+Alt+D",
    },
    {
        name: "grid-scroll-left",
        description: "Scroll left",
        defaultKeySequence: "Meta+Alt+PgUp",
    },
    {
        name: "grid-scroll-right",
        description: "Scroll right",
        defaultKeySequence: "Meta+Alt+PgDown",
    },
    {
        name: "grid-scroll-start",
        description: "Scroll to start",
        defaultKeySequence: "Meta+Alt+Home",
    },
    {
        name: "grid-scroll-end",
        description: "Scroll to end",
        defaultKeySequence: "Meta+Alt+End",
    },
    {
        name: "screen-switch",
        description: "Move Karousel grid to the current screen",
        defaultKeySequence: "Meta+Ctrl+Return",
    }
];

const numKeyBindings: NumKeyBinding[] = [
    {
        name: "focus-",
        description: "Move focus to column ",
        comment: "Clashes with default KDE shortcuts, may require manual remapping",
        defaultModifiers: "Meta",
        fKeys: false,
    },
    {
        name: "window-move-to-column-",
        description: "Move window to column ",
        comment: "Requires manual remapping according to your keyboard layout, e.g. Meta+Shift+1 -> Meta+!",
        defaultModifiers: "Meta+Shift",
        fKeys: false,
    },
    {
        name: "column-move-to-column-",
        description: "Move column to position ",
        comment: "Requires manual remapping according to your keyboard layout, e.g. Meta+Ctrl+Shift+1 -> Meta+Ctrl+!",
        defaultModifiers: "Meta+Ctrl+Shift",
        fKeys: false,
    },
    {
        name: "column-move-to-desktop-",
        description: "Move column to desktop ",
        defaultModifiers: "Meta+Ctrl+Shift",
        fKeys: true,
    },
    {
        name: "tail-move-to-desktop-",
        description: "Move this and all following columns to desktop ",
        defaultModifiers: "Meta+Ctrl+Shift+Alt",
        fKeys: true,
    },
];
