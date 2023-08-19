class ClientStateManager {
    private state: ClientState;

    constructor(initialState: ClientState) {
        this.state = initialState;
    }

    public setState(newState: ClientState, passFocus: boolean) {
        this.state.destroy(passFocus);
        this.state = newState;
    }

    public getState() {
        return this.state;
    }

    public destroy(passFocus: boolean) {
        this.state.destroy(passFocus);
    }
}

type ClientState = ClientStateTiled | ClientStateTiledMinimized | ClientStateFloating | ClientStateDocked;

class ClientStateTiledMinimized {
    public destroy(passFocus: boolean) {}
}

class ClientStateFloating {
    public destroy(passFocus: boolean) {}
}
