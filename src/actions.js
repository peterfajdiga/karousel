function doIfTiled(f) {
    const id = workspace.activeClient.windowId;
    const window = world.clientMap.get(id);
    if (window !== undefined) {
        // window is tiled
        f(window);
    }
}

function windowMoveLeft() {
    doIfTiled(window => {
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
    doIfTiled(window => {
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

function windowToggleFloating() {
    const client = workspace.activeClient;
    const id = client.windowId;
    if (world.clientMap.has(id)) {
        world.removeClient(id);
    } else {
        world.addClient(id, client);
    }
}

function columnMoveLeft() {
    doIfTiled(window => {
        const column = window.column;
        const grid = column.grid;
        grid.columns.moveBack(column);
        grid.arrange();
    });
}

function columnMoveRight() {
    doIfTiled(window => {
        const column = window.column;
        const grid = column.grid;
        grid.columns.moveForward(column);
        grid.arrange();
    });
}
