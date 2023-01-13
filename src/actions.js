function shouldTile(client) {
    // TODO: support windows on all desktops
    return client.normalWindow && client.desktop > 0;
}

function doIfTiled(id, f) {
    const window = world.clientMap.get(id);
    if (window !== undefined) {
        // window is tiled
        f(window);
    }
}

function doIfTiledFocused(f) {
    doIfTiled(workspace.activeClient.windowId, f);
}

function focusLeft() {
    doIfTiledFocused(window => {
        const column = window.column;
        const grid = column.grid;
        const prevColumn = grid.getPrevColumn(column);
        if (prevColumn === null) {
            return;
        }
        prevColumn.focus();
    });
}

function focusRight() {
    doIfTiledFocused(window => {
        const column = window.column;
        const grid = column.grid;
        const nextColumn = grid.getNextColumn(column);
        if (nextColumn === null) {
            return;
        }
        nextColumn.focus();
    });
}

function focusUp() {
    doIfTiledFocused(window => {
        const column = window.column;
        const prevWindow = column.getPrevWindow(window);
        if (prevWindow === null) {
            return;
        }
        prevWindow.focus();
    });
}

function focusDown() {
    doIfTiledFocused(window => {
        const column = window.column;
        const nextWindow = column.getNextWindow(window);
        if (nextWindow === null) {
            return;
        }
        nextWindow.focus();
    });
}

function windowMoveLeft() {
    doIfTiledFocused(window => {
        const column = window.column;
        const grid = column.grid;
        if (column.getWindowCount() === 1) {
            // move from own column into existing column
            grid.mergeColumnsLeft(column);
        } else {
            // move from shared column into own column
            const newColumn = new Column();
            grid.addColumnBefore(newColumn, column);
            column.removeWindow(window);
            newColumn.addWindow(window);
        }
        grid.arrange();
    });
}

function windowMoveRight() {
    doIfTiledFocused(window => {
        const column = window.column;
        const grid = column.grid;
        if (column.getWindowCount() === 1) {
            // move from own column into existing column
            grid.mergeColumnsRight(column);
        } else {
            // move from shared column into own column
            const newColumn = new Column();
            grid.addColumnAfter(newColumn, column);
            column.removeWindow(window);
            newColumn.addWindow(window);
        }
        grid.arrange();
    });
}

function windowMoveUp() {
    doIfTiledFocused(window => {
        const column = window.column;
        column.moveWindowUp(window);
        column.grid.arrange(); // TODO (optimization): only arrange moved windows
    });
}

function windowMoveDown() {
    doIfTiledFocused(window => {
        const column = window.column;
        column.moveWindowDown(window);
        column.grid.arrange(); // TODO (optimization): only arrange moved windows
    });
}

function windowToggleFloating() {
    const client = workspace.activeClient;
    const id = client.windowId;
    if (world.clientMap.has(id)) {
        world.removeClient(id);
    } else if (shouldTile(client)) {
        world.addClient(id, client);
    }
}

function columnMoveLeft() {
    doIfTiledFocused(window => {
        const column = window.column;
        const grid = column.grid;
        grid.moveColumnLeft(column);
        grid.arrange();
    });
}

function columnMoveRight() {
    doIfTiledFocused(window => {
        const column = window.column;
        const grid = column.grid;
        grid.moveColumnRight(column);
        grid.arrange();
    });
}

function gridScroll(direction) {
    const scrollAmount = GRID_SCROLL_STEP * direction;
    const grid = world.getGrid(workspace.currentDesktop);
    grid.adjustScroll(scrollAmount, false);
    grid.arrange();
}

function gridScrollLeft() {
    gridScroll(-1);
}

function gridScrollRight() {
    gridScroll(1);
}

function gridScrollStart() {
    const grid = world.getGrid(workspace.currentDesktop);
    const firstColumn = grid.getFirstColumn();
    if (firstColumn === null) {
        return;
    }
    grid.scrollToColumn(firstColumn);
    grid.arrange();
}

function gridScrollEnd() {
    const grid = world.getGrid(workspace.currentDesktop);
    const lastColumn = grid.getLastColumn();
    if (lastColumn === null) {
        return;
    }
    grid.scrollToColumn(lastColumn);
    grid.arrange();
}

function gridScrollLeftColumn() {
    const grid = world.getGrid(workspace.currentDesktop);
    const column = grid.getLeftmostVisibleColumn(true);
    if (column === null) {
        return;
    }

    const prevColumn = grid.getPrevColumn(column);
    if (prevColumn === null) {
        return;
    }

    grid.scrollToColumn(prevColumn);
    grid.arrange();
}

function gridScrollRightColumn() {
    const grid = world.getGrid(workspace.currentDesktop);
    const column = grid.getRightmostVisibleColumn(true);
    if (column === null) {
        return;
    }

    const nextColumn = grid.getNextColumn(column);
    if (nextColumn === null) {
        return;
    }

    grid.scrollToColumn(nextColumn);
    grid.arrange();
}
