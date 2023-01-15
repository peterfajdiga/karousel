class Column {
    public grid: Grid;
    public gridX: number;
    private windows: LinkedList;
    private width: number;

    constructor() {
        this.grid = null;
        this.gridX = null;
        this.windows = new LinkedList();
        this.width = 0;
    }

    addWindow(window) {
        window.column = this;

        this.windows.insertEnd(window);
        if (this.width === 0) {
            this.setWidth(window.preferredWidth);
        }
        // TODO: also change column width if the new window requires it

        this.resizeWindows();
    }

    removeWindow(window) {
        window.column = null;
        this.windows.remove(window);
        this.resizeWindows();
        if (this.grid !== null) {
            this.grid.onColumnRemoveWindow(this, window); // TODO: use signal
        }
    }

    moveWindowsTo(targetColumn) {
        for (const window of this.windows.iterator()) {
            this.removeWindow(window);
            targetColumn.addWindow(window);
        }
    }

    moveWindowUp(window) {
        this.windows.moveBack(window);
    }

    moveWindowDown(window) {
        this.windows.moveForward(window);
    }

    getWindowCount() {
        return this.windows.length();
    }

    isEmpty() {
        return this.getWindowCount() === 0;
    }

    getPrevWindow(window) {
        return this.windows.getPrev(window);
    }

    getNextWindow(window) {
        return this.windows.getNext(window);
    }

    setGrid(grid) {
        this.grid = grid;
        this.resizeWindows();
    }

    getWidth() {
        return this.width;
    }

    setWidth(width) {
        const oldWidth = this.width;
        this.width = width;
        for (const window of this.windows.iterator()) {
            window.preferredWidth = width;
        }
        if (width !== oldWidth && this.grid !== null) {
            this.grid.onColumnWidthChanged(this, oldWidth, width);
        }
    }

    adjustWidth(widthDelta) {
        this.setWidth(this.width + widthDelta);
    }

    adjustWindowHeight(window, heightDelta, top) {
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

    arrange(x) {
        if (this.grid === null) {
            // this column is not attached to a grid, no sense in arranging windows
            return;
        }

        let y = this.grid.area.y;
        for (const window of this.windows.iterator()) {
            if (!window.skipArrange) {
                window.setRect(x, y, this.getWidth(), window.height);
            }
            y += window.height + GAPS_INNER.y;
        }
    }
}
