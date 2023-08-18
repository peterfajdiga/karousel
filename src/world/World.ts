class World {
    public readonly untileOnDrag: boolean;
    private readonly scrollViewManager: ScrollViewManager;
    private readonly clientMap: Map<AbstractClient, ClientWrapper>;
    private lastFocusedClient: AbstractClient|null;
    private readonly workspaceSignalManager: SignalManager;
    private readonly windowRuleEnforcer: WindowRuleEnforcer;
    private readonly screenResizedDelayer: Delayer;

    constructor(config: Config) {
        this.untileOnDrag = config.untileOnDrag;
        this.clientMap = new Map();
        this.lastFocusedClient = null;
        this.workspaceSignalManager = initWorkspaceSignalHandlers(this);

        let parsedWindowRules: WindowRule[] = [];
        try {
            parsedWindowRules = JSON.parse(config.windowRules);
        } catch (error: any) {
            console.log("failed to parse windowRules:", error);
        }
        this.windowRuleEnforcer = new WindowRuleEnforcer(this, parsedWindowRules);

        this.screenResizedDelayer = new Delayer(1000, () => {
            // this delay ensures that docks get taken into account by `workspace.clientArea`
            const gridManager = this.scrollViewManager; // workaround for bug in Qt5's JS engine
            for (const scrollView of gridManager.scrollViews()) {
                scrollView.arrange();
            }
        });

        this.scrollViewManager = new ScrollViewManager(
            this,
            {
                marginTop: config.gapsOuterTop,
                marginBottom: config.gapsOuterBottom,
                marginLeft: config.gapsOuterLeft,
                marginRight: config.gapsOuterRight,
                overscroll: config.overscroll,
            },
            config,
            workspace.currentActivity,
            workspace.desktops,
        );
        this.addExistingClients();
    }

    public updateDesktops() {
        this.scrollViewManager.setNDesktops(workspace.desktops);
    }

    private addExistingClients() {
        const kwinClients = workspace.clientList();
        for (let i = 0; i < kwinClients.length; i++) {
            const kwinClient = kwinClients[i];
            this.addClient(kwinClient);
        }
    }

    private getGrid(activity: string, desktopNumber: number) {
        console.assert(desktopNumber > 0 && desktopNumber <= workspace.desktops);
        return this.scrollViewManager.get(activity, desktopNumber).grid;
    }

    public getGridInCurrentActivity(desktopNumber: number) {
        return this.getGrid(workspace.currentActivity, desktopNumber);
    }

    public getCurrentGrid() {
        return this.getGrid(workspace.currentActivity, workspace.currentDesktop);
    }

    public getClientGrid(kwinClient: AbstractClient) {
        console.assert(kwinClient.activities.length === 1);
        return this.getGrid(kwinClient.activities[0], kwinClient.desktop);
    }

    public addClient(kwinClient: AbstractClient) {
        const client = new ClientWrapper(
            kwinClient,
            new ClientStateFloating(),
            this.findTransientFor(kwinClient),
            this.windowRuleEnforcer.initClientSignalManager(this, kwinClient),
        );
        this.clientMap.set(kwinClient, client);

        if (kwinClient.dock) {
            client.stateManager.setState(new ClientStateDocked(this, kwinClient), false);
        } else if (this.windowRuleEnforcer.shouldTile(kwinClient)) {
            client.stateManager.setState(new ClientStateTiled(this, client), false);
        }
    }

    public removeClient(kwinClient: AbstractClient, passFocus: boolean) {
        const client = this.clientMap.get(kwinClient);
        if (client === undefined) {
            return;
        }
        client.destroy(passFocus && kwinClient === this.lastFocusedClient);
        this.clientMap.delete(kwinClient);
    }

    private findTransientFor(kwinClient: AbstractClient) {
        if (!kwinClient.transient) {
            return null;
        }

        const transientFor = this.clientMap.get(kwinClient.transientFor);
        if (transientFor === undefined) {
            return null;
        }

        return transientFor;
    }

    public ensureFocusedTransientsVisible() {
        this.doIfTiledFocused(true, (window, column, grid) => {
            window.client.ensureTransientsVisible(grid.container.clientArea);
        });
    }

    public minimizeClient(kwinClient: AbstractClient) {
        const client = this.clientMap.get(kwinClient);
        if (client === undefined) {
            return;
        }
        if (client.stateManager.getState() instanceof ClientStateTiled) {
            client.stateManager.setState(new ClientStateTiledMinimized(), kwinClient === this.lastFocusedClient);
        }
    }

    public unminimizeClient(kwinClient: AbstractClient) {
        const client = this.clientMap.get(kwinClient);
        if (client === undefined) {
            return;
        }
        if (client.stateManager.getState() instanceof ClientStateTiledMinimized) {
            client.stateManager.setState(new ClientStateTiled(this, client), false);
        }
    }

    public tileClient(kwinClient: AbstractClient) {
        const client = this.clientMap.get(kwinClient);
        if (client === undefined) {
            return;
        }
        if (client.stateManager.getState() instanceof ClientStateTiled) {
            return;
        }
        client.stateManager.setState(new ClientStateTiled(this, client), false);
    }

    public untileClient(kwinClient: AbstractClient) {
        const client = this.clientMap.get(kwinClient);
        if (client === undefined) {
            return;
        }
        if (client.stateManager.getState() instanceof ClientStateTiled) {
            client.stateManager.setState(new ClientStateFloating(), false);
        }
    }

    public toggleFloatingClient(kwinClient: AbstractClient) {
        const client = this.clientMap.get(kwinClient);
        if (client === undefined) {
            return;
        }

        const clientState = client.stateManager.getState();
        if (clientState instanceof ClientStateFloating && Clients.canTileEver(kwinClient)) {
            Clients.makeTileable(kwinClient);
            client.stateManager.setState(new ClientStateTiled(this, client), false);
        } else if (clientState instanceof ClientStateTiled) {
            client.stateManager.setState(new ClientStateFloating(), false);
        }
    }

    public hasClient(kwinClient: AbstractClient) {
        return this.clientMap.has(kwinClient);
    }

    public onClientFocused(kwinClient: AbstractClient) {
        this.lastFocusedClient = kwinClient;
    }

    private findTiledWindow(client: ClientWrapper, followTransient: boolean): Window|null {
        const clientState = client.stateManager.getState();
        if (clientState instanceof ClientStateTiled) {
            return clientState.window;
        } else if (followTransient && client.transientFor !== null) {
            return this.findTiledWindow(client.transientFor, true);
        } else {
            return null;
        }
    }

    public doIfTiled(kwinClient: AbstractClient, followTransient: boolean, f: (window: Window, column: Column, grid: Grid) => void) {
        const client = this.clientMap.get(kwinClient);
        if (client === undefined) {
            return;
        }

        const window = this.findTiledWindow(client, followTransient);
        if (window === null) {
            return;
        }

        const column = window.column;
        const grid = column.grid;
        f(window, column, grid);
    }

    public doIfTiledFocused(followTransient: boolean, f: (window: Window, column: Column, grid: Grid) => void) {
        this.doIfTiled(workspace.activeClient, followTransient, f);
    }

    public getFocusedWindow() {
        const activeClient = workspace.activeClient;
        if (activeClient === null) {
            return null;
        }
        const client = this.clientMap.get(activeClient);
        if (client === undefined) {
            return null;
        }
        const clientState = client.stateManager.getState();
        if (clientState instanceof ClientStateTiled) {
            return clientState.window;
        } else {
            return null;
        }
    }

    private removeAllClients() {
        for (const kwinClient of Array.from(this.clientMap.keys())) {
            this.removeClient(kwinClient, false);
        }
    }

    public destroy() {
        this.workspaceSignalManager.destroy();
        this.removeAllClients();
        for (const scrollView of this.scrollViewManager.scrollViews()) {
            scrollView.destroy();
        }
    }

    public onScreenResized() {
        this.screenResizedDelayer.run();
    }
}
