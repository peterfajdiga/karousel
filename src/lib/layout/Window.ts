class Window {
    public column: Column;
    public readonly client: ClientWrapper;
    public height: number;
    public readonly focusedState: Window.State;
    private skipArrange: boolean;

    constructor(client: ClientWrapper, column: Column) {
        this.client = client;
        this.height = client.kwinClient.frameGeometry.height.round();

        let maximizedMode = this.client.getMaximizedMode();
        if (maximizedMode === undefined) {
            maximizedMode = MaximizedMode.Unmaximized; // defaulting to unmaximized, as this is set in Tiled.prepareClientForTiling
        }
        this.focusedState = {
            fullScreen: this.client.kwinClient.fullScreen,
            maximizedMode: maximizedMode,
        };

        this.column = column;
        this.skipArrange = this.isMaximizedOutsideGrid();
        this.updateLayering();
        column.onWindowAdded(this, true);
    }

    public moveToColumn(targetColumn: Column, bottom: boolean, passFocus: FocusPassing.Type) {
        if (targetColumn === this.column) {
            return;
        }
        this.column.onWindowRemoved(this, passFocus);
        this.column = targetColumn;
        targetColumn.onWindowAdded(this, bottom);
    }

    public arrange(x: number, y: number, width: number, height: number) {
        if (this.skipArrange) {
            // window is maximized or full-screen outside of the grid, prevent fighting with the user
            return;
        }

        if (this.isFocused() && this.shouldReMaximize()) {
            // do this here rather than in `onFocused` to ensure it happens after placement
            // (otherwise placement may not happen at all)
            this.reMaximize();
            return;
        }

        if (this.fillsWidth() || this.fillsHeight()) {
            const fillArea = this.getFillArea();
            if (this.fillsWidth()) {
                const [overflowLeft, overflowRight] = this.getOverflow();
                x -= overflowLeft;
                width += overflowLeft + overflowRight;
            }
            if (this.fillsHeight()) {
                y = fillArea.y;
                height = fillArea.height;
            }
        }
        this.client.place(x, y, width, height);
    }

    private shouldReMaximize() {
        const config = this.column.grid.config;
        return config.reMaximize && (
            (!config.tileMaximized && this.focusedState.maximizedMode !== MaximizedMode.Unmaximized) ||
            (!config.tileFullScreen && this.focusedState.fullScreen)
        );
    }

    private reMaximize() {
        const config = this.column.grid.config;
        if (!config.tileMaximized && this.focusedState.maximizedMode !== MaximizedMode.Unmaximized) {
            this.client.setMaximize(
                this.focusedState.maximizedMode === MaximizedMode.Horizontally || this.focusedState.maximizedMode === MaximizedMode.Maximized,
                this.focusedState.maximizedMode === MaximizedMode.Vertically || this.focusedState.maximizedMode === MaximizedMode.Maximized,
            );
        }
        if (!config.tileFullScreen && this.focusedState.fullScreen) {
            this.client.setFullScreen(true);
        }
    }

    public focus() {
        this.client.focus();
        const kwinClient = this.client.kwinClient;
        if (!this.isFocused()) {
            // in some situations focus assignment just doesn't work, let's do it later
            this.column.grid.focusPasser.request(kwinClient);
        }
    }

    public isFocused() {
        return this.client.isFocused();
    }

    public onFocused() {
        this.updateLayering();
        if (this.shouldReMaximize()) {
            // We need to maximize/fullscreen this window, but we can't do it here.
            // We need to do it in `arrange` to ensure it happens after placement.
            this.column.grid.desktop.forceArrange();
        }
        this.column.onWindowFocused(this);
    }

    public raise() {
        this.client.raise();
    }

    public restoreToTiled() {
        if (this.isFocused()) {
            return;
        }
        const config = this.column.grid.config;
        if (!config.tileFullScreen) {
            this.client.setFullScreen(false);
        }
        if (!config.tileMaximized) {
            this.client.setMaximize(false, false);
        }
        this.updateLayering();
    }

    public onMaximizedChanged(maximizedMode: MaximizedMode) {
        if (this.isFocused()) {
            this.focusedState.maximizedMode = maximizedMode;
        }
        this.onMaximizedOrFullScreenChanged();
    }

    public onFullScreenChanged(fullScreen: boolean) {
        if (this.isFocused()) {
            this.focusedState.fullScreen = fullScreen;
        }
        this.onMaximizedOrFullScreenChanged();
    }

    private onMaximizedOrFullScreenChanged() {
        this.skipArrange = this.isMaximizedOutsideGrid();
        this.updateLayering();
        if ((this.fillsWidth() || this.fillsHeight()) && this.column.getWindowCount() > 1) {
            // a maximized or full-screen window gets a column of its own
            const newColumn = new Column(this.column.grid, this.column);
            this.moveToColumn(newColumn, true, FocusPassing.Type.None);
        }
        this.column.grid.onColumnWidthChanged(this.column);
        this.column.grid.desktop.onLayoutChanged();
    }

    private updateLayering() {
        const config = this.column.grid.config;
        const outsideGrid = this.isMaximizedOutsideGrid();
        if (config.tiledKeepBelow) {
            // a focused full-screen window must not be kept below, otherwise it doesn't cover panels
            this.client.kwinClient.keepBelow = !outsideGrid && !(this.isFullScreenInGrid() && this.isFocused());
        }
        if (config.maximizedKeepAbove) {
            this.client.kwinClient.keepAbove = outsideGrid;
        }
    }

    private getMaximizedMode() {
        return this.client.getMaximizedMode() ?? MaximizedMode.Unmaximized;
    }

    private isFullScreenInGrid() {
        return this.column.grid.config.tileFullScreen && this.client.kwinClient.fullScreen;
    }

    private getMaximizedModeInGrid() {
        return this.column.grid.config.tileMaximized ? this.getMaximizedMode() : MaximizedMode.Unmaximized;
    }

    // maximized or full-screen windows that are not kept in the grid are left to KWin
    private isMaximizedOutsideGrid() {
        const config = this.column.grid.config;
        return (!config.tileFullScreen && this.client.kwinClient.fullScreen) ||
            (!config.tileMaximized && this.getMaximizedMode() !== MaximizedMode.Unmaximized);
    }

    public fillsWidth() {
        const maximizedMode = this.getMaximizedModeInGrid();
        return this.isFullScreenInGrid() || maximizedMode === MaximizedMode.Horizontally || maximizedMode === MaximizedMode.Maximized;
    }

    public fillsHeight() {
        const maximizedMode = this.getMaximizedModeInGrid();
        return this.isFullScreenInGrid() || maximizedMode === MaximizedMode.Vertically || maximizedMode === MaximizedMode.Maximized;
    }

    // the area a maximized or full-screen window fills, instead of the tiling area
    private getFillArea() {
        const desktop = this.column.grid.desktop;
        return this.isFullScreenInGrid() ? desktop.fullScreenArea : desktop.clientArea;
    }

    // returns how far the window reaches past the left and right edges of its column
    public getOverflow(): [number, number] {
        if (!this.fillsWidth()) {
            return [0, 0];
        }
        const fillArea = this.getFillArea();
        const tilingArea = this.column.grid.desktop.tilingArea;
        return [
            Math.max(0, tilingArea.x - fillArea.x),
            Math.max(0, rectRight(fillArea) - rectRight(tilingArea)),
        ];
    }

    public onFrameGeometryChanged() {
        const newGeometry = this.client.kwinClient.frameGeometry;
        this.column.setWidth(newGeometry.width.round(), true);
        this.column.grid.desktop.onLayoutChanged();
    }

    public destroy(passFocus: FocusPassing.Type) {
        this.column.onWindowRemoved(this, passFocus);
    }
}

namespace Window {
    export interface State {
        fullScreen: boolean;
        maximizedMode: MaximizedMode;
    }
}
