namespace ClientState {
    export class Manager {
        private state: State;

        constructor(initialState: State) {
            this.state = initialState;
        }

        public setState(constructNewState: () => State, passFocus: boolean) {
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

    export interface State {
        destroy(passFocus: boolean): void;
    }
}
