function placeClient(client: AbstractClient, x: number, y: number, width: number, height: number) {
    client.frameGeometry = Qt.rect(x, y, width, height);
}

function focusClient(client: AbstractClient) {
    workspace.activeClient = client;
}

function canTile(client: AbstractClient) {
    // TODO: support windows on all desktops
    return !client.minimized && client.desktop > 0;
}

function shouldTile(client: AbstractClient) {
    return canTile(client) && client.normalWindow && !PREFER_FLOATING.matches(client);
}

function prepareClientForTiling(client: AbstractClient) {
    client.keepBelow = true;
    client.fullScreen = false;
    client.setMaximize(false, false);
}

function prepareClientForFloating(client: AbstractClient) {
    client.keepBelow = false;
    client.setMaximize(false, false);
}

class ClientState {
    width: number;
    height: number;
    keepAbove: boolean;

    constructor(client: AbstractClient) {
        this.width = client.frameGeometry.width;
        this.height = client.frameGeometry.height;
        this.keepAbove = client.keepAbove;
    }

    apply(client: AbstractClient, screenSize: QRect) {
        const clientRect = client.frameGeometry;
        placeClient(
            client,
            clamp(clientRect.x, screenSize.left, screenSize.right - this.width),
            clientRect.y,
            this.width,
            Math.min(this.height, Math.round(screenSize.height / 2)),
        );

        client.keepAbove = this.keepAbove;
    }
}
