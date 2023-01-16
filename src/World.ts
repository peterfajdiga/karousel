class World {
    private grids: Grid[];
    private clientMap: Map<number, ClientData>;
    public minimizedTiled: Set<number>;
    private workspaceSignalManager: SignalManager;

    constructor(nDesktops: number) {
        // TODO: react to changes in number of desktops
        // TODO: support Plasma activities
        this.grids = new Array<Grid>(nDesktops);
        for (let i = 0; i < nDesktops; i++) {
            this.grids[i] = new Grid(this, i);
        }
        this.clientMap = new Map();
        this.minimizedTiled = new Set();
        this.workspaceSignalManager = initWorkspaceSignalHandlers(this);
    }

    getGrid(desktop: number) {
        console.assert(desktop > 0);
        return this.grids[desktop-1];
    }

    addClient(id: number, client: AbstractClient) {
        const grid = this.getGrid(client.desktop);
        const column = new Column();
        const window = new Window(client);

        const clientSignalManager = initClientSignalHandlers(this, window);
        this.clientMap.set(id, {
            window: window,
            signalManager: clientSignalManager,
        });
        client.keepBelow = true;

        grid.addColumn(column);
        column.addWindow(window);
        grid.arrange();
    }

    removeClient(id: number) {
        const clientData = this.clientMap.get(id);
        if (clientData === undefined) {
            return;
        }
        clientData.signalManager.disconnect();

        const window = clientData.window;
        const column = window.column;
        if (column !== null) {
            const grid = column.grid;
            column.removeWindow(window);
            if (grid !== null) {
                grid.arrange();
            }
        }

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

    hasClient(id: number) {
        return this.clientMap.has(id);
    }

    doIfTiled(id: number, f: (window: Window, column: Column, grid: Grid) => void) {
        const clientData = this.clientMap.get(id);
        if (clientData === undefined) {
            return;
        }
        const window = clientData.window;
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
        const clientData = this.clientMap.get(activeClient.windowId);
        if (clientData === undefined) {
            return undefined;
        }
        return clientData.window;
    }

    removeAllClients() {
        for (const id of this.clientMap.keys()) {
            this.removeClient(id);
        }
    }

    destroy() {
        this.workspaceSignalManager.disconnect();
        this.removeAllClients();
    }
}

interface ClientData {
    window: Window;
    signalManager: SignalManager;
}

function shouldTile(client: AbstractClient) {
    // TODO: support windows on all desktops
    return client.normalWindow && client.desktop > 0 && !client.minimized;
}
