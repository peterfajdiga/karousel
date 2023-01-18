function placeClient(client: AbstractClient, x: number, y: number, width: number, height: number) {
    client.frameGeometry = Qt.rect(x, y, width, height);
}

function focusClient(client: AbstractClient) {
    workspace.activeClient = client;
}

function shouldTile(client: AbstractClient) {
    // TODO: support windows on all desktops
    return client.normalWindow && client.desktop > 0 && !client.minimized;
}

class ClientState {
    width: number;
    height: number;
    keepBelow: boolean;
    keepAbove: boolean;

    constructor(client: AbstractClient) {
        this.width = client.frameGeometry.width;
        this.height = client.frameGeometry.height;
        this.keepAbove = client.keepAbove;
        this.keepBelow = client.keepBelow;
    }

    apply(client: AbstractClient) {
        const clientRect = client.frameGeometry;
        placeClient(
            client,
            clientRect.x + UNATTACH_OFFSET.x,
            clientRect.y + UNATTACH_OFFSET.y,
            this.width,
            this.height,
        );

        client.keepAbove = this.keepAbove;
        client.keepBelow = this.keepBelow;
    }
}