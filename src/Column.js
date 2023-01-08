class Column {
    constructor() {
        this.grid = null;
        this.__windows = new LinkedList();
        this.__width = null;
    }

    addWindow(window) {
        window.column = this;

        this.__windows.insertEnd(window);
        if (this.__width === null) {
            this.setWidth(window.preferredWidth);
        }
        // TODO: also change column width if the new window requires it

        this.resizeWindows();
    }

    removeWindow(window) {
        window.column = null;
        this.__windows.remove(window);
        this.resizeWindows();
        if (this.grid !== null) {
            this.grid.onColumnRemoveWindow(this, window);
        }
    }

    moveWindowsTo(targetColumn) {
        for (const window of this.__windows.iterator()) {
            this.removeWindow(window);
            targetColumn.addWindow(window);
        }
    }

    moveWindowBack(window) {
        this.__windows.moveBack(window);
    }

    moveWindowForward(column) {
        this.__windows.moveForward(window);
    }

    getWindowCount() {
        return this.__windows.length();
    }

    isEmpty() {
        return this.getWindowCount() === 0;
    }

    setGrid(grid) {
        this.grid = grid;
        this.resizeWindows();
    }

    getWidth() {
        assert(this.__width !== null);
        return this.__width;
    }

    setWidth(width) {
        this.__width = width;
    }

    resizeWindows() {
        const nWindows = this.__windows.length();
        if (nWindows === 0) {
            return;
        }

        if (this.grid === null) {
            // this column is not attached to a grid, no sense in resizing windows
            return;
        }

        let remainingPixels = this.grid.area.height - 2*GAPS_OUTER.y - (nWindows-1)*GAPS_INNER.y;
        let remainingWindows = nWindows;
        for (const window of this.__windows.iterator()) {
            const windowHeight = Math.round(remainingPixels / remainingWindows);
            window.height = windowHeight;
            remainingPixels -= windowHeight;
            remainingWindows--;
        }
        // TODO: respect min height and unresizable windows
    }

    arrange(x) {
        if (this.grid === null) {
            // this column is not attached to a grid, no sense in arranging windows
            return;
        }

        let y = this.grid.area.y + GAPS_OUTER.y;
        for (const window of this.__windows.iterator()) {
            if (!window.skipArrange) {
                window.setRect(x, y, this.getWidth(), window.height);
            }
            y += window.height + GAPS_INNER.y;
        }
    }
}
