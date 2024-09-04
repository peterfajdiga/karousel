function getKeyBindings(world: World, actions: Actions.Actions): KeyBinding[] {
    return [
        {
            name: "window-toggle-floating",
            description: "Toggle floating",
            defaultKeySequence: "Meta+Space",
            action: () => world.do(actions["window-toggle-floating"]),
        },
        {
            name: "focus-left",
            description: "Move focus left",
            defaultKeySequence: "Meta+A",
            action: () => world.doIfTiledFocused(actions["focus-left"]),
        },
        {
            name: "focus-right",
            description: "Move focus right",
            comment: "Clashes with default KDE shortcuts, may require manual remapping",
            defaultKeySequence: "Meta+D",
            action: () => world.doIfTiledFocused(actions["focus-right"]),
        },
        {
            name: "focus-up",
            description: "Move focus up",
            comment: "Clashes with default KDE shortcuts, may require manual remapping",
            defaultKeySequence: "Meta+W",
            action: () => world.doIfTiledFocused(actions["focus-up"]),
        },
        {
            name: "focus-down",
            description: "Move focus down",
            comment: "Clashes with default KDE shortcuts, may require manual remapping",
            defaultKeySequence: "Meta+S",
            action: () => world.doIfTiledFocused(actions["focus-down"]),
        },
        {
            name: "focus-start",
            description: "Move focus to start",
            defaultKeySequence: "Meta+Home",
            action: () => world.do(actions["focus-start"]),
        },
        {
            name: "focus-end",
            description: "Move focus to end",
            defaultKeySequence: "Meta+End",
            action: () => world.do(actions["focus-end"]),
        },
        {
            name: "window-move-left",
            description: "Move window left",
            comment: "Moves window out of and into columns",
            defaultKeySequence: "Meta+Shift+A",
            action: () => world.doIfTiledFocused(actions["window-move-left"]),
        },
        {
            name: "window-move-right",
            description: "Move window right",
            comment: "Moves window out of and into columns",
            defaultKeySequence: "Meta+Shift+D",
            action: () => world.doIfTiledFocused(actions["window-move-right"]),
        },
        {
            name: "window-move-up",
            description: "Move window up",
            defaultKeySequence: "Meta+Shift+W",
            action: () => world.doIfTiledFocused(actions["window-move-up"]),
        },
        {
            name: "window-move-down",
            description: "Move window down",
            defaultKeySequence: "Meta+Shift+S",
            action: () => world.doIfTiledFocused(actions["window-move-down"]),
        },
        {
            name: "window-move-start",
            description: "Move window to start",
            defaultKeySequence: "Meta+Shift+Home",
            action: () => world.doIfTiledFocused(actions["window-move-start"]),
        },
        {
            name: "window-move-end",
            description: "Move window to end",
            defaultKeySequence: "Meta+Shift+End",
            action: () => world.doIfTiledFocused(actions["window-move-end"]),
        },
        {
            name: "column-toggle-stacked",
            description: "Toggle stacked layout for focused column",
            comment: "One window in the column visible, others shaded; not supported on Wayland",
            defaultKeySequence: "Meta+X",
            action: () => world.doIfTiledFocused(actions["column-toggle-stacked"]),
        },
        {
            name: "column-move-left",
            description: "Move column left",
            defaultKeySequence: "Meta+Ctrl+Shift+A",
            action: () => world.doIfTiledFocused(actions["column-move-left"]),
        },
        {
            name: "column-move-right",
            description: "Move column right",
            defaultKeySequence: "Meta+Ctrl+Shift+D",
            action: () => world.doIfTiledFocused(actions["column-move-right"]),
        },
        {
            name: "column-move-start",
            description: "Move column to start",
            defaultKeySequence: "Meta+Ctrl+Shift+Home",
            action: () => world.doIfTiledFocused(actions["column-move-start"]),
        },
        {
            name: "column-move-end",
            description: "Move column to end",
            defaultKeySequence: "Meta+Ctrl+Shift+End",
            action: () => world.doIfTiledFocused(actions["column-move-end"]),
        },
        {
            name: "column-width-increase",
            description: "Increase column width",
            defaultKeySequence: "Meta+Ctrl++",
            action: () => world.doIfTiledFocused(actions["column-width-increase"]),
        },
        {
            name: "column-width-decrease",
            description: "Decrease column width",
            defaultKeySequence: "Meta+Ctrl+-",
            action: () => world.doIfTiledFocused(actions["column-width-decrease"]),
        },
        {
            name: "columns-width-equalize",
            description: "Equalize widths of visible columns",
            defaultKeySequence: "Meta+Ctrl+X",
            action: () => world.do(actions["columns-width-equalize"]),
        },
        {
            name: "grid-scroll-focused",
            description: "Center focused window",
            comment: "Scrolls so that the focused window is centered in the screen",
            defaultKeySequence: "Meta+Alt+Return",
            action: () => world.doIfTiledFocused(actions["grid-scroll-focused"]),
        },
        {
            name: "grid-scroll-left-column",
            description: "Scroll one column to the left",
            defaultKeySequence: "Meta+Alt+A",
            action: () => world.do(actions["grid-scroll-left-column"]),
        },
        {
            name: "grid-scroll-right-column",
            description: "Scroll one column to the right",
            defaultKeySequence: "Meta+Alt+D",
            action: () => world.do(actions["grid-scroll-right-column"]),
        },
        {
            name: "grid-scroll-left",
            description: "Scroll left",
            defaultKeySequence: "Meta+Alt+PgUp",
            action: () => world.do(actions["grid-scroll-left"]),
        },
        {
            name: "grid-scroll-right",
            description: "Scroll right",
            defaultKeySequence: "Meta+Alt+PgDown",
            action: () => world.do(actions["grid-scroll-right"]),
        },
        {
            name: "grid-scroll-start",
            description: "Scroll to start",
            defaultKeySequence: "Meta+Alt+Home",
            action: () => world.do(actions["grid-scroll-start"]),
        },
        {
            name: "grid-scroll-end",
            description: "Scroll to end",
            defaultKeySequence: "Meta+Alt+End",
            action: () => world.do(actions["grid-scroll-end"]),
        },
        {
            name: "screen-switch",
            description: "Move Karousel grid to the current screen",
            defaultKeySequence: "Meta+Ctrl+Return",
            action: () => world.do(actions["screen-switch"]),
        },
    ];
}

