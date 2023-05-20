class ClientData {
    private state: ClientState;
    private readonly rulesSignalManager: SignalManager | null;

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
            this.rulesSignalManager.destroy();
        }
    }
}

type ClientState = ClientStateTiled | ClientStateTiledMinimized | ClientStateFloating;

class ClientStateTiledMinimized {
    destroy(passFocus: boolean) {}
}

class ClientStateFloating {
    destroy(passFocus: boolean) {}
}
