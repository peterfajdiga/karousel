class Column {
    constructor(grid) {
        this.grid = grid;
        this.windows = new LinkedList();
        this.width = null;
    }

    addWindow(windowNode) {
        const window = windowNode.item
        const client = window.client;
        this.windows.insertEnd(windowNode);
        if (this.width === null) {
            this.width = client.frameGeometry.width;
        }
        // TODO: also change column width if the new window requires it
    }

    removeWindow(windowNode) {
        this.windows.remove(windowNode);
    }
}
