class Window {
    public column: Column;
    public kwinClient: AbstractClient;
    public height: number;
    public preferredWidth: number;
    public focusedState: WindowState;
    private skipArrange: boolean;

    constructor(kwinClient: AbstractClient, column: Column) {
        this.kwinClient = kwinClient;
        this.height = kwinClient.frameGeometry.height;
        this.preferredWidth = kwinClient.frameGeometry.width;
        this.focusedState = {
            fullScreen: false,
            maximizedHorizontally: false,
            maximizedVertically: false,
        };
        this.skipArrange = false;
        this.column = column;
        column.onWindowAdded(this);
    }

    moveToColumn(targetColumn: Column) {
        this.column.onWindowRemoved(this, false);
        this.column = targetColumn;
        targetColumn.onWindowAdded(this);
    }

    place(x: number, y: number, width: number, height: number) {
        if (this.skipArrange || this.kwinClient.resize) {
            // window is being manually resized, prevent fighting with the user
            return;
        }
        placeClient(this.kwinClient, x, y, width, height);
        if (this.isFocused()) {
            // do this here rather than in `onFocused` to ensure it happens after placement
            // (otherwise placement may not happen at all)
            this.kwinClient.setMaximize(this.focusedState.maximizedVertically, this.focusedState.maximizedHorizontally);
            this.kwinClient.fullScreen = this.focusedState.fullScreen;
        }
    }

    focus() {
        if (this.kwinClient.shade) {
            // workaround for KWin deactivating clients when unshading immediately after activation
            this.kwinClient.shade = false;
        }
        focusClient(this.kwinClient);
    }

    isFocused() {
        return workspace.activeClient === this.kwinClient;
    }

    onFocused() {
        this.column.onWindowFocused(this);
    }

    restoreToTiled() {
        if (this.isFocused()) {
            return;
        }
        this.kwinClient.setMaximize(false, false);
        this.kwinClient.fullScreen = false;
    }

    onMaximizedChanged(horizontally: boolean, vertically: boolean) {
        const maximized = horizontally || vertically;
        this.skipArrange = maximized;
        this.kwinClient.keepBelow = !maximized;
        if (this.isFocused()) {
            this.focusedState.maximizedHorizontally = horizontally;
            this.focusedState.maximizedVertically = vertically;
        }
    }

    onFullScreenChanged(fullScreen: boolean) {
        this.skipArrange = fullScreen;
        if (this.isFocused()) {
            this.kwinClient.keepBelow = !fullScreen;
            this.focusedState.fullScreen = fullScreen;
        }
    }

    destroy(passFocus: boolean) {
        this.column.onWindowRemoved(this, passFocus);
    }
}

type WindowState = {
    fullScreen: boolean,
    maximizedHorizontally: boolean,
    maximizedVertically: boolean,
}
