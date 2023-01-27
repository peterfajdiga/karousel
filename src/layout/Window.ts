class Window {
    public column: Column;
    public client: ClientWrapper;
    public height: number;
    public focusedState: WindowState;
    private skipArrange: boolean;

    constructor(client: ClientWrapper, column: Column) {
        this.client = client;
        this.height = client.kwinClient.frameGeometry.height;
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

    arrange(x: number, y: number, width: number, height: number) {
        if (this.skipArrange) {
            // window is being manually resized, prevent fighting with the user
            return;
        }
        this.client.place(x, y, width, height);
        if (this.isFocused()) {
            // do this here rather than in `onFocused` to ensure it happens after placement
            // (otherwise placement may not happen at all)
            this.client.setMaximize(this.focusedState.maximizedVertically, this.focusedState.maximizedHorizontally);
            this.client.setFullScreen(this.focusedState.fullScreen);
        }
    }

    focus() {
        if (this.client.isShaded()) {
            // workaround for KWin deactivating clients when unshading immediately after activation
            this.client.setShade(false);
        }
        this.client.focus();
    }

    isFocused() {
        return this.client.isFocused();
    }

    onFocused() {
        this.column.onWindowFocused(this);
    }

    restoreToTiled() {
        if (this.isFocused()) {
            return;
        }
        this.client.setMaximize(false, false);
        this.client.setFullScreen(false);
    }

    onMaximizedChanged(horizontally: boolean, vertically: boolean) {
        const maximized = horizontally || vertically;
        this.skipArrange = maximized;
        this.client.kwinClient.keepBelow = !maximized;
        if (this.isFocused()) {
            this.focusedState.maximizedHorizontally = horizontally;
            this.focusedState.maximizedVertically = vertically;
        }
    }

    onFullScreenChanged(fullScreen: boolean) {
        this.skipArrange = fullScreen;
        if (this.isFocused()) {
            this.client.kwinClient.keepBelow = !fullScreen;
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
