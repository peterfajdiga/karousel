class ClientData {
    private state: ClientState;
    private rulesSignalManager: SignalManager | null;

    constructor(initialState: ClientState, rulesSignalManager: SignalManager | null) {
        this.state = initialState;
        this.rulesSignalManager = rulesSignalManager;
    }

    setState(newState: ClientState, passFocus: boolean) {
        this.state.destroy(passFocus);
        this.state = newState;
    }

    getState() {
        return this.state;
    }

    destroy(passFocus: boolean) {
        this.state.destroy(passFocus);
        if (this.rulesSignalManager !== null) {
            this.rulesSignalManager.disconnect();
        }
    }
}

type ClientState = ClientStateTiled | ClientStateTiledMinimized | ClientStateFloating;

class ClientStateTiled {
    window: Window;
    private signalManager: SignalManager;

    constructor(world: World, kwinClient: AbstractClient) {
        const client = new ClientWrapper(kwinClient);
        client.prepareForTiling();

        const grid = world.getClientGrid(kwinClient);
        const column = new Column(grid, grid.getLastFocusedColumn() ?? grid.getLastColumn());
        const window = new Window(client, column);
        grid.arrange();

        this.window = window;
        this.signalManager = ClientStateTiled.initSignalManager(world, window);
    }

    destroy(passFocus: boolean) {
        this.signalManager.disconnect();

        const window = this.window;
        const grid = window.column.grid;
        const clientWrapper = window.client;
        window.destroy(passFocus);
        grid.arrange();

        clientWrapper.prepareForFloating(grid.clientArea);
    }

    static initSignalManager(world: World, window: Window) {
        const client = window.client;
        const kwinClient = client.kwinClient;
        const manager = new SignalManager();

        manager.connect(kwinClient.desktopChanged, () => {
            if (kwinClient.desktop === -1) {
                // windows on all desktops are not supported
                world.removeClient(kwinClient, false);
            }
        });

        let lastResize = false;
        manager.connect(kwinClient.moveResizedChanged, () => {
            if (kwinClient.move) {
                world.removeClient(kwinClient, false);
                return;
            }

            const grid = window.column.grid;
            const resize = kwinClient.resize;
            if (!lastResize && resize) {
                grid.onUserResizeStarted();
            }
            if (lastResize && !resize) {
                grid.onUserResizeFinished();
            }
            lastResize = resize;
        });

        manager.connect(kwinClient.frameGeometryChanged, (kwinClient: TopLevel, oldGeometry: QRect) => {
            console.assert(!kwinClient.move, "moved clients are removed in kwinClient.moveResizedChanged");
            const grid = window.column.grid;
            if (kwinClient.resize) {
                window.onUserResize(oldGeometry);
                grid.arrange();
            } else {
                const maximized = rectEqual(kwinClient.frameGeometry, grid.clientArea);
                if (!client.isManipulatingGeometry() && !kwinClient.fullScreen && !maximized) {
                    window.onProgrammaticResize(oldGeometry);
                    grid.arrange();
                }
            }
        });

        return manager;
    }
}

class ClientStateTiledMinimized {
    destroy(passFocus: boolean) {}
}

class ClientStateFloating {
    destroy(passFocus: boolean) {}
}

class ClientStateDocked {
    private world: World;
    private signalManager: SignalManager;

    constructor(world: World, kwinClient: AbstractClient) {
        this.world = world;
        this.signalManager = ClientStateDocked.initSignalManager(world, kwinClient);
        world.onScreenResized();
    }

    destroy(passFocus: boolean) {
        this.signalManager.disconnect();
        this.world.onScreenResized();
    }

    private static initSignalManager(world: World, kwinClient: AbstractClient) {
        const manager = new SignalManager();
        manager.connect(kwinClient.frameGeometryChanged, (kwinClient: TopLevel, oldGeometry: QRect) => {
            world.onScreenResized();
        });
        return manager;
    }
}
