class World {
    private grids: Grid[];
    private clientMap: Map<AbstractClient, ClientData>;
    public minimizedTiled: Set<AbstractClient>; // TODO: implement using `clientMap`
    private lastFocusedClient: AbstractClient|null;
    private workspaceSignalManager: SignalManager;
    private screenResizedDelayer: Delayer;

    constructor() {
        // TODO: support Plasma activities
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
        this.grids = [];
        this.updateDesktops();
    }

    updateDesktops() {
        const oldDesktopCount = this.grids.length;
        const newDesktopCount = workspace.desktops;
        if (newDesktopCount > oldDesktopCount) {
            for (let i = oldDesktopCount; i < newDesktopCount; i++) {
                this.grids.push(new Grid(this, i+1));
            }
        } else if (newDesktopCount < oldDesktopCount) {
            const evacuationGrid = this.grids[newDesktopCount-1];
            const nRemovedDesktops = oldDesktopCount - newDesktopCount;
            for (let i = 0; i < nRemovedDesktops; i++) {
                const removedGrid = this.grids.pop();
                if (removedGrid === undefined) {
                    throw new Error("this.grids.pop returned undefined");
                }
                removedGrid.evacuate(evacuationGrid);
                removedGrid.destroy();
            }
        }
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

    getClientGrid(kwinClient: AbstractClient) {
        return this.grids[kwinClient.desktop-1];
    }

    addClient(kwinClient: AbstractClient) {
        const client = new ClientWrapper(kwinClient);
        client.prepareForTiling();

        const grid = this.getClientGrid(kwinClient);
        const column = new Column(grid, grid.getLastFocusedColumn() ?? grid.getLastColumn());
        const window = new Window(client, column);

        const clientSignalManager = initClientSignalHandlers(this, window);
        this.clientMap.set(kwinClient, {
            window: window,
            signalManager: clientSignalManager,
        });

        grid.arrange();
    }

    removeClient(kwinClient: AbstractClient, passFocus: boolean) {
        const clientData = this.clientMap.get(kwinClient);
        if (clientData === undefined) {
            return;
        }
        clientData.signalManager.disconnect();

        const window = clientData.window;
        const grid = window.column.grid;
        const clientWrapper = window.client;
        window.destroy(passFocus && kwinClient === this.lastFocusedClient);
        grid.arrange();

        this.clientMap.delete(kwinClient);

        clientWrapper.prepareForFloating(grid.area);
    }

    hasClient(kwinClient: AbstractClient) {
        return this.clientMap.has(kwinClient);
    }

    onClientFocused(kwinClient: AbstractClient) {
        this.lastFocusedClient = kwinClient;
    }

    doIfTiled(kwinClient: AbstractClient, f: (window: Window, column: Column, grid: Grid) => void) {
        const clientData = this.clientMap.get(kwinClient);
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
        for (const kwinClient of this.clientMap.keys()) {
            this.removeClient(kwinClient, false);
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
}
