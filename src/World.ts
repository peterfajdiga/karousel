class World {
    private grids: Grid[];
    public clientMap: Map<number, Window>;
    public signalManagerMap: Map<number, SignalManager>; // TODO: join maps
    public minimizedTiled: Set<number>;

    constructor(nDesktops: number) {
        // TODO: react to changes in number of desktops
        // TODO: support Plasma activities
        this.grids = new Array<Grid>(nDesktops);
        for (let i = 0; i < nDesktops; i++) {
            this.grids[i] = new Grid(i);
        }
        this.clientMap = new Map();
        this.signalManagerMap = new Map();
        this.minimizedTiled = new Set();
    }

    getGrid(desktop: number) {
        console.assert(desktop > 0);
        return this.grids[desktop-1];
    }

    addClient(id: number, client: AbstractClient) {
        const grid = this.getGrid(client.desktop);
        const column = new Column();
        const window = new Window(client);
        this.clientMap.set(id, window);

        this.signalManagerMap.set(id, initClientSignalHandlers(this, window));
        client.keepBelow = true;

        grid.addColumn(column);
        column.addWindow(window);
        grid.arrange();
    }

    removeClient(id: number) {
        const window = this.clientMap.get(id);
        if (window === undefined) {
            return;
        }
        const clientSignalManager = this.signalManagerMap.get(id);
        if (clientSignalManager === undefined) {
            console.assert(false);
            return;
        }
        clientSignalManager.disconnect();

        const column = window.column;
        if (column !== null) {
            const grid = column.grid;
            column.removeWindow(window);
            if (grid !== null) {
                grid.arrange();
            }
        }

        this.clientMap.delete(id);
        this.signalManagerMap.delete(id);

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

    doIfTiled(id: number, f: (window: Window, column: Column, grid: Grid) => void) {
        const window = this.clientMap.get(id);
        if (window === undefined) {
            return;
        }
        const column = window.column;
        if (column === null) {
            console.assert(false);
            return;
        }
        const grid = column.grid;
        if (grid === null) {
            return;
        }
        f(window, column, grid);
    }

    doIfTiledFocused(f: (window: Window, column: Column, grid: Grid) => void) {
        this.doIfTiled(workspace.activeClient.windowId, f);
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

function shouldTile(client: AbstractClient) {
    // TODO: support windows on all desktops
    return client.normalWindow && client.desktop > 0;
}
