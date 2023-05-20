class Window {
    public column: Column;
    public readonly client: ClientWrapper;
    public height: number;
    public readonly focusedState: WindowState;
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
        if (targetColumn === this.column) {
            return;
        }
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

    onUserResize(oldGeometry: QRect) {
        const newGeometry = this.client.kwinClient.frameGeometry;
        const widthDelta = newGeometry.width - oldGeometry.width;
        const heightDelta = newGeometry.height - oldGeometry.height;
        if (widthDelta !== 0) {
            this.column.adjustWidth(widthDelta, true);
            if (newGeometry.x !== oldGeometry.x) {
                this.column.grid.adjustScroll(widthDelta, true);
            }
        }
        if (heightDelta !== 0) {
            this.column.adjustWindowHeight(this, heightDelta, newGeometry.y !== oldGeometry.y);
        }
    }

    onProgrammaticResize(oldGeometry: QRect) {
        const newGeometry = this.client.kwinClient.frameGeometry;
        this.column.setWidth(newGeometry.width, true);
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
