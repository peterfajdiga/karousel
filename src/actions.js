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
        const columnNode = window.columnNode;
        const column = columnNode.item;
        const grid = column.grid;
        if (column.windows.length === 1) {
            // move from own column into existing column
            const prevColumnNode = columnNode.prev;
            if (prevColumnNode === null) {
                return;
            }
            column.removeWindow(window.node);
            prevColumnNode.item.addWindow(window.node);
        } else {
            // move from shared column into own column
            const newColumn = new Column(grid);
            grid.columns.insertBefore(newColumn.node, columnNode);
            column.removeWindow(window.node);
            newColumn.addWindow(window.node);
        }
        grid.arrange();
    });
}

function windowMoveRight() {
    doIfTiled(window => {
        const columnNode = window.columnNode;
        const column = columnNode.item;
        const grid = column.grid;
        if (column.windows.length === 1) {
            // move from own column into existing column
            const nextColumnNode = columnNode.next;
            if (nextColumnNode === null) {
                return;
            }
            column.removeWindow(window.node);
            nextColumnNode.item.addWindow(window.node);
        } else {
            // move from shared column into own column
            const newColumn = new Column(grid);
            grid.columns.insertAfter(newColumn.node, columnNode);
            column.removeWindow(window.node);
            newColumn.addWindow(window.node);
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
        const columnNode = window.columnNode;
        const grid = columnNode.item.grid;
        grid.columns.moveBack(columnNode);
        grid.arrange();
    });
}

function columnMoveRight() {
    doIfTiled(window => {
        const columnNode = window.columnNode;
        const grid = columnNode.item.grid;
        grid.columns.moveForward(columnNode);
        grid.arrange();
    });
}
