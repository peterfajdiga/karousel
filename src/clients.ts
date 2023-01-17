function placeClient(client: AbstractClient, x: number, y: number, width: number, height: number) {
    client.frameGeometry = Qt.rect(x, y, width, height);
}

function focusClient(client: AbstractClient) {
    workspace.activeClient = client;
}
