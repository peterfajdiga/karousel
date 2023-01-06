class World {
    constructor(nDesktops) {
        // TODO: react to changes in number of desktops
        // TODO: support Plasma activities
        this.grids = new Array(nDesktops);
        for (let i = 0; i < nDesktops; i++) {
            this.grids[i] = new Grid(i);
        }
        this.clientMap = new Map();
    }

    addClient(id, client) {
        const desktopIndex = client.desktop - 1;
        const grid = this.grids[desktopIndex];
        const column = new Column(grid);
        const window = new Window(column.node, client);

        column.addWindow(window.node);
        grid.addColumn(column.node);
        grid.arrange();

        this.clientMap.set(id, window.node);
    }

    removeClient(id) {
        const windowNode = this.clientMap.get(id);
        const window = windowNode.item;
        const columnNode = window.columnNode;
        const column = columnNode.item;
        const grid = column.grid;

        column.removeWindow(windowNode);
        grid.removeColumn(columnNode);
        grid.arrange();

        const clientRect = window.client.frameGeometry;
        clientRect.x += UNATTACH_OFFSET.x;
        clientRect.y += UNATTACH_OFFSET.y;
        clientRect.width = window.floatingSize.width;
        clientRect.height = window.floatingSize.height;

        this.clientMap.delete(id);
    }
}
