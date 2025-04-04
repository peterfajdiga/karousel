class Column {
    public grid: Grid;
    public gridX: number;
    private width: number; // TODO: increase column width to contain transients
    private readonly windows: LinkedList<Window>;
    private stacked: boolean;
    private focusTaker: Window|null;
    private static readonly minWidth = 40;

    constructor(grid: Grid, leftColumn: Column|null) {
        this.gridX = 0;
        this.width = 0;
        this.windows = new LinkedList();
        this.stacked = grid.config.stackColumnsByDefault;
        this.focusTaker = null;
        this.grid = grid;
        this.grid.onColumnAdded(this, leftColumn);
    }

    public moveToGrid(targetGrid: Grid, leftColumn: Column|null) {
        if (targetGrid === this.grid) {
            this.grid.moveColumn(this, leftColumn);
        } else {
            this.grid.onColumnRemoved(this, this.isFocused());
            this.grid = targetGrid;
            targetGrid.onColumnAdded(this, leftColumn);
            for (const window of this.windows.iterator()) {
                window.client.kwinClient.desktops = [targetGrid.desktop.kwinDesktop];
            }
        }
    }

    public isToTheLeftOf(other: Column) {
        return this.gridX < other.gridX;
    }

    public isToTheRightOf(other: Column) {
        return this.gridX > other.gridX;
    }

    public moveWindowUp(window: Window) {
        this.windows.moveBack(window);
        this.grid.desktop.onLayoutChanged();
    }

    public moveWindowDown(window: Window) {
        this.windows.moveForward(window);
        this.grid.desktop.onLayoutChanged();
    }

    public getWindowCount() {
        return this.windows.length();
    }

    public isEmpty() {
        return this.getWindowCount() === 0;
    }

    public getFirstWindow(): Window {
        return this.windows.getFirst()!;
    }

    public getLastWindow(): Window {
        return this.windows.getLast()!;
    }

    public getAboveWindow(window: Window) {
        return this.windows.getPrev(window);
    }

    public getBelowWindow(window: Window) {
        return this.windows.getNext(window);
    }

    public getWidth() {
        return this.width;
    }

    public getMinWidth() {
        let maxMinWidth = Column.minWidth;
        for (const window of this.windows.iterator()) {
            const minWidth = window.client.kwinClient.minSize.width;
            if (minWidth > maxMinWidth) {
                maxMinWidth = minWidth;
            }
        }
        return maxMinWidth;
    }

    public getMaxWidth() {
        return this.grid.desktop.tilingArea.width;
    }

    public setWidth(width: number, setPreferred: boolean) {
        width = clamp(width, this.getMinWidth(), this.getMaxWidth());
        if (width === this.width) {
            return;
        }

        this.width = width;
        if (setPreferred) {
            for (const window of this.windows.iterator()) {
                window.client.preferredWidth = width;
            }
        }
        this.grid.onColumnWidthChanged(this);
    }

    public adjustWidth(widthDelta: number, setPreferred: boolean) {
        this.setWidth(this.width + widthDelta, setPreferred);
    }

    public updateWidth() {
        let minErr = Infinity;
        let closestPreferredWidth = this.width;
        for (const window of this.windows.iterator()) {
            const err = Math.abs(window.client.preferredWidth - this.width);
            if (err < minErr) {
                minErr = err;
                closestPreferredWidth = window.client.preferredWidth;
            }
        }
        this.setWidth(closestPreferredWidth, false);
    }

    // returns x position of left edge in grid space
    public getLeft() {
        return this.gridX;
    }

    // returns x position of right edge in grid space
    public getRight() {
        return this.gridX + this.width;
    }

    public onUserResizeWidth(
        startWidth: number,
        currentDelta: number,
        resizingLeftSide: boolean,
        neighbor?: { column: Column, startWidth: number },
    ) {
        const oldColumnWidth = this.getWidth();
        this.setWidth(startWidth + currentDelta, true);
        const actualDelta = this.getWidth() - startWidth;

        let leftEdgeDeltaStep = resizingLeftSide ? oldColumnWidth - this.getWidth() : 0;
        if (neighbor !== undefined) {
            const oldNeighborWidth = neighbor.column.getWidth();
            neighbor.column.setWidth(neighbor.startWidth - actualDelta, true);
            if (resizingLeftSide) {
                leftEdgeDeltaStep -= neighbor.column.getWidth() - oldNeighborWidth;
            }
        }
        this.grid.desktop.adjustScroll(-leftEdgeDeltaStep, true);
    }

    public adjustWindowHeight(window: Window, heightDelta: number, top: boolean) {
        const otherWindow = top ? this.windows.getPrev(window) : this.windows.getNext(window);
        if (otherWindow === null) {
            return;
        }

        window.height += heightDelta;
        otherWindow.height -= heightDelta;

        this.grid.desktop.onLayoutChanged();
    }

    public resizeWindows() {
        const nWindows = this.windows.length();
        if (nWindows === 0) {
            return;
        }
        if (nWindows === 1) {
            this.stacked = this.grid.config.stackColumnsByDefault;
        }

        let remainingPixels = this.grid.desktop.tilingArea.height - (nWindows-1) * this.grid.config.gapsInnerVertical;
        let remainingWindows = nWindows;
        for (const window of this.windows.iterator()) {
            const windowHeight = Math.round(remainingPixels / remainingWindows);
            window.height = windowHeight;
            remainingPixels -= windowHeight;
            remainingWindows--;
        }
        // TODO: respect min height

        this.grid.desktop.onLayoutChanged();
    }

    public getFocusTaker() {
        if (this.focusTaker === null || !this.windows.contains(this.focusTaker)) {
            return null;
        }
        return this.focusTaker;
    }

    public focus() {
        const window = this.getFocusTaker() ?? this.windows.getFirst();
        if (window === null) {
            return;
        }
        window.focus();
    }

    public isFocused() {
        const lastFocusedWindow = this.grid.getLastFocusedWindow();
        if (lastFocusedWindow === null) {
            return false;
        }
        return lastFocusedWindow.column === this && lastFocusedWindow.isFocused();
    }

    public arrange(x: number, visibleRange: Range, forceOpaque: boolean) {
        if (this.grid.config.offScreenOpacity < 1.0 && !forceOpaque) {
            const opacity = Range.contains(visibleRange, this) ? 100 : this.grid.config.offScreenOpacity;
            for (const window of this.windows.iterator()) {
                window.client.kwinClient.opacity = opacity;
            }
        }

        if (this.stacked && this.windows.length() >= 2) {
            this.arrangeStacked(x);
            return;
        }
        let y = this.grid.desktop.tilingArea.y;
        for (const window of this.windows.iterator()) {
            window.arrange(x, y, this.width, window.height);
            y += window.height + this.grid.config.gapsInnerVertical;
        }
    }

    public arrangeStacked(x: number) {
        const nWindows = this.windows.length();
        const windowWidth = this.width - (nWindows - 1) * this.grid.config.stackOffsetX;
        const windowHeight = this.grid.desktop.tilingArea.height - (nWindows - 1) * this.grid.config.stackOffsetY;

        let windowX = x;
        let windowY = this.grid.desktop.tilingArea.y;
        for (const window of this.windows.iterator()) {
            window.arrange(windowX, windowY, windowWidth, windowHeight);
            windowX += this.grid.config.stackOffsetX;
            windowY += this.grid.config.stackOffsetY;
        }
    }

    public toggleStacked() {
        if (this.windows.length() < 2) {
            return;
        }
        this.stacked = !this.stacked;
        this.grid.desktop.onLayoutChanged();
    }

    public onWindowAdded(window: Window, bottom: boolean) {
        if (bottom) {
            this.windows.insertEnd(window);
        } else {
            this.windows.insertStart(window);
        }

        if (this.width === 0) {
            this.setWidth(window.client.preferredWidth, false);
        }
        // TODO: also change column width if the new window requires it

        this.resizeWindows();

        if (window.isFocused()) {
            this.onWindowFocused(window);
        }

        this.grid.desktop.onLayoutChanged();
    }

    public onWindowRemoved(window: Window, passFocus: boolean) {
        const lastWindow = this.windows.length() === 1;
        const windowToFocus = this.getAboveWindow(window) ?? this.getBelowWindow(window);

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

        this.grid.desktop.onLayoutChanged();
    }

    public onWindowFocused(window: Window) {
        this.grid.onColumnFocused(this, window);
        this.focusTaker = window;
    }

    public restoreToTiled(focusedWindow: Window) {
        const lastFocusedWindow = this.getFocusTaker();
        if (lastFocusedWindow !== null && lastFocusedWindow !== focusedWindow) {
            lastFocusedWindow.restoreToTiled();
        }
    }

    private destroy(passFocus: boolean) {
        this.grid.onColumnRemoved(this, passFocus);
    }
}
