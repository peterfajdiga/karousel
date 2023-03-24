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
        this.signalManager = initClientTiledSignalHandlers(world, window);
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
        this.signalManager = this.initSignalManager(kwinClient);
        world.onScreenResized();
    }

    private initSignalManager(kwinClient: AbstractClient) {
        const world = this.world;
        const manager = new SignalManager();
        manager.connect(kwinClient.frameGeometryChanged, (kwinClient: TopLevel, oldGeometry: QRect) => {
            world.onScreenResized();
        });
        return manager;
    }

    destroy(passFocus: boolean) {
        this.signalManager.disconnect();
        this.world.onScreenResized();
    }
}
