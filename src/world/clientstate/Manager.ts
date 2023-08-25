namespace ClientState {
    export class Manager {
        private state: ClientState.State;

        constructor(initialState: ClientState.State) {
            this.state = initialState;
        }

        public setState(newState: ClientState.State, passFocus: boolean) {
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

    export type State = ClientState.Tiled | ClientState.TiledMinimized | ClientState.Floating | ClientState.Docked;

    export class TiledMinimized {
        public destroy(passFocus: boolean) {}
    }

    export class Floating {
        public destroy(passFocus: boolean) {}
    }
}
