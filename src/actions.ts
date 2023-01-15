function shouldTile(client: AbstractClient) {
    // TODO: support windows on all desktops
    return client.normalWindow && client.desktop > 0;
}

function doIfTiled(id: number, f: (window: Window, column: Column, grid: Grid) => void) {
    const window = world.clientMap.get(id);
    if (window === undefined) {
        return;
    }
    const column = window.column;
    if (column === null) {
        console.assert(false);
        return;
    }
    const grid = column.grid;
    if (grid === null) {
        return;
    }
    f(window, column, grid);
}

function doIfTiledFocused(f: (window: Window, column: Column, grid: Grid) => void) {
    doIfTiled(workspace.activeClient.windowId, f);
}

function focusLeft() {
    doIfTiledFocused((window, column, grid) => {
        const prevColumn = grid.getPrevColumn(column);
        if (prevColumn === null) {
            return;
        }
        prevColumn.focus();
    });
}

function focusRight() {
    doIfTiledFocused((window, column, grid) => {
        const nextColumn = grid.getNextColumn(column);
        if (nextColumn === null) {
            return;
        }
        nextColumn.focus();
    });
}

function focusUp() {
    doIfTiledFocused((window, column, grid) => {
        const prevWindow = column.getPrevWindow(window);
        if (prevWindow === null) {
            return;
        }
        prevWindow.focus();
    });
}

function focusDown() {
    doIfTiledFocused((window, column, grid) => {
        const nextWindow = column.getNextWindow(window);
        if (nextWindow === null) {
            return;
        }
        nextWindow.focus();
    });
}

function focusStart() {
    const grid = world.getGrid(workspace.currentDesktop);
    const firstColumn = grid.getFirstColumn();
    if (firstColumn === null) {
        return;
    }
    firstColumn.focus();
    grid.arrange();
}

function focusEnd() {
    const grid = world.getGrid(workspace.currentDesktop);
    const lastColumn = grid.getLastColumn();
    if (lastColumn === null) {
        return;
    }
    lastColumn.focus();
    grid.arrange();
}

function windowMoveLeft() {
    doIfTiledFocused((window, column, grid) => {
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
    doIfTiledFocused((window, column, grid) => {
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
    doIfTiledFocused((window, column, grid) => {
        column.moveWindowUp(window);
        grid.arrange(); // TODO (optimization): only arrange moved windows
    });
}

function windowMoveDown() {
    doIfTiledFocused((window, column, grid) => {
        column.moveWindowDown(window);
        grid.arrange(); // TODO (optimization): only arrange moved windows
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
    doIfTiledFocused((window, column, grid) => {
        grid.moveColumnLeft(column);
        grid.arrange();
    });
}

function columnMoveRight() {
    doIfTiledFocused((window, column, grid) => {
        grid.moveColumnRight(column);
        grid.arrange();
    });
}

function gridScroll(direction: number) {
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
