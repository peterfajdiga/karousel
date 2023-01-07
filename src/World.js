class World {
    constructor(nDesktops) {
        // TODO: react to changes in number of desktops
        // TODO: support Plasma activities
        this.grids = new Array(nDesktops);
        for (let i = 0; i < nDesktops; i++) {
            this.grids[i] = new Grid(i);
        }
        this.clientMap = new Map();
        this.minimizedTiled = new Set();
    }

    addClient(id, client) {
        const desktopIndex = client.desktop - 1;
        const grid = this.grids[desktopIndex];
        const column = new Column();
        const window = new Window(client);
        window.connectToSignals();

        client.keepBelow = true;

        grid.addColumn(column);
        column.addWindow(window);
        grid.arrange();

        this.clientMap.set(id, window);
    }

    removeClient(id) {
        const window = this.clientMap.get(id);
        const column = window.column;
        const grid = column.grid;
        window.disconnectFromSignals();

        grid.removeWindow(window);
        grid.arrange();

        this.clientMap.delete(id);

        const clientRect = window.client.frameGeometry;
        window.setRect(
            clientRect.x + UNATTACH_OFFSET.x,
            clientRect.y + UNATTACH_OFFSET.y,
            window.floatingState.width,
            window.floatingState.height,
        );

        window.client.keepAbove = window.floatingState.keepAbove;
        window.client.keepBelow = window.floatingState.keepBelow;
    }
}
