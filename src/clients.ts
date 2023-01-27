function placeClient(kwinClient: AbstractClient, x: number, y: number, width: number, height: number) {
    kwinClient.frameGeometry = Qt.rect(x, y, width, height);
}

function focusClient(kwinClient: AbstractClient) {
    workspace.activeClient = kwinClient;
}

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

    apply(kwinClient: AbstractClient, screenSize: QRect) {
        const clientRect = kwinClient.frameGeometry;
        placeClient(
            kwinClient,
            clamp(clientRect.x, screenSize.left, screenSize.right - this.width),
            clientRect.y,
            this.width,
            Math.min(this.height, Math.round(screenSize.height / 2)),
        );

        kwinClient.keepAbove = this.keepAbove;
        kwinClient.shade = false;
    }
}
