namespace ClientState {
    export class Floating implements State {
        private readonly client: ClientWrapper;
        private readonly config: ClientManager.Config;

        constructor(client: ClientWrapper, config: ClientManager.Config, limitHeight: boolean) {
            this.client = client;
            this.config = config;
            if (config.keepAbove) {
                client.kwinClient.keepAbove = true;
            }
            if (limitHeight && client.kwinClient.tile === null) {
                Floating.limitHeight(client);
            }
        }

        public destroy(passFocus: boolean) {
            if (this.config.keepAbove) {
                this.client.kwinClient.keepAbove = false;
            }
        }

        private static limitHeight(client: ClientWrapper) {
            const placementArea = workspace.clientArea(ClientAreaOption.PlacementArea, client.kwinClient.screen, client.kwinClient.desktop);
            const clientRect = client.kwinClient.frameGeometry;
            const width = client.preferredWidth;
            client.place(
                clientRect.x,
                clientRect.y,
                width,
                Math.min(clientRect.height, Math.round(placementArea.height / 2)),
            );
        }
    }
}
