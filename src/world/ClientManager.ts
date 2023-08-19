class ClientManager {
    private readonly world: World;
    private readonly desktopManager: DesktopManager;
    private readonly clientMap: Map<AbstractClient, ClientWrapper>;
    private lastFocusedClient: AbstractClient|null;
    private readonly windowRuleEnforcer: WindowRuleEnforcer;

    constructor(config: Config, world: World, desktopManager: DesktopManager) {
        this.world = world;
        this.desktopManager = desktopManager;
        this.clientMap = new Map();
        this.lastFocusedClient = null;

        let parsedWindowRules: WindowRule[] = [];
        try {
            parsedWindowRules = JSON.parse(config.windowRules);
        } catch (error: any) {
            console.log("failed to parse windowRules:", error);
        }
        this.windowRuleEnforcer = new WindowRuleEnforcer(parsedWindowRules);
    }

    public addClient(kwinClient: AbstractClient) {
        console.assert(!this.hasClient(kwinClient));
        const client = new ClientWrapper(
            kwinClient,
            new ClientStateFloating(),
            this.findTransientFor(kwinClient),
            this.windowRuleEnforcer.initClientSignalManager(this.world, kwinClient),
        );
        this.clientMap.set(kwinClient, client);

        if (kwinClient.dock) {
            client.stateManager.setState(new ClientStateDocked(this.world, kwinClient), false);
        } else if (this.windowRuleEnforcer.shouldTile(kwinClient)) {
            const grid = this.desktopManager.getDesktopForClient(client.kwinClient).grid;
            client.stateManager.setState(new ClientStateTiled(this.world, client, grid), false);
        }
    }

    public removeClient(kwinClient: AbstractClient, passFocus: boolean) {
        console.assert(this.hasClient(kwinClient));
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
            const grid = this.desktopManager.getDesktopForClient(client.kwinClient).grid;
            client.stateManager.setState(new ClientStateTiled(this.world, client, grid), false);
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
        const grid = this.desktopManager.getDesktopForClient(client.kwinClient).grid;
        client.stateManager.setState(new ClientStateTiled(this.world, client, grid), false);
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
            const grid = this.desktopManager.getDesktopForClient(client.kwinClient).grid;
            client.stateManager.setState(new ClientStateTiled(this.world, client, grid), false);
        } else if (clientState instanceof ClientStateTiled) {
            client.stateManager.setState(new ClientStateFloating(), false);
        }
    }

    public hasClient(kwinClient: AbstractClient) {
        return this.clientMap.has(kwinClient);
    }

    public onClientFocused(kwinClient: AbstractClient) {
        this.lastFocusedClient = kwinClient;
        const window = this.findTiledWindow(kwinClient, true);
        if (window !== null) {
            window.onFocused();
        }
    }

    public findTiledWindow(kwinClient: AbstractClient, followTransient: boolean) {
        const client = this.clientMap.get(kwinClient);
        if (client === undefined) {
            return null;
        }

        return this.findTiledWindowOfClient(client, followTransient);
    }

    private findTiledWindowOfClient(client: ClientWrapper, followTransient: boolean): Window|null {
        const clientState = client.stateManager.getState();
        if (clientState instanceof ClientStateTiled) {
            return clientState.window;
        } else if (followTransient && client.transientFor !== null) {
            return this.findTiledWindowOfClient(client.transientFor, true);
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
        this.removeAllClients();
    }
}
