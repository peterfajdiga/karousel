class ClientManager {
    private readonly config: ClientManager.Config;
    private readonly clientMap: Map<KwinClient, ClientWrapper>;
    private lastFocusedClient: KwinClient|null;
    private previousFocusedClient: KwinClient|null; // the client that was focused before `lastFocusedClient`
    private readonly windowRuleEnforcer: WindowRuleEnforcer;

    constructor(
        config: Config,
        private readonly world: World,
        private readonly desktopManager: DesktopManager,
        private readonly pinManager: PinManager,
    ) {
        this.world = world;
        this.config = config;
        this.desktopManager = desktopManager;
        this.pinManager = pinManager;
        this.clientMap = new Map();
        this.lastFocusedClient = null;
        this.previousFocusedClient = null;

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
        let desktop: Desktop | undefined;
        if (kwinClient.dock) {
            constructState = () => new ClientState.Docked(this.world, kwinClient);
        } else if (
            Clients.canTileEver(kwinClient) &&
            this.windowRuleEnforcer.shouldTile(kwinClient) &&
            (desktop = this.desktopManager.getDesktopForClient(kwinClient)) !== undefined
        ) {
            Clients.makeTileable(kwinClient);
            console.assert(Clients.canTileNow(kwinClient));
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

    public removeClient(kwinClient: KwinClient, passFocus: FocusPassing.Type) {
        console.assert(this.hasClient(kwinClient));
        const client = this.clientMap.get(kwinClient);
        if (client === undefined) {
            return;
        }
        if (!this.wasLastFocused(kwinClient)) {
            passFocus = FocusPassing.Type.None;
        }
        client.destroy(passFocus);
        this.clientMap.delete(kwinClient);
    }

    private findTransientFor(kwinClient: KwinClient) {
        if (!kwinClient.transient || kwinClient.transientFor === null) {
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
            const passFocus = this.wasLastFocused(kwinClient) ? FocusPassing.Type.Immediate : FocusPassing.Type.None;
            client.stateManager.setState(
                () => new ClientState.TiledMinimized(this.world, client),
                passFocus,
            );
        }
    }

    public tileClient(client: ClientWrapper, grid: Grid) {
        if (client.stateManager.getState() instanceof ClientState.Tiled) {
            return;
        }
        client.stateManager.setState(() => new ClientState.Tiled(this.world, client, grid), FocusPassing.Type.None);
    }

    public floatClient(client: ClientWrapper) {
        if (client.stateManager.getState() instanceof ClientState.Floating) {
            return;
        }
        client.stateManager.setState(() => new ClientState.Floating(this.world, client, this.config, true), FocusPassing.Type.None);
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
        client.stateManager.setState(() => new ClientState.Pinned(this.world, this.pinManager, this.desktopManager, kwinClient, this.config), FocusPassing.Type.None);
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
        client.stateManager.setState(() => new ClientState.Floating(this.world, client, this.config, false), FocusPassing.Type.None);
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
            client.stateManager.setState(() => new ClientState.Tiled(this.world, client, desktop.grid), FocusPassing.Type.None);
        } else if (clientState instanceof ClientState.Tiled) {
            client.stateManager.setState(() => new ClientState.Floating(this.world, client, this.config, true), FocusPassing.Type.None);
        }
    }

    public hasClient(kwinClient: KwinClient) {
        return this.clientMap.has(kwinClient);
    }

    public onClientFocused(kwinClient: KwinClient) {
        if (kwinClient !== this.lastFocusedClient) {
            this.previousFocusedClient = this.lastFocusedClient;
            this.lastFocusedClient = kwinClient;
        }
        const window = this.findTiledWindow(kwinClient);
        if (window === null) {
            return;
        }

        window.onFocused();
        if (this.config.cursorFollowsFocus) {
            this.moveCursorToWindow(window);
        }
    }

    // Whether `kwinClient` is the client the user was most recently working in
    private wasLastFocused(kwinClient: KwinClient) {
        if (kwinClient === this.lastFocusedClient) {
            return true;
        }
        // When the active window gets closed or minimized, KWin activates another window before emitting
        // `windowRemoved` or `minimizedChanged`.
        // If it finds no suitable window (e.g. because all other windows are entirely off-screen, see issue 136),
        // it falls back to activating the desktop window. In that case the closed window is still the one
        // the user was working in, so we should still pass focus from it.
        return this.lastFocusedClient !== null &&
            this.lastFocusedClient.desktopWindow &&
            kwinClient === this.previousFocusedClient;
    }

    public findTiledWindow(kwinClient: KwinClient) {
        const client = this.clientMap.get(kwinClient);
        if (client === undefined) {
            return null;
        }

        return this.findTiledWindowOfClient(client);
    }

    private findTiledWindowOfClient(client: ClientWrapper): Window|null {
        const clientState = client.stateManager.getState();
        if (clientState instanceof ClientState.Tiled) {
            return clientState.window;
        } else if (client.transientFor !== null) {
            return this.findTiledWindowOfClient(client.transientFor);
        } else {
            return null;
        }
    }

    private removeAllClients() {
        for (const kwinClient of Array.from(this.clientMap.keys())) {
            this.removeClient(kwinClient, FocusPassing.Type.None);
        }
    }

    public destroy() {
        this.removeAllClients();
    }

    private moveCursorToWindow(window: Window) {
        const cursorAlreadyOnWindow = rectContainsPoint(roundQtRect(window.client.kwinClient.frameGeometry), Workspace.cursorPos);
        if (cursorAlreadyOnWindow) {
            return;
        }
        moveCursorToFocus.call();
    }
}

namespace ClientManager {
    export interface Config {
        floatingKeepAbove: boolean;
        cursorFollowsFocus: boolean;
    }
}
