class ClientStateManager {
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

type ClientState = ClientStateTiled | ClientStateTiledMinimized | ClientStateFloating;

class ClientStateTiledMinimized {
    destroy(passFocus: boolean) {}
}

class ClientStateFloating {
    destroy(passFocus: boolean) {}
}
