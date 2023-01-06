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
        if (column.windows.length === 1) {
            // move from own column into existing column
            const prevColumnNode = column.node.prev;
            if (prevColumnNode === null) {
                return;
            }
            column.removeWindow(window);
            prevColumnNode.item.addWindow(window);
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
    doIfTiled(window => {
        const column = window.column;
        const grid = column.grid;
        if (column.windows.length === 1) {
            // move from own column into existing column
            const nextColumnNode = column.node.next;
            if (nextColumnNode === null) {
                return;
            }
            column.removeWindow(window);
            nextColumnNode.item.addWindow(window);
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
        grid.columns.moveBack(column.node);
        grid.arrange();
    });
}

function columnMoveRight() {
    doIfTiled(window => {
        const column = window.column;
        const grid = column.grid;
        grid.columns.moveForward(column.node);
        grid.arrange();
    });
}
