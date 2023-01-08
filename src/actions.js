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

function windowMoveLeft() {
    doIfTiledFocused(window => {
        const column = window.column;
        const grid = column.grid;
        if (column.getWindowCount() === 1) {
            // move from own column into existing column
            grid.mergeColumnsPrev(column);
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
            grid.mergeColumnsNext(column);
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
        column.moveWindowBack(window);
        column.grid.arrange(); // TODO (optimization): only arrange moved windows
    });
}

function windowMoveDown() {
    doIfTiledFocused(window => {
        const column = window.column;
        column.moveWindowForward(window);
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
        grid.moveColumnBack(column);
        grid.arrange();
    });
}

function columnMoveRight() {
    doIfTiledFocused(window => {
        const column = window.column;
        const grid = column.grid;
        grid.moveColumnForward(column);
        grid.arrange();
    });
}

function gridScroll(direction) {
    const scrollAmount = GRID_SCROLL_STEP * direction;
    const grid = world.getGrid(workspace.currentDesktop);
    grid.adjustScroll(scrollAmount);
    grid.arrange();
}

function gridScrollLeft() {
    gridScroll(-1);
}

function gridScrollRight() {
    gridScroll(1);
}
