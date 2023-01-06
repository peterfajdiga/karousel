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
        const column = new Column();
        const window = new Window(client);

        grid.addColumn(column);
        column.addWindow(window);
        grid.arrange();

        this.clientMap.set(id, window);
    }

    removeClient(id) {
        const window = this.clientMap.get(id);
        const column = window.column;
        const grid = column.grid;

        grid.removeWindow(window);
        grid.arrange();

        const clientRect = window.client.frameGeometry;
        clientRect.x += UNATTACH_OFFSET.x;
        clientRect.y += UNATTACH_OFFSET.y;
        clientRect.width = window.floatingSize.width;
        clientRect.height = window.floatingSize.height;

        this.clientMap.delete(id);
    }
}
