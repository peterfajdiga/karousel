class Window {
    public column: Column;
    public readonly client: ClientWrapper;
    public height: number;
    public readonly focusedState: Window.State;
    private skipArrange: boolean;

    constructor(client: ClientWrapper, column: Column) {
        this.client = client;
        this.height = client.kwinClient.frameGeometry.height;

        let maximizedMode = this.client.getMaximizedMode();
        if (maximizedMode === undefined) {
            maximizedMode = MaximizedMode.Unmaximized; // defaulting to unmaximized, as this is set in Tiled.prepareClientForTiling
        }
        this.focusedState = {
            fullScreen: this.client.kwinClient.fullScreen,
            maximizedMode: maximizedMode,
        };

        this.skipArrange = this.client.kwinClient.fullScreen || maximizedMode !== MaximizedMode.Unmaximized;
        this.column = column;
        column.onWindowAdded(this, true);
    }

    public moveToColumn(targetColumn: Column, bottom: boolean) {
        if (targetColumn === this.column) {
            return;
        }
        this.column.onWindowRemoved(this, this.isFocused() && targetColumn.grid !== this.column.grid);
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
        this.client.focus();
    }

    public isFocused() {
        return this.client.isFocused();
    }

    public onFocused() {
        if (this.column.grid.config.reMaximize && (
            this.focusedState.maximizedMode !== MaximizedMode.Unmaximized ||
            this.focusedState.fullScreen
        )) {
            // We need to maximize/fullscreen this window, but we can't do it here.
            // We need to do it in `arrange` to ensure it happens after placement.
            this.column.grid.desktop.forceArrange();
        }
        this.column.onWindowFocused(this);
    }

    public restoreToTiled() {
        if (this.isFocused()) {
            return;
        }
        this.client.setFullScreen(false);
        this.client.setMaximize(false, false);
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
