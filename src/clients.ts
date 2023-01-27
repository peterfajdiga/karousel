function canTile(kwinClient: AbstractClient) {
    // TODO: support windows on all desktops
    return !kwinClient.minimized && kwinClient.desktop > 0;
}

function shouldTile(kwinClient: AbstractClient) {
    return canTile(kwinClient) && kwinClient.normalWindow && kwinClient.managed && !PREFER_FLOATING.matches(kwinClient);
}

function prepareClientForTiling(kwinClient: AbstractClient) {
    kwinClient.keepBelow = true;
    kwinClient.fullScreen = false;
    kwinClient.setMaximize(false, false);
}

function prepareClientForFloating(kwinClient: AbstractClient) {
    kwinClient.keepBelow = false;
    kwinClient.setMaximize(false, false);
}

class ClientState {
    width: number;
    height: number;
    keepAbove: boolean;

    constructor(kwinClient: AbstractClient) {
        this.width = kwinClient.frameGeometry.width;
        this.height = kwinClient.frameGeometry.height;
        this.keepAbove = kwinClient.keepAbove;
    }

    apply(client: ClientWrapper, screenSize: QRect) {
        const clientRect = client.kwinClient.frameGeometry;
        client.place(
            clamp(clientRect.x, screenSize.left, screenSize.right - this.width),
            clientRect.y,
            this.width,
            Math.min(this.height, Math.round(screenSize.height / 2)),
        );

        client.kwinClient.keepAbove = this.keepAbove;
        client.setShade(false);
    }
}
