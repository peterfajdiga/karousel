function getKeyBindings(world: World, actions: Actions): KeyBinding[] {
    return [
        {
            name: "window-toggle-floating",
            description: "Toggle floating",
            defaultKeySequence: "Meta+Space",
            action: () => {
                world.do(actions.windowToggleFloating)
                world.callMoveToFocus()
            },
        },
        {
            name: "focus-left",
            description: "Move focus left",
            defaultKeySequence: "Meta+A",
            action: () => {
                world.doIfTiledFocused(actions.focusLeft)
                world.callMoveToFocus()
            },
        },
        {
            name: "focus-right",
            description: "Move focus right",
            comment: "Clashes with default KDE shortcuts, may require manual remapping",
            defaultKeySequence: "Meta+D",
            action: () => {
                world.doIfTiledFocused(actions.focusRight)
                world.callMoveToFocus()
            },
        },
        {
            name: "focus-up",
            description: "Move focus up",
            comment: "Clashes with default KDE shortcuts, may require manual remapping",
            defaultKeySequence: "Meta+W",
            action: () => {
                world.doIfTiledFocused(actions.focusUp)
                world.callMoveToFocus()
            },
        },
        {
            name: "focus-down",
            description: "Move focus down",
            comment: "Clashes with default KDE shortcuts, may require manual remapping",
            defaultKeySequence: "Meta+S",
            action: () => {
                world.doIfTiledFocused(actions.focusDown)
                world.callMoveToFocus()
            },
       },
        {
            name: "focus-next",
            description: "Move focus to the next window in grid",
            action: () => {
                world.doIfTiledFocused(actions.focusNext)
                world.callMoveToFocus()
            },
        },
        {
            name: "focus-previous",
            description: "Move focus to the previous window in grid",
            action: () => {
                world.doIfTiledFocused(actions.focusPrevious)
                world.callMoveToFocus()
            },
        },
        {
            name: "focus-start",
            description: "Move focus to start",
            defaultKeySequence: "Meta+Home",
            action: () => {
                world.do(actions.focusStart)
                world.callMoveToFocus()
            },
        },
        {
            name: "focus-end",
            description: "Move focus to end",
            defaultKeySequence: "Meta+End",
            action: () => {
                world.do(actions.focusEnd)
                world.callMoveToFocus()
            },
        },
        {
            name: "window-move-left",
            description: "Move window left",
            comment: "Moves window out of and into columns",
            defaultKeySequence: "Meta+Shift+A",
            action: () => {
                world.doIfTiledFocused(actions.windowMoveLeft)
                world.callMoveToFocus()
            },
        },
        {
            name: "window-move-right",
            description: "Move window right",
            comment: "Moves window out of and into columns",
            defaultKeySequence: "Meta+Shift+D",
            action: () => {
                world.doIfTiledFocused(actions.windowMoveRight)
                world.callMoveToFocus()
            },
        },
        {
            name: "window-move-up",
            description: "Move window up",
            defaultKeySequence: "Meta+Shift+W",
            action: () => {
                world.doIfTiledFocused(actions.windowMoveUp)
                world.callMoveToFocus()
            },
        },
        {
            name: "window-move-down",
            description: "Move window down",
            defaultKeySequence: "Meta+Shift+S",
            action: () => {
                world.doIfTiledFocused(actions.windowMoveDown)
                world.callMoveToFocus()
            },
        },
        {
            name: "window-move-next",
            description: "Move window to the next position in grid",
            action: () => {
                world.doIfTiledFocused(actions.windowMoveNext)
                world.callMoveToFocus()
            },
        },
        {
            name: "window-move-previous",
            description: "Move window to the previous position in grid",
            action: () => {
                world.doIfTiledFocused(actions.windowMovePrevious)
                world.callMoveToFocus()
            },
        },
        {
            name: "window-move-start",
            description: "Move window to start",
            defaultKeySequence: "Meta+Shift+Home",
            action: () => {
                world.doIfTiledFocused(actions.windowMoveStart)
                world.callMoveToFocus()
            },
        },
        {
            name: "window-move-end",
            description: "Move window to end",
            defaultKeySequence: "Meta+Shift+End",
            action: () => {
                world.doIfTiledFocused(actions.windowMoveEnd)
                world.callMoveToFocus()
            },
        },
        {
            name: "column-toggle-stacked",
            description: "Toggle stacked layout for focused column",
            comment: "Only the active window visible",
            defaultKeySequence: "Meta+X",
            action: () => {
                world.doIfTiledFocused(actions.columnToggleStacked)
                world.callMoveToFocus()
            },
        },
        {
            name: "column-move-left",
            description: "Move column left",
            defaultKeySequence: "Meta+Ctrl+Shift+A",
            action: () => {
                world.doIfTiledFocused(actions.columnMoveLeft)
                world.callMoveToFocus()
            },
        },
        {
            name: "column-move-right",
            description: "Move column right",
            defaultKeySequence: "Meta+Ctrl+Shift+D",
            action: () => {
                world.doIfTiledFocused(actions.columnMoveRight)
                world.callMoveToFocus()
            },
        },
        {
            name: "column-move-start",
            description: "Move column to start",
            defaultKeySequence: "Meta+Ctrl+Shift+Home",
            action: () => {
                world.doIfTiledFocused(actions.columnMoveStart)
                world.callMoveToFocus()
            },
        },
        {
            name: "column-move-end",
            description: "Move column to end",
            defaultKeySequence: "Meta+Ctrl+Shift+End",
            action: () => {
                world.doIfTiledFocused(actions.columnMoveEnd)
                world.callMoveToFocus()
            },
        },
        {
            name: "column-width-increase",
            description: "Increase column width",
            defaultKeySequence: "Meta+Ctrl++",
            action: () => {
                world.doIfTiledFocused(actions.columnWidthIncrease)
                world.callMoveToFocus()
            },
        },
        {
            name: "column-width-decrease",
            description: "Decrease column width",
            defaultKeySequence: "Meta+Ctrl+-",
            action: () => {
                world.doIfTiledFocused(actions.columnWidthDecrease)
                world.callMoveToFocus()
            },
        },
        {
            name: "cycle-preset-widths",
            description: "Cycle through preset column widths",
            defaultKeySequence: "Meta+R",
            action: () => {
                world.doIfTiledFocused(actions.cyclePresetWidths)
                world.callMoveToFocus()
            },
        },
        {
            name: "cycle-preset-widths-reverse",
            description: "Cycle through preset column widths in reverse",
            defaultKeySequence: "Meta+Shift+R",
            action: () => {
                world.doIfTiledFocused(actions.cyclePresetWidthsReverse)
                world.callMoveToFocus()
            },
        },
        {
            name: "columns-width-equalize",
            description: "Equalize widths of visible columns",
            defaultKeySequence: "Meta+Ctrl+X",
            action: () => {
                world.do(actions.columnsWidthEqualize)
                world.callMoveToFocus()
            },
        },
        {
            name: "columns-squeeze-left",
            description: "Squeeze left column onto the screen",
            comment: "Clashes with default KDE shortcuts, may require manual remapping",
            defaultKeySequence: "Meta+Ctrl+A",
            action: () => {
                world.doIfTiledFocused(actions.columnsSqueezeLeft)
                world.callMoveToFocus()
            },
        },
        {
            name: "columns-squeeze-right",
            description: "Squeeze right column onto the screen",
            defaultKeySequence: "Meta+Ctrl+D",
            action: () => {
                world.doIfTiledFocused(actions.columnsSqueezeRight)
                world.callMoveToFocus()
            },
        },
        {
            name: "grid-scroll-focused",
            description: "Center focused window",
            comment: "Scrolls so that the focused window is centered in the screen",
            defaultKeySequence: "Meta+Alt+Return",
            action: () => {
                world.doIfTiledFocused(actions.gridScrollFocused)
                world.callMoveToFocus()
            },
        },
        {
            name: "grid-scroll-left-column",
            description: "Scroll one column to the left",
            defaultKeySequence: "Meta+Alt+A",
            action: () => world.do(actions.gridScrollLeftColumn),
        },
        {
            name: "grid-scroll-right-column",
            description: "Scroll one column to the right",
            defaultKeySequence: "Meta+Alt+D",
            action: () => world.do(actions.gridScrollRightColumn),
        },
        {
            name: "grid-scroll-left",
            description: "Scroll left",
            defaultKeySequence: "Meta+Alt+PgUp",
            action: () => world.do(actions.gridScrollLeft),
        },
        {
            name: "grid-scroll-right",
            description: "Scroll right",
            defaultKeySequence: "Meta+Alt+PgDown",
            action: () => world.do(actions.gridScrollRight),
        },
        {
            name: "grid-scroll-start",
            description: "Scroll to start",
            defaultKeySequence: "Meta+Alt+Home",
            action: () => world.do(actions.gridScrollStart),
        },
        {
            name: "grid-scroll-end",
            description: "Scroll to end",
            defaultKeySequence: "Meta+Alt+End",
            action: () => world.do(actions.gridScrollEnd),
        },
        {
            name: "screen-switch",
            description: "Move Karousel grid to the current screen",
            defaultKeySequence: "Meta+Ctrl+Return",
            action: () => world.do(actions.screenSwitch),
        },
    ];
}

