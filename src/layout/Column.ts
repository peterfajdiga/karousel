class Column {
    public grid: Grid;
    public gridX: number;
    public width: number;
    private windows: LinkedList<Window>;
    private lastFocusedWindow: Window|null;

    constructor(grid: Grid, prevColumn: Column|null) {
        this.gridX = 0;
        this.width = 0;
        this.windows = new LinkedList();
        this.lastFocusedWindow = null;
        this.grid = grid;
        this.grid.onColumnAdded(this, prevColumn);
    }

    moveWindowsTo(targetColumn: Column) {
        for (const window of this.windows.iterator()) {
            window.moveToColumn(targetColumn);
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

    getWidth() {
        return this.width;
    }

    setWidth(width: number) {
        width = Math.min(width, this.grid.area.width);
        const oldWidth = this.width;
        this.width = width;
        for (const window of this.windows.iterator()) {
            window.preferredWidth = width;
        }
        if (width !== oldWidth) {
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

    getLastFocusedWindow() {
        if (this.lastFocusedWindow === null || !this.windows.contains(this.lastFocusedWindow)) {
            return null;
        }
        return this.lastFocusedWindow;
    }

    focus() {
        const window = this.getLastFocusedWindow() ?? this.windows.getFirst();
        if (window === null) {
            return;
        }
        window.focus();
    }

    arrange(x: number) {
        let y = this.grid.area.y;
        for (const window of this.windows.iterator()) {
            if (!window.skipArrange) {
                window.arrange(x, y, this.getWidth());
            }
            y += window.height + GAPS_INNER.y;
        }
    }

    onWindowAdded(window: Window) {
        this.windows.insertEnd(window);
        if (this.width === 0) {
            this.setWidth(window.preferredWidth);
        }
        // TODO: also change column width if the new window requires it

        this.resizeWindows();

        if (window.isFocused()) {
            this.lastFocusedWindow = window;
        }
    }

    onWindowRemoved(window: Window, passFocus: boolean) {
        const lastWindow = this.windows.length() === 1;
        const windowToFocus = lastWindow || !passFocus ? null : this.getPrevWindow(window) ?? this.getNextWindow(window);

        this.windows.remove(window);

        if (lastWindow) {
            console.assert(this.isEmpty());
            this.destroy(passFocus);
        } else {
            this.resizeWindows();
            if (windowToFocus !== null) {
                windowToFocus.focus();
            }
        }
    }

    onWindowFocused(window: Window) {
        this.lastFocusedWindow = window;
        this.grid.onColumnFocused(this);
    }

    destroy(passFocus: boolean) {
        this.grid.onColumnRemoved(this, passFocus);
    }
}
