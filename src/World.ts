class World {
    private grids: Grid[];
    private clientMap: Map<number, ClientData>;
    public minimizedTiled: Set<number>; // TODO: implement using `clientMap`
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
        this.workspaceSignalManager = initWorkspaceSignalHandlers(this);
        this.screenResizedDelayer = new Delayer(150, () => {
            const grids = this.grids; // workaround for bug in Qt5's JS engine
            for (const grid of grids) {
                grid.updateArea();
                grid.autoAdjustScroll();
                grid.arrange();
            }
        }); // this delay ensures that docks get taken into account by `workspace.clientArea`
    }

    getGrid(desktop: number) {
        console.assert(desktop > 0);
        return this.grids[desktop-1];
    }

    addClient(id: number, client: AbstractClient) {
        const grid = this.getGrid(client.desktop);
        const column = new Column(grid, grid.getLastColumn());
        const window = new Window(client, column);

        prepareClientForTiling(client);
        const clientSignalManager = initClientSignalHandlers(this, window);
        this.clientMap.set(id, {
            window: window,
            signalManager: clientSignalManager,
            initialState: new ClientState(client),
        });

        grid.arrange();
    }

    removeClient(id: number) {
        const clientData = this.clientMap.get(id);
        if (clientData === undefined) {
            return;
        }
        clientData.signalManager.disconnect();

        const window = clientData.window;
        const grid = window.column.grid;
        window.destroy();
        grid.arrange();

        this.clientMap.delete(id);

        const client = window.client;
        prepareClientForFloating(client);
        clientData.initialState.apply(client);
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
        const grid = column.grid;
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
