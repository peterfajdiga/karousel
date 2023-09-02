namespace ClientState {
    export class Manager {
        private state: ClientState.State;

        constructor(initialState: ClientState.State) {
            this.state = initialState;
        }

        public setState(constructNewState: () => ClientState.State, passFocus: boolean) {
            this.state.destroy(passFocus);
            this.state = constructNewState();
        }

        public getState() {
            return this.state;
        }

        public destroy(passFocus: boolean) {
            this.state.destroy(passFocus);
        }
    }

    export type State = {
        destroy(passFocus: boolean): void;
    };
}
