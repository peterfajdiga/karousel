namespace ClientState {
    export class Floating implements State {
        constructor(client: ClientWrapper, limitHeight: boolean) {
            if (limitHeight && client.kwinClient.tile === null) {
                Floating.limitHeight(client);
            }
        }

        public destroy(passFocus: boolean) {}

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
