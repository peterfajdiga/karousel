class Window {
    public column: Column;
    public readonly client: ClientWrapper;
    public height: number;
    public readonly focusedState: Window.State;
    private skipArrange: boolean;

    constructor(client: ClientWrapper, column: Column) {
        this.client = client;
        this.height = client.kwinClient.frameGeometry.height;
        this.focusedState = {
            fullScreen: false,
            maximizedMode: MaximizedMode.Unmaximized,
        };
        this.skipArrange = false;
        this.column = column;
        column.onWindowAdded(this, true);
    }

    public moveToColumn(targetColumn: Column, bottom: boolean) {
        if (targetColumn === this.column) {
            return;
        }
        this.column.onWindowRemoved(this, false);
        this.column = targetColumn;
        targetColumn.onWindowAdded(this, bottom);
    }

    public arrange(x: number, y: number, width: number, height: number) {
        if (this.skipArrange) {
            // window is maximized, fullscreen, or being manually resized, prevent fighting with the user
            return;
        }

        let maximized = false;
        if (this.column.grid.config.reMaximize && this.isFocused()) {
            // do this here rather than in `onFocused` to ensure it happens after placement
            // (otherwise placement may not happen at all)
            if (this.focusedState.maximizedMode !== MaximizedMode.Unmaximized) {
                this.client.setMaximize(
                    this.focusedState.maximizedMode === MaximizedMode.Horizontally || this.focusedState.maximizedMode === MaximizedMode.Maximized,
                    this.focusedState.maximizedMode === MaximizedMode.Vertically || this.focusedState.maximizedMode === MaximizedMode.Maximized,
                );
                maximized = true;
            }
            if (this.focusedState.fullScreen) {
                this.client.setFullScreen(true);
                maximized = true;
            }
        }
        if (!maximized) {
            this.client.place(x, y, width, height);
        }
    }

    public focus() {
        if (this.client.isShaded()) {
            // workaround for KWin deactivating clients when unshading immediately after activation
            this.client.setShade(false);
        }
        this.client.focus();
    }

    public isFocused() {
        return this.client.isFocused();
    }

    public onFocused() {
        this.column.onWindowFocused(this);
    }

    public restoreToTiled() {
        if (this.isFocused()) {
            return;
        }
        this.client.setFullScreen(false);
        this.client.setMaximize(false, false);
        this.column.grid.desktop.onLayoutChanged();
    }

    public onMaximizedChanged(maximizedMode: MaximizedMode) {
        const maximized = maximizedMode !== MaximizedMode.Unmaximized;
        this.skipArrange = maximized;
        if (this.column.grid.config.tiledKeepBelow) {
            this.client.kwinClient.keepBelow = !maximized;
        }
        if (this.column.grid.config.maximizedKeepAbove) {
            this.client.kwinClient.keepAbove = maximized;
        }
        if (this.isFocused()) {
            this.focusedState.maximizedMode = maximizedMode;
        }
        this.column.grid.desktop.onLayoutChanged();
    }

    public onFullScreenChanged(fullScreen: boolean) {
        this.skipArrange = fullScreen;
        if (this.column.grid.config.tiledKeepBelow) {
            this.client.kwinClient.keepBelow = !fullScreen;
        }
        if (this.column.grid.config.maximizedKeepAbove) {
            this.client.kwinClient.keepAbove = fullScreen;
        }
        if (this.isFocused()) {
            this.focusedState.fullScreen = fullScreen;
        }
        this.column.grid.desktop.onLayoutChanged();
    }

    public onUserResize(
        oldGeometry: QmlRect,
        startWidth: number,
        neighbor?: { column: Column, startWidth: number },
    ) {
        const newGeometry = this.client.kwinClient.frameGeometry;
        const widthDelta = newGeometry.width - oldGeometry.width;
        const heightDelta = newGeometry.height - oldGeometry.height;
        if (widthDelta !== 0) {
            const resizingLeftSide = newGeometry.left !== oldGeometry.left;
            let widthDeltaTotal = newGeometry.width - startWidth;
            this.column.onUserResizeWidth(startWidth, widthDeltaTotal, resizingLeftSide, neighbor);
        }
        if (heightDelta !== 0) {
            this.column.adjustWindowHeight(this, heightDelta, newGeometry.y !== oldGeometry.y);
        }
    }

    public onFrameGeometryChanged() {
        const newGeometry = this.client.kwinClient.frameGeometry;
        this.column.setWidth(newGeometry.width, true);
        this.column.grid.desktop.onLayoutChanged();
    }

    public destroy(passFocus: boolean) {
        this.column.onWindowRemoved(this, passFocus);
    }
}

namespace Window {
    export type State = {
        fullScreen: boolean;
        maximizedMode: MaximizedMode;
    };
}
