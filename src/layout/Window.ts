class Window {
    public column: Column;
    public readonly client: ClientWrapper;
    public height: number;
    private skipArrange: boolean;

    constructor(client: ClientWrapper, column: Column) {
        this.client = client;
        this.height = client.kwinClient.frameGeometry.height;
        this.skipArrange = false;
        this.column = column;
        column.onWindowAdded(this);
    }

    public moveToColumn(targetColumn: Column) {
        if (targetColumn === this.column) {
            return;
        }
        this.column.onWindowRemoved(this, false);
        this.column = targetColumn;
        targetColumn.onWindowAdded(this);
    }

    public arrange(x: number, y: number, width: number, height: number) {
        if (this.skipArrange) {
            // window is maximized, fullscreen, or being manually resized, prevent fighting with the user
            return;
        }
        this.client.place(x, y, width, height);
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

    public onMaximizedChanged(horizontally: boolean, vertically: boolean) {
        const maximized = horizontally || vertically;
        this.skipArrange = maximized;
        if (this.column.grid.config.tiledKeepBelow) {
            this.client.kwinClient.keepBelow = !maximized;
        }
        if (this.column.grid.config.maximizedKeepAbove) {
            this.client.kwinClient.keepAbove = maximized;
        }
    }

    public onFullScreenChanged(fullScreen: boolean) {
        this.skipArrange = fullScreen;
        if (this.column.grid.config.tiledKeepBelow) {
            this.client.kwinClient.keepBelow = !fullScreen;
        }
        if (this.column.grid.config.maximizedKeepAbove) {
            this.client.kwinClient.keepAbove = fullScreen;
        }
    }

    public onUserResize(oldGeometry: QRect, resizeNeighborColumn: boolean) {
        const newGeometry = this.client.kwinClient.frameGeometry;
        const widthDelta = newGeometry.width - oldGeometry.width;
        const heightDelta = newGeometry.height - oldGeometry.height;
        if (widthDelta !== 0) {
            this.column.adjustWidth(widthDelta, true);
            let leftEdgeDelta = newGeometry.left - oldGeometry.left;
            const resizingLeftSide = leftEdgeDelta !== 0;
            if (resizeNeighborColumn && this.column.grid.config.resizeNeighborColumn) {
                const neighborColumn = resizingLeftSide ? this.column.grid.getPrevColumn(this.column) : this.column.grid.getNextColumn(this.column);
                if (neighborColumn !== null) {
                    const oldNeighborWidth = neighborColumn.getWidth();
                    neighborColumn.adjustWidth(-widthDelta, true);
                    if (resizingLeftSide) {
                        leftEdgeDelta -= neighborColumn.getWidth() - oldNeighborWidth;
                    }
                }
            }
            this.column.grid.desktop.adjustScroll(-leftEdgeDelta, true);
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
