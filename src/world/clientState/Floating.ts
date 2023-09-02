namespace ClientState {
    export class Floating implements State {
        constructor(client: ClientWrapper | null) {
            if (client !== null && client.kwinClient.tile === null) {
                client.prepareForFloating();
            }
        }

        public destroy(passFocus: boolean) {}
    }
}
