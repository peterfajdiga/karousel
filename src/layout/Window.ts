class Window {
    public column: Column;
    public client: AbstractClient;
    public height: number;
    public preferredWidth: number;
    public focusedState: WindowState;
    private skipArrange: boolean;

    constructor(client: AbstractClient, column: Column) {
        this.client = client;
        this.height = client.frameGeometry.height;
        this.preferredWidth = client.frameGeometry.width;
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
        if (this.skipArrange || this.client.resize) {
            // window is being manually resized, prevent fighting with the user
            return;
        }
        this.client.shade = false;
        placeClient(this.client, x, y, width, height);
        if (this.isFocused()) {
            // do this here rather than in `onFocused` to ensure it happens after placement
            // (otherwise placement may not happen at all)
            this.client.setMaximize(this.focusedState.maximizedVertically, this.focusedState.maximizedHorizontally);
            this.client.fullScreen = this.focusedState.fullScreen;
        }
    }

    placeShaded(x: number, y: number, width: number) {
        if (this.skipArrange || this.client.resize) {
            // window is being manually resized, prevent fighting with the user
            return;
        }
        this.client.shade = true;
        placeClient(this.client, x, y, width, this.height);
    }

    focus() {
        if (this.client.shade) {
            // workaround for KWin deactivating clients when unshading immediately after activation
            this.client.shade = false;
        }
        focusClient(this.client);
    }

    isFocused() {
        return workspace.activeClient === this.client;
    }

    onFocused() {
        this.column.onWindowFocused(this);
    }

    onUnfocused() {
        this.client.setMaximize(false, false);
        this.client.fullScreen = false;
    }

    onMaximizedChanged(horizontally: boolean, vertically: boolean) {
        const maximized = horizontally || vertically;
        this.skipArrange = maximized;
        this.client.keepBelow = !maximized;
        if (this.isFocused()) {
            this.focusedState.maximizedHorizontally = horizontally;
            this.focusedState.maximizedVertically = vertically;
        }
    }

    onFullScreenChanged(fullScreen: boolean) {
        this.skipArrange = fullScreen;
        if (this.isFocused()) {
            this.client.keepBelow = !fullScreen;
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
