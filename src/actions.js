function doIfTiled(f) {
    const id = workspace.activeClient.windowId;
    const windowNode = world.clientMap.get(id);
    if (windowNode !== undefined) {
        // window is tiled
        f(windowNode);
    }
}

function windowMoveLeft() {
    doIfTiled(windowNode => {
        const columnNode = windowNode.item.columnNode;
        const column = columnNode.item;
        const grid = column.grid;
        if (column.windows.length === 1) {
            // move from own column into existing column
            const prevColumnNode = columnNode.prev;
            if (prevColumnNode === null) {
                return;
            }
            column.removeWindow(windowNode);
            prevColumnNode.item.addWindow(windowNode);
        } else {
            // move from shared column into own column
            const newColumn = new Column(grid);
            const newColumnNode = new LinkedListNode(newColumn);
            grid.columns.insertBefore(newColumnNode, columnNode);
            column.removeWindow(windowNode);
            newColumn.addWindow(windowNode);
        }
        grid.arrange();
    });
}

function windowMoveRight() {
    doIfTiled(windowNode => {
        const columnNode = windowNode.item.columnNode;
        const column = columnNode.item;
        const grid = column.grid;
        if (column.windows.length === 1) {
            // move from own column into existing column
            const nextColumnNode = columnNode.next;
            if (nextColumnNode === null) {
                return;
            }
            column.removeWindow(windowNode);
            nextColumnNode.item.addWindow(windowNode);
        } else {
            // move from shared column into own column
            const newColumn = new Column(grid);
            const newColumnNode = new LinkedListNode(newColumn);
            grid.columns.insertAfter(newColumnNode, columnNode);
            column.removeWindow(windowNode);
            newColumn.addWindow(windowNode);
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
    doIfTiled(windowNode => {
        const columnNode = windowNode.item.columnNode;
        const grid = columnNode.item.grid;
        grid.columns.moveBack(columnNode);
        grid.arrange();
    });
}

function columnMoveRight() {
    doIfTiled(windowNode => {
        const columnNode = windowNode.item.columnNode;
        const grid = columnNode.item.grid;
        grid.columns.moveForward(columnNode);
        grid.arrange();
    });
}
