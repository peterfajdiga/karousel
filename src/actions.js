function doIfTiled(f) {
    const id = workspace.activeClient.windowId;
    const windowNode = world.clientMap.get(id);
    if (windowNode !== undefined) {
        // window is tiled
        f(windowNode);
    }
}

function windowMoveLeft() {
    print("key pressed");
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
