class Column {
    public grid: Grid|null;
    public gridX: number;
    private windows: LinkedList;
    public width: number;

    constructor() {
        this.grid = null;
        this.gridX = 0;
        this.windows = new LinkedList();
        this.width = 0;
    }

    addWindow(window: Window) {
        window.column = this;

        this.windows.insertEnd(window);
        if (this.width === 0) {
            this.setWidth(window.preferredWidth);
        }
        // TODO: also change column width if the new window requires it

        this.resizeWindows();
    }

    removeWindow(window: Window) {
        window.column = null;
        this.windows.remove(window);
        this.resizeWindows();
        if (this.grid !== null) {
            this.grid.onColumnRemoveWindow(this, window); // TODO: use signal
        }
    }

    moveWindowsTo(targetColumn: Column) {
        for (const window of this.windows.iterator()) {
            this.removeWindow(window);
            targetColumn.addWindow(window);
        }
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

    setGrid(grid: Grid|null) {
        this.grid = grid;
        this.resizeWindows();
    }

    getWidth() {
        return this.width;
    }

    setWidth(width: number) {
        const oldWidth = this.width;
        this.width = width;
        for (const window of this.windows.iterator()) {
            window.preferredWidth = width;
        }
        if (width !== oldWidth && this.grid !== null) {
            this.grid.onColumnWidthChanged(this, oldWidth, width);
        }
    }

    adjustWidth(widthDelta: number) {
        this.setWidth(this.width + widthDelta);
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

        if (this.grid === null) {
            // this column is not attached to a grid, no sense in resizing windows
            return;
        }

        let remainingPixels = this.grid.area.height - (nWindows-1)*GAPS_INNER.y;
        let remainingWindows = nWindows;
        for (const window of this.windows.iterator()) {
            const windowHeight = Math.round(remainingPixels / remainingWindows);
            window.height = windowHeight;
            remainingPixels -= windowHeight;
            remainingWindows--;
        }
        // TODO: respect min height and unresizable windows
    }

    focus() {
        const window = this.windows.getFirst();
        if (window === null) {
            return;
        }
        window.focus();
    }

    arrange(x: number) {
        if (this.grid === null) {
            // this column is not attached to a grid, no sense in arranging windows
            return;
        }

        let y = this.grid.area.y;
        for (const window of this.windows.iterator()) {
            if (!window.skipArrange) {
                window.arrange(x, y, this.getWidth());
            }
            y += window.height + GAPS_INNER.y;
        }
    }
}
