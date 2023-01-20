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
        targetColumn.onWindowAdded(this);
        this.column = targetColumn;
    }

    arrange(x: number, y: number, width: number) {
        if (this.skipArrange || this.client.resize) {
            // window is being manually resized, prevent fighting with the user
            return;
        }
        placeClient(this.client, x, y, width, this.height);
    }

    focus() {
        focusClient(this.client);
    }

    isFocused() {
        return workspace.activeClient === this.client;
    }

    onFocused() {
        this.column.onWindowFocused(this);
        this.client.setMaximize(this.focusedState.maximizedVertically, this.focusedState.maximizedHorizontally);
        this.client.fullScreen = this.focusedState.fullScreen;
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
