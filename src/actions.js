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
        if (column.windows.length() === 1) {
            // move from own column into existing column
            const prevColumn = grid.columns.getPrev(column);
            if (prevColumn === null) {
                return;
            }
            grid.removeWindow(window);
            prevColumn.addWindow(window);
        } else {
            // move from shared column into own column
            const newColumn = new Column();
            grid.addColumnBefore(newColumn, column);
            grid.removeWindow(window);
            newColumn.addWindow(window);
        }
        grid.arrange();
    });
}

function windowMoveRight() {
    doIfTiledFocused(window => {
        const column = window.column;
        const grid = column.grid;
        if (column.windows.length() === 1) {
            // move from own column into existing column
            const nextColumn = grid.columns.getNext(column);
            if (nextColumn === null) {
                return;
            }
            grid.removeWindow(window);
            nextColumn.addWindow(window);
        } else {
            // move from shared column into own column
            const newColumn = new Column();
            grid.addColumnAfter(newColumn, column);
            grid.removeWindow(window);
            newColumn.addWindow(window);
        }
        grid.arrange();
    });
}

function windowMoveUp() {
    doIfTiledFocused(window => {
        const column = window.column;
        column.windows.moveBack(window);
        column.grid.arrange(); // TODO (optimization): only arrange moved windows
    });
}

function windowMoveDown() {
    doIfTiledFocused(window => {
        const column = window.column;
        column.windows.moveForward(window);
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
        grid.columns.moveBack(column);
        grid.arrange();
    });
}

function columnMoveRight() {
    doIfTiledFocused(window => {
        const column = window.column;
        const grid = column.grid;
        grid.columns.moveForward(column);
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
