class Column {
    public grid: Grid;
    public gridX: number;
    public width: number; // TODO: increase column width to contain transients
    private readonly windows: LinkedList<Window>;
    private stacked: boolean;
    private focusTaker: Window|null;
    private static readonly minWidth = 10;

    constructor(grid: Grid, prevColumn: Column|null) {
        this.gridX = 0;
        this.width = 0;
        this.windows = new LinkedList();
        this.stacked = grid.container.world.config.stackColumnsByDefault;
        this.focusTaker = null;
        this.grid = grid;
        this.grid.onColumnAdded(this, prevColumn);
    }

    moveToGrid(targetGrid: Grid, prevColumn: Column|null) {
        if (targetGrid === this.grid) {
            this.grid.onColumnMoved(this, prevColumn);
        } else {
            this.grid.onColumnRemoved(this, false);
            this.grid = targetGrid;
            targetGrid.onColumnAdded(this, prevColumn);
            for (const window of this.windows.iterator()) {
                window.client.kwinClient.desktop = targetGrid.container.desktop;
            }
        }
    }

    moveAfter(prevColumn: Column|null) {
        if (prevColumn === this) {
            return;
        }
        this.grid.onColumnMoved(this, prevColumn);
    }

    isAfter(other: Column) {
        return this.gridX > other.gridX;
    }

    isBefore(other: Column) {
        return this.gridX < other.gridX;
    }

    moveWindowUp(window: Window) {
        this.windows.moveBack(window);
    }

    moveWindowDown(window: Window) {
        this.windows.moveForward(window);
    }

    getWindowCount() {
        return this.windows.length();
    }

    isEmpty() {
        return this.getWindowCount() === 0;
    }

    getPrevWindow(window: Window) {
        return this.windows.getPrev(window);
    }

    getNextWindow(window: Window) {
        return this.windows.getNext(window);
    }

    getWidth() {
        return this.width;
    }

    getMinWidth() {
        let maxMinWidth = Column.minWidth;
        for (const window of this.windows.iterator()) {
            const minWidth = window.client.kwinClient.minSize.width;
            if (minWidth > maxMinWidth) {
                maxMinWidth = minWidth;
            }
        }
        return maxMinWidth;
    }

    getMaxWidth() {
        return this.grid.container.tilingArea.width;
    }

    setWidth(width: number, setPreferred: boolean) {
        width = clamp(width, this.getMinWidth(), this.getMaxWidth());
        const oldWidth = this.width;
        this.width = width;
        if (setPreferred) {
            for (const window of this.windows.iterator()) {
                window.client.preferredWidth = width;
            }
        }
        if (width !== oldWidth) {
            this.grid.onColumnWidthChanged(this, oldWidth, width);
        }
    }

    adjustWidth(widthDelta: number, setPreferred: boolean) {
        this.setWidth(this.width + widthDelta, setPreferred);
    }

    // returns x position of left edge in grid space
    getLeft() {
        return this.gridX;
    }

    // returns x position of right edge in grid space
    getRight() {
        return this.gridX + this.width;
    }

    adjustWindowHeight(window: Window, heightDelta: number, top: boolean) {
        const otherWindow = top ? this.windows.getPrev(window) : this.windows.getNext(window);
        if (otherWindow === null) {
            return;
        }

        window.height += heightDelta;
        otherWindow.height -= heightDelta;
    }

    resizeWindows() {
        const nWindows = this.windows.length();
        if (nWindows === 0) {
            return;
        }
        if (nWindows === 1) {
            this.stacked = this.grid.container.world.config.stackColumnsByDefault;
        }

        let remainingPixels = this.grid.container.tilingArea.height - (nWindows-1) * this.grid.container.world.config.gapsInnerVertical;
        let remainingWindows = nWindows;
        for (const window of this.windows.iterator()) {
            const windowHeight = Math.round(remainingPixels / remainingWindows);
            window.height = windowHeight;
            remainingPixels -= windowHeight;
            remainingWindows--;
        }
        // TODO: respect min height
    }

    getFocusTaker() {
        if (this.focusTaker === null || !this.windows.contains(this.focusTaker)) {
            return null;
        }
        return this.focusTaker;
    }

    focus() {
        const window = this.getFocusTaker() ?? this.windows.getFirst();
        if (window === null) {
            return;
        }
        window.focus();
    }

    arrange(x: number) {
        if (this.stacked && this.windows.length() >= 2) {
            this.arrangeStacked(x);
            return;
        }
        let y = this.grid.container.tilingArea.y;
        for (const window of this.windows.iterator()) {
            window.client.setShade(false);
            window.arrange(x, y, this.width, window.height);
            y += window.height + this.grid.container.world.config.gapsInnerVertical;
        }
    }

    arrangeStacked(x: number) {
        const expandedWindow = this.getFocusTaker();
        let collapsedHeight;
        for (const window of this.windows.iterator()) {
            if (window === expandedWindow) {
                window.client.setShade(false);
            } else {
                window.client.setShade(true);
                collapsedHeight = window.client.kwinClient.frameGeometry.height;
            }
        }

        const nCollapsed = this.getWindowCount() - 1;
        const expandedHeight = this.grid.container.tilingArea.height - nCollapsed * (collapsedHeight + this.grid.container.world.config.gapsInnerVertical);
        let y = this.grid.container.tilingArea.y;
        for (const window of this.windows.iterator()) {
            if (window === expandedWindow) {
                window.arrange(x, y, this.width, expandedHeight);
                y += expandedHeight;
            } else {
                window.arrange(x, y, this.width, window.height);
                y += collapsedHeight;
            }
            y += this.grid.container.world.config.gapsInnerVertical;
        }
    }

    toggleStacked() {
        if (this.windows.length() < 2) {
            return;
        }
        this.stacked = !this.stacked;
    }

    public isVisible(scrollPos: ScrollPos, fullyVisible: boolean) {
        if (fullyVisible) {
            return this.getLeft() >= scrollPos.getLeft() && this.getRight() <= scrollPos.getRight();
        } else {
            return this.getRight() >= scrollPos.getLeft() && this.getLeft() <= scrollPos.getRight();
        }
    }

    onWindowAdded(window: Window) {
        this.windows.insertEnd(window);
        if (this.width === 0) {
            this.setWidth(window.client.preferredWidth, false);
        }
        // TODO: also change column width if the new window requires it

        this.resizeWindows();

        if (window.isFocused()) {
            this.onWindowFocused(window);
        }
    }

    onWindowRemoved(window: Window, passFocus: boolean) {
        const lastWindow = this.windows.length() === 1;
        const windowToFocus = this.getPrevWindow(window) ?? this.getNextWindow(window);

        this.windows.remove(window);

        if (window === this.focusTaker) {
            this.focusTaker = windowToFocus;
        }

        if (lastWindow) {
            console.assert(this.isEmpty());
            this.destroy(passFocus);
        } else {
            this.resizeWindows();
            if (passFocus && windowToFocus !== null) {
                windowToFocus.focus();
            }
        }
    }

    onWindowFocused(window: Window) {
        this.grid.onColumnFocused(this);
        this.focusTaker = window;
    }

    restoreToTiled() {
        const lastFocusedWindow = this.getFocusTaker();
        if (lastFocusedWindow !== null) {
            lastFocusedWindow.restoreToTiled();
        }
    }

    destroy(passFocus: boolean) {
        this.grid.onColumnRemoved(this, passFocus);
    }
}
