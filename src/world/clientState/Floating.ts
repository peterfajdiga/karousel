namespace ClientState {
    export class Floating implements State {
        constructor(client: ClientWrapper | null) {
            if (client !== null && client.kwinClient.tile === null) {
                Floating.prepareClientForFloating(client);
            }
        }

        public destroy(passFocus: boolean) {}

        private static prepareClientForFloating(client: ClientWrapper) {
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
