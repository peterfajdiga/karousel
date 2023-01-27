class ClientWrapper {
    public kwinClient: AbstractClient;
    public preferredWidth: number;

    constructor(kwinClient: AbstractClient) {
        this.kwinClient = kwinClient;
        this.preferredWidth = kwinClient.frameGeometry.width;
    }

    place(x: number, y: number, width: number, height: number) {
        if (this.kwinClient.resize) {
            // window is being manually resized, prevent fighting with the user
            return;
        }
        this.kwinClient.frameGeometry = Qt.rect(x, y, width, height);
    }

    focus() {
        workspace.activeClient = this.kwinClient;
    }

    isFocused() {
        return workspace.activeClient === this.kwinClient;
    }

    setMaximize(horizontally: boolean, vertically: boolean) {
        this.kwinClient.setMaximize(vertically, horizontally);
    }

    setFullScreen(fullScreen: boolean) {
        this.kwinClient.fullScreen = fullScreen;
    }

    setShade(shade: boolean) {
        this.kwinClient.shade = shade;
    }

    isShaded() {
        return this.kwinClient.shade;
    }

    prepareForTiling() {
        this.kwinClient.keepBelow = true;
        this.setFullScreen(false);
        this.setMaximize(false, false);
    }

    prepareForFloating(screenSize: QRect) {
        this.kwinClient.keepBelow = false;
        this.setShade(false);
        this.setFullScreen(false);
        this.setMaximize(false, false);

        const clientRect = this.kwinClient.frameGeometry;
        this.place(
            clamp(clientRect.x, screenSize.left, screenSize.right - clientRect.width),
            clientRect.y,
            clientRect.width, // TODO: use preferred width
            Math.min(clientRect.height, Math.round(screenSize.height / 2)),
        );
    }
}