function getNumKeyBindings(world: World, numActions: Actions.NumActions): NumKeyBinding[] {
    return [
        {
            name: "focus-",
            description: "Move focus to column ",
            comment: "Clashes with default KDE shortcuts, may require manual remapping",
            defaultModifiers: "Meta",
            fKeys: false,
            action: composeNum(world.do, numActions["focus-"]),
        },
        {
            name: "window-move-to-column-",
            description: "Move window to column ",
            comment: "Requires manual remapping according to your keyboard layout, e.g. Meta+Shift+1 -> Meta+!",
            defaultModifiers: "Meta+Shift",
            fKeys: false,
            action: composeNum(world.doIfTiledFocused, numActions["window-move-to-column-"]),
        },
        {
            name: "column-move-to-column-",
            description: "Move column to position ",
            comment: "Requires manual remapping according to your keyboard layout, e.g. Meta+Ctrl+Shift+1 -> Meta+Ctrl+!",
            defaultModifiers: "Meta+Ctrl+Shift",
            fKeys: false,
            action: composeNum(world.doIfTiledFocused, numActions["column-move-to-column-"]),
        },
        {
            name: "column-move-to-desktop-",
            description: "Move column to desktop ",
            defaultModifiers: "Meta+Ctrl+Shift",
            fKeys: true,
            action: composeNum(world.doIfTiledFocused, numActions["column-move-to-desktop-"]),
        },
        {
            name: "tail-move-to-desktop-",
            description: "Move this and all following columns to desktop ",
            defaultModifiers: "Meta+Ctrl+Shift+Alt",
            fKeys: true,
            action: composeNum(world.doIfTiledFocused, numActions["tail-move-to-desktop-"]),
        },
    ];
}

function composeNum<T extends any[]>(
    f1: (f: (...args: T) => void) => void,
    f2: (i: number, ...args: T) => void
) {
    return (i: number) => {
        f1((...args: T) => f2(i, ...args));
    };
}