function getNumKeyBindings(world: World, actions: Actions): NumKeyBinding[] {
    return [
        {
            name: "focus-{}",
            description: "Move focus to column {}",
            comment: "Clashes with default KDE shortcuts, may require manual remapping",
            defaultModifiers: "Meta",
            fKeys: false,
            action: (i: number) => {
                world.do(actions.focus.partial(i))
                world.callMoveToFocus()
            },
        },
        {
            name: "window-move-to-column-{}",
            description: "Move window to column {}",
            comment: "Requires manual remapping according to your keyboard layout, e.g. Meta+Shift+1 -> Meta+!",
            defaultModifiers: "Meta+Shift",
            fKeys: false,
            action: (i: number) => {
                world.doIfTiledFocused(actions.windowMoveToColumn.partial(i))
                world.callMoveToFocus()
            },
        },
        {
            name: "column-move-to-column-{}",
            description: "Move column to position {}",
            comment: "Requires manual remapping according to your keyboard layout, e.g. Meta+Ctrl+Shift+1 -> Meta+Ctrl+!",
            defaultModifiers: "Meta+Ctrl+Shift",
            fKeys: false,
            action: (i: number) => {
                world.doIfTiledFocused(actions.columnMoveToColumn.partial(i))
                world.callMoveToFocus()
            },
        },
        {
            name: "column-move-to-desktop-{}",
            description: "Move column to desktop {}",
            defaultModifiers: "Meta+Ctrl+Shift",
            fKeys: true,
            action: (i: number) => {
                world.doIfTiledFocused(actions.columnMoveToDesktop.partial(i))
                world.callMoveToFocus()
            },
        },
        {
            name: "tail-move-to-desktop-{}",
            description: "Move this and all following columns to desktop {}",
            defaultModifiers: "Meta+Ctrl+Shift+Alt",
            fKeys: true,
            action: (i: number) => {
                world.doIfTiledFocused(actions.tailMoveToDesktop.partial(i))
                world.callMoveToFocus()
            },
        },
    ];
}
