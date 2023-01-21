class World {
    private grids: Grid[];
    private clientMap: Map<AbstractClient, ClientData>;
    public minimizedTiled: Set<AbstractClient>; // TODO: implement using `clientMap`
    private lastFocusedClient: AbstractClient|null;
    private workspaceSignalManager: SignalManager;
    private screenResizedDelayer: Delayer;

    constructor(nDesktops: number) {
        // TODO: react to changes in number of desktops
        // TODO: support Plasma activities
        this.grids = new Array<Grid>(nDesktops);
        for (let i = 0; i < nDesktops; i++) {
            this.grids[i] = new Grid(this, i+1);
        }
        this.clientMap = new Map();
        this.minimizedTiled = new Set();
        this.lastFocusedClient = null;
        this.workspaceSignalManager = initWorkspaceSignalHandlers(this);
        this.screenResizedDelayer = new Delayer(1000, () => {
            // this delay ensures that docks get taken into account by `workspace.clientArea`
            const grids = this.grids; // workaround for bug in Qt5's JS engine
            for (const grid of grids) {
                grid.updateArea();
                grid.autoAdjustScroll();
                grid.arrange();
            }
        });
    }

    getGrid(desktopNumber: number) {
        console.assert(desktopNumber > 0);
        const desktopIndex = desktopNumber - 1;
        if (desktopIndex >= this.grids.length) {
            return null;
        }
        return this.grids[desktopNumber-1];
    }

    getCurrentGrid() {
        return this.grids[workspace.currentDesktop-1];
    }

    getClientGrid(client: AbstractClient) {
        return this.grids[client.desktop-1];
    }

    addClient(client: AbstractClient) {
        prepareClientForTiling(client);

        const grid = this.getClientGrid(client);
        const column = new Column(grid, grid.getLastFocusedColumn() ?? grid.getLastColumn());
        const window = new Window(client, column);

        const clientSignalManager = initClientSignalHandlers(this, window);
        this.clientMap.set(client, {
            window: window,
            signalManager: clientSignalManager,
            initialState: new ClientState(client),
        });

        grid.arrange();
    }

    removeClient(client: AbstractClient) {
        const clientData = this.clientMap.get(client);
        if (clientData === undefined) {
            return;
        }
        clientData.signalManager.disconnect();

        const window = clientData.window;
        const grid = window.column.grid;
        window.destroy(client === this.lastFocusedClient);
        grid.arrange();

        this.clientMap.delete(client);

        prepareClientForFloating(client);
        clientData.initialState.apply(client);
    }

    hasClient(client: AbstractClient) {
        return this.clientMap.has(client);
    }

    onClientFocused(client: AbstractClient) {
        this.doIfTiled(this.lastFocusedClient, (window, column, grid) => {
            window.onUnfocused();
        });
        this.lastFocusedClient = client;
    }

    doIfTiled(client: AbstractClient, f: (window: Window, column: Column, grid: Grid) => void) {
        const clientData = this.clientMap.get(client);
        if (clientData === undefined) {
            return;
        }
        const window = clientData.window;
        const column = window.column;
        const grid = column.grid;
        f(window, column, grid);
    }

    doIfTiledFocused(f: (window: Window, column: Column, grid: Grid) => void) {
        this.doIfTiled(workspace.activeClient, f);
    }

    getFocusedWindow() {
        const activeClient = workspace.activeClient;
        if (activeClient === null) {
            return null;
        }
        const clientData = this.clientMap.get(activeClient);
        if (clientData === undefined) {
            return null;
        }
        return clientData.window;
    }

    removeAllClients() {
        for (const client of this.clientMap.keys()) {
            this.removeClient(client);
        }
    }

    destroy() {
        this.workspaceSignalManager.disconnect();
        this.removeAllClients();
        for (const grid of this.grids) {
            grid.destroy();
        }
    }

    onScreenResized() {
        this.screenResizedDelayer.run();
    }
}

interface ClientData {
    window: Window;
    signalManager: SignalManager;
    initialState: ClientState;
}
