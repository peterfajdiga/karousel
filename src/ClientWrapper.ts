class ClientWrapper {
    public kwinClient: AbstractClient;

    constructor(kwinClient: AbstractClient) {
        this.kwinClient = kwinClient;
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
}
