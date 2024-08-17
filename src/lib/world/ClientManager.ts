class ClientManager {
    private readonly world: World;
    private readonly config: ClientManager.Config;
    private readonly desktopManager: DesktopManager;
    private readonly pinManager: PinManager;
    private readonly clientMap: Map<KwinClient, ClientWrapper>;
    private lastFocusedClient: KwinClient|null;
    private readonly windowRuleEnforcer: WindowRuleEnforcer;

    constructor(config: Config, world: World, desktopManager: DesktopManager, pinManager: PinManager) {
        this.world = world;
        this.config = config;
        this.desktopManager = desktopManager;
        this.pinManager = pinManager;
        this.clientMap = new Map();
        this.lastFocusedClient = null;

        let parsedWindowRules: WindowRule[] = [];
        try {
            parsedWindowRules = JSON.parse(config.windowRules);
        } catch (error: any) {
            notificationInvalidWindowRules.sendEvent();
            log("failed to parse windowRules:", error);
        }
        this.windowRuleEnforcer = new WindowRuleEnforcer(parsedWindowRules);
    }

    public addClient(kwinClient: KwinClient) {
        console.assert(!this.hasClient(kwinClient));

        let constructState: (client: ClientWrapper) => ClientState.State;
        if (kwinClient.dock) {
            constructState = () => new ClientState.Docked(this.world, kwinClient);
        } else if (
            Clients.canTileEver(kwinClient) &&
            !kwinClient.fullScreen &&
            !Clients.isFullScreenGeometry(kwinClient) &&
            this.windowRuleEnforcer.shouldTile(kwinClient)
        ) {
            Clients.makeTileable(kwinClient);
            console.assert(Clients.canTileNow(kwinClient));
            const desktop = this.desktopManager.getDesktopForClient(kwinClient);
            console.assert(desktop !== undefined);
            constructState = (client: ClientWrapper) => new ClientState.Tiled(this.world, client, desktop!.grid);
        } else {
            constructState = (client: ClientWrapper) => new ClientState.Floating(this.world, client, this.config, false);
        }

        const client = new ClientWrapper(
            kwinClient,
            constructState,
            this.findTransientFor(kwinClient),
            this.windowRuleEnforcer.initClientSignalManager(this.world, kwinClient),
        );
        this.clientMap.set(kwinClient, client);
    }

    public removeClient(kwinClient: KwinClient, passFocus: boolean) {
        console.assert(this.hasClient(kwinClient));
        const client = this.clientMap.get(kwinClient);
        if (client === undefined) {
            return;
        }
        client.destroy(passFocus && kwinClient === this.lastFocusedClient);
        this.clientMap.delete(kwinClient);
    }

    private findTransientFor(kwinClient: KwinClient) {
        if (!kwinClient.transient) {
            return null;
        }

        const transientFor = this.clientMap.get(kwinClient.transientFor);
        if (transientFor === undefined) {
            return null;
        }

        return transientFor;
    }

    public minimizeClient(kwinClient: KwinClient) {
        const client = this.clientMap.get(kwinClient);
        if (client === undefined) {
            return;
        }
        if (client.stateManager.getState() instanceof ClientState.Tiled) {
            client.stateManager.setState(
                () => new ClientState.TiledMinimized(this.world, client),
                kwinClient === this.lastFocusedClient,
            );
        }
    }

    public tileClient(client: ClientWrapper, grid: Grid) {
        if (client.stateManager.getState() instanceof ClientState.Tiled) {
            return;
        }
        client.stateManager.setState(() => new ClientState.Tiled(this.world, client, grid), false);
    }

    public floatClient(client: ClientWrapper) {
        if (client.stateManager.getState() instanceof ClientState.Floating) {
            return;
        }
        client.stateManager.setState(() => new ClientState.Floating(this.world, client, this.config, true), false);
    }

    public tileKwinClient(kwinClient: KwinClient, grid: Grid) {
        const client = this.clientMap.get(kwinClient);
        if (client === undefined) {
            return;
        }
        this.tileClient(client, grid);
    }

    public floatKwinClient(kwinClient: KwinClient) {
        const client = this.clientMap.get(kwinClient);
        if (client === undefined) {
            return;
        }
        this.floatClient(client);
    }

    public pinClient(kwinClient: KwinClient) {
        const client = this.clientMap.get(kwinClient);
        if (client === undefined) {
            return;
        }
        if (client.getMaximizedMode() !== MaximizedMode.Unmaximized) {
            // the client is not really kwin-tiled, just maximized
            kwinClient.tile = null;
            return;
        }
        client.stateManager.setState(() => new ClientState.Pinned(this.world, this.pinManager, this.desktopManager, kwinClient, this.config), false);
        this.pinManager.addClient(kwinClient);
        for (const desktop of this.desktopManager.getDesktopsForClient(kwinClient)) {
            desktop.onPinsChanged();
        }
    }

    public unpinClient(kwinClient: KwinClient) {
        const client = this.clientMap.get(kwinClient);
        if (client === undefined) {
            return;
        }
        console.assert(client.stateManager.getState() instanceof ClientState.Pinned);
        client.stateManager.setState(() => new ClientState.Floating(this.world, client, this.config, false), false);
        this.pinManager.removeClient(kwinClient);
        for (const desktop of this.desktopManager.getDesktopsForClient(kwinClient)) {
            desktop.onPinsChanged();
        }
    }

    public toggleFloatingClient(kwinClient: KwinClient) {
        const client = this.clientMap.get(kwinClient);
        if (client === undefined) {
            return;
        }

        const clientState = client.stateManager.getState();
        if ((clientState instanceof ClientState.Floating || clientState instanceof ClientState.Pinned) && Clients.canTileEver(kwinClient)) {
            Clients.makeTileable(kwinClient);
            const desktop = this.desktopManager.getDesktopForClient(kwinClient);
            if (desktop === undefined) {
                return;
            }
            client.stateManager.setState(() => new ClientState.Tiled(this.world, client, desktop.grid), false);
        } else if (clientState instanceof ClientState.Tiled) {
            client.stateManager.setState(() => new ClientState.Floating(this.world, client, this.config, true), false);
        }
    }

    public hasClient(kwinClient: KwinClient) {
        return this.clientMap.has(kwinClient);
    }

    public onClientFocused(kwinClient: KwinClient) {
        this.lastFocusedClient = kwinClient;
        const window = this.findTiledWindow(kwinClient, true);
        if (window !== null) {
            window.onFocused();
        }
    }

    public findTiledWindow(kwinClient: KwinClient, followTransient: boolean) {
        const client = this.clientMap.get(kwinClient);
        if (client === undefined) {
            return null;
        }

        return this.findTiledWindowOfClient(client, followTransient);
    }

    private findTiledWindowOfClient(client: ClientWrapper, followTransient: boolean): Window|null {
        const clientState = client.stateManager.getState();
        if (clientState instanceof ClientState.Tiled) {
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

namespace ClientManager {
    export type Config = {
        floatingKeepAbove: boolean,
    }
}
