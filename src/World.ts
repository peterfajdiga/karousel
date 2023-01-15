class World {
    private grids: Grid[];
    public clientMap: Map<number, Window>;
    public minimizedTiled: Set<number>;

    constructor(nDesktops) {
        // TODO: react to changes in number of desktops
        // TODO: support Plasma activities
        this.grids = new Array<Grid>(nDesktops);
        for (let i = 0; i < nDesktops; i++) {
            this.grids[i] = new Grid(i);
        }
        this.clientMap = new Map();
        this.minimizedTiled = new Set();
    }

    getGrid(desktop) {
        console.assert(desktop > 0);
        return this.grids[desktop-1];
    }

    addClient(id, client) {
        const grid = this.getGrid(client.desktop);
        const column = new Column();
        const window = new Window(client);
        this.clientMap.set(id, window);

        window.connectToClientSignals();
        client.keepBelow = true;

        grid.addColumn(column);
        column.addWindow(window);
        grid.arrange();
    }

    removeClient(id) {
        const window = this.clientMap.get(id);
        const column = window.column;
        const grid = column.grid;
        window.disconnectFromClientSignals();

        column.removeWindow(window);
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

    getFocusedWindow() {
        const activeClient = workspace.activeClient;
        if (activeClient === null) {
            return undefined;
        }
        return this.clientMap.get(activeClient.windowId);
    }

    removeAllClients() {
        for (const id of this.clientMap.keys()) {
            this.removeClient(id);
        }
    }
}