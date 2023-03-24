class World {
    private grids: Grid[];
    private clientMap: Map<AbstractClient, ClientData>;
    private lastFocusedClient: AbstractClient|null;
    private workspaceSignalManager: SignalManager;
    private windowRuleEnforcer: WindowRuleEnforcer;
    private screenResizedDelayer: Delayer;

    constructor() {
        // TODO: support Plasma activities
        this.clientMap = new Map();
        this.lastFocusedClient = null;
        this.workspaceSignalManager = initWorkspaceSignalHandlers(this);
        this.windowRuleEnforcer = new WindowRuleEnforcer(this, PREFER_FLOATING, PREFER_TILING);
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
        this.clientMap.set(kwinClient, new ClientData(new ClientStateTiled(this, kwinClient)));
    }

    removeClient(kwinClient: AbstractClient, passFocus: boolean) {
        const clientData = this.clientMap.get(kwinClient);
        if (clientData === undefined) {
            return;
        }
        clientData.destroy(passFocus && kwinClient === this.lastFocusedClient);
        this.clientMap.delete(kwinClient);
    }

    minimizeClient(kwinClient: AbstractClient) {
        const clientData = this.clientMap.get(kwinClient);
        if (clientData === undefined) {
            return;
        }
        if (clientData.getState() instanceof ClientStateTiled) {
            clientData.setState(new ClientStateTiledMinimized(), true);
        }
    }

    unminimizeClient(kwinClient: AbstractClient) {
        const clientData = this.clientMap.get(kwinClient);
        if (clientData === undefined) {
            return;
        }
        if (clientData.getState() instanceof ClientStateTiledMinimized) {
            clientData.setState(new ClientStateTiled(this, kwinClient), true);
        }
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

        const clientState = clientData.getState();
        if (clientState instanceof ClientStateTiled) {
            const window = clientState.window;
            const column = window.column;
            const grid = column.grid;
            f(window, column, grid);
        }
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
        const clientState = clientData.getState();
        if (clientState instanceof ClientStateTiled) {
            return clientState.window;
        } else {
            return null;
        }
    }

    removeAllClients() {
        for (const kwinClient of Array.from(this.clientMap.keys())) {
            this.removeClient(kwinClient, false);
        }
    }

    destroy() {
        this.workspaceSignalManager.disconnect();
        this.windowRuleEnforcer.destroy();
        this.removeAllClients();
        for (const grid of this.grids) {
            grid.destroy();
        }
    }

    onScreenResized() {
        this.screenResizedDelayer.run();
    }
}
