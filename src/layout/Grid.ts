class Grid {
    private world: World;
    private columns: LinkedList;
    private scrollX: number;
    private width: number;
    public userResize: boolean; // is any part of the grid being resized by the user
    public area: any;
    private desktop: number;
    private userResizeFinishedTimer: QQmlTimer;

    constructor(world: World, desktop: number) {
        this.world = world;
        this.columns = new LinkedList();
        this.scrollX = 0;
        this.width = 0;
        this.userResize = false;
        this.desktop = desktop;
        this.updateArea();
        this.userResizeFinishedTimer = this.initUserResizeFinishedTimer();
    }

    updateArea() {
        this.area = workspace.clientArea(workspace.PlacementArea, 0, this.desktop); // TODO: multi-screen support
        this.area.x += GAPS_OUTER.x;
        this.area.y += GAPS_OUTER.y;
        this.area.width -= 2 * GAPS_OUTER.x;
        this.area.height -= 2 * GAPS_OUTER.y;
        for (const column of this.columns.iterator()) {
            column.resizeWindows();
        }
    }

    setupColumn(column: Column) {
        column.setGrid(this);
        this.columnsSetX(column);
        this.autoAdjustScroll();
    }

    addColumn(column: Column) {
        this.columns.insertEnd(column);
        this.setupColumn(column);
    }

    addColumnBefore(column: Column, nextColumn: Column) {
        this.columns.insertBefore(column, nextColumn);
        this.setupColumn(column);
    }

    addColumnAfter(column: Column, prevColumn: Column) {
        this.columns.insertAfter(column, prevColumn);
        this.setupColumn(column);
    }

    removeColumn(column: Column) {
        console.assert(column.isEmpty());
        const nextColumn = this.columns.getNext(column);
        column.setGrid(null);
        column.gridX = 0;
        this.columns.remove(column);
        this.columnsSetX(nextColumn);
        this.autoAdjustScroll();
    }

    moveColumnLeft(column: Column) {
        this.columns.moveBack(column);
        this.columnsSetX(column);
        this.autoAdjustScroll();
    }

    moveColumnRight(column: Column) {
        const nextColumn = this.columns.getNext(column);
        if (nextColumn === null) {
            return;
        }
        this.moveColumnLeft(nextColumn);
    }

    mergeColumns(donorColumn: Column, targetColumn: Column) {
        console.assert(targetColumn !== null);
        donorColumn.moveWindowsTo(targetColumn);
    }

    mergeColumnsLeft(donorColumn: Column) {
        const prevColumn = this.columns.getPrev(donorColumn);
        if (prevColumn === null) {
            return;
        }
        this.mergeColumns(donorColumn, prevColumn);
    }

    mergeColumnsRight(donorColumn: Column) {
        const nextColumn = this.columns.getNext(donorColumn);
        if (nextColumn === null) {
            return;
        }
        this.mergeColumns(donorColumn, nextColumn);
    }

    getPrevColumn(column: Column) {
        return this.columns.getPrev(column);
    }

    getNextColumn(column: Column) {
        return this.columns.getNext(column);
    }

    getFirstColumn() {
        return this.columns.getFirst();
    }

    getLastColumn() {
        return this.columns.getLast();
    }

    getLeftmostVisibleColumn(fullyVisible: boolean) {
        for (const column of this.columns.iterator()) {
            const left = column.gridX - this.scrollX; // in screen space
            const right = left + column.width; // in screen space
            const x = fullyVisible ? left : right;
            if (x >= 0) {
                return column;
            }
        }
        return null;
    }

    getRightmostVisibleColumn(fullyVisible: boolean) {
        let last = null;
        for (const column of this.columns.iterator()) {
            const left = column.gridX - this.scrollX; // in screen space
            const right = left + column.width; // in screen space
            const x = fullyVisible ? right : left;
            if (x <= this.area.width) {
                last = column;
            } else {
                break;
            }
        }
        return last;
    }

    scrollToColumn(column: Column) {
        const left = column.gridX - this.scrollX; // in screen space
        const right = left + column.width; // in screen space
        if (left < 0) {
            this.adjustScroll(left, false);
        } else if (right > this.area.width) {
            this.adjustScroll(right - this.area.width, false);
        } else {
            this.removeOverscroll();
        }
    }

    autoAdjustScroll() {
        const focusedWindow = this.world.getFocusedWindow();
        if (focusedWindow === undefined) {
            this.removeOverscroll();
            return;
        }

        const column = focusedWindow.column;
        if (column === null || column.grid === null) {
            this.removeOverscroll();
            return;
        }

        console.assert(column.grid === this);
        this.scrollToColumn(column);
    }

    setScroll(x: number, force: boolean) {
        if (!force) {
            let minScroll = 0;
            let maxScroll = this.width - this.area.width;
            if (maxScroll < 0) {
                const centerScroll = Math.round(maxScroll / 2);
                minScroll = centerScroll;
                maxScroll = centerScroll;
            }
            x = Math.max(minScroll, Math.min(maxScroll, x));
        }
        this.scrollX = x;
    }

    adjustScroll(xDelta: number, force: boolean) {
        this.setScroll(this.scrollX + xDelta, force);
    }

    removeOverscroll() {
        this.setScroll(this.scrollX, false);
    }

    columnsSetX(firstMovedColumn: Column) {
        const lastUnmovedColumn = firstMovedColumn === null ? this.columns.getLast() : this.columns.getPrev(firstMovedColumn);
        let x = lastUnmovedColumn === null ? 0 : lastUnmovedColumn.gridX + lastUnmovedColumn.width + GAPS_INNER.x;
        if (firstMovedColumn !== null) {
            for (const column of this.columns.iteratorFrom(firstMovedColumn)) {
                column.gridX = x;
                x += column.width + GAPS_INNER.x;
            }
        }
        this.width = x - GAPS_INNER.x;
    }

    arrange() {
        // TODO (optimization): only arrange visible windows
        let x = this.area.x - this.scrollX;
        for (const column of this.columns.iterator()) {
            column.arrange(x);
            x += column.getWidth() + GAPS_INNER.x;
        }
    }

    onColumnRemoveWindow(column: Column, window: Window) {
        if (column.isEmpty()) {
            this.removeColumn(column);
        }
    }

    onColumnWidthChanged(column: Column, oldWidth: number, width: number) {
        const nextColumn = this.columns.getNext(column);
        this.columnsSetX(nextColumn);
        if (!this.userResize) {
            this.autoAdjustScroll();
        }
    }

    onUserResizeStarted() {
        this.userResize = true;
    }

    onUserResizeFinished() {
        this.userResize = false;
        this.userResizeFinishedTimer.running = true;
    }

    initUserResizeFinishedTimer() {
        const timer = initTimer();
        timer.interval = 50; // this delay prevents windows' contents from freezing after resizing
        const grid = this;
        timer.triggered.connect(() => {
            grid.autoAdjustScroll();
            grid.arrange();
        });
        return timer;
    }

    destroy() {
        this.userResizeFinishedTimer.destroy();
    }
}
