class ClientData {
    private state: ClientState;

    constructor(initialState: ClientState) {
        this.state = initialState;
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
    }
}

type ClientState = ClientStateTiled | ClientStateTiledMinimized;

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
