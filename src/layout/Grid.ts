class Grid {
    private world: World;
    private columns: LinkedList<Column>;
    private lastFocusedColumn: Column|null;
    private scrollX: number;
    private width: number;
    public userResize: boolean; // is any part of the grid being resized by the user
    public area: any;
    public desktop: number;
    private userResizeFinishedDelayer: Delayer;

    constructor(world: World, desktop: number) {
        this.world = world;
        this.columns = new LinkedList();
        this.lastFocusedColumn = null;
        this.scrollX = 0;
        this.width = 0;
        this.userResize = false;
        this.desktop = desktop;
        this.updateArea();
        this.userResizeFinishedDelayer = new Delayer(50, () => {
            // this delay prevents windows' contents from freezing after resizing
            this.autoAdjustScroll();
            this.arrange();
        });
    }

    updateArea() {
        this.area = workspace.clientArea(workspace.PlacementArea, 0, this.desktop); // TODO: multi-screen support
        this.area.x += GAPS_OUTER.left;
        this.area.y += GAPS_OUTER.top;
        this.area.width -= GAPS_OUTER.left + GAPS_OUTER.right;
        this.area.height -= GAPS_OUTER.top + GAPS_OUTER.bottom;
        for (const column of this.columns.iterator()) {
            column.resizeWindows();
        }
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

    getColumnAtIndex(i: number) {
        return this.columns.getItemAtIndex(i);
    }

    getLastFocusedColumn() {
        if (this.lastFocusedColumn === null || !this.columns.contains(this.lastFocusedColumn)) {
            return null;
        }
        return this.lastFocusedColumn;
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
        const remainingSpace = this.area.width - column.width;
        const overScrollX = Math.min(AUTO_OVERSCROLL_X, Math.round(remainingSpace / 2));
        if (left < 0) {
            this.adjustScroll(left - overScrollX, false);
        } else if (right > this.area.width) {
            this.adjustScroll(right - this.area.width + overScrollX, false);
        } else {
            this.removeOverscroll();
        }
    }

    autoAdjustScroll() {
        const focusedWindow = this.world.getFocusedWindow();
        if (focusedWindow === null) {
            this.removeOverscroll();
            return;
        }

        const column = focusedWindow.column;
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

    columnsSetX(firstMovedColumn: Column|null) {
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

    onColumnAdded(column: Column, prevColumn: Column|null) {
        if (prevColumn === null) {
            this.columns.insertStart(column);
        } else {
            this.columns.insertAfter(column, prevColumn);
        }
        this.columnsSetX(column);
        this.autoAdjustScroll();
    }

    onColumnRemoved(column: Column, passFocus: boolean) {
        console.assert(column.isEmpty());
        if (column === this.lastFocusedColumn) {
            this.lastFocusedColumn = null;
        }

        const lastColumn = this.columns.length() === 1;
        const columnToFocus = lastColumn || !passFocus ? null : this.getPrevColumn(column) ?? this.getNextColumn(column);
        const nextColumn = this.columns.getNext(column);

        this.columns.remove(column);

        this.columnsSetX(nextColumn);
        if (columnToFocus !== null) {
            columnToFocus.focus();
        } else {
            this.autoAdjustScroll();
        }
    }

    onColumnMoved(column: Column, prevColumn: Column|null) {
        const movedLeft = prevColumn === null ? true : column.isAfter(prevColumn);
        const firstMovedColumn = movedLeft ? column : this.getNextColumn(column);
        this.columns.move(column, prevColumn);
        this.columnsSetX(firstMovedColumn);
        this.autoAdjustScroll();
    }

    onColumnWidthChanged(column: Column, oldWidth: number, width: number) {
        const nextColumn = this.columns.getNext(column);
        this.columnsSetX(nextColumn);
        if (!this.userResize) {
            this.autoAdjustScroll();
        }
    }

    onColumnFocused(column: Column) {
        this.lastFocusedColumn = column;
        this.scrollToColumn(column);
    }

    onUserResizeStarted() {
        this.userResize = true;
    }

    onUserResizeFinished() {
        this.userResize = false;
        this.userResizeFinishedDelayer.run();
    }

    evacuateTail(targetGrid: Grid, startColumn: Column) {
        for (const column of this.columns.iteratorFrom(startColumn)) {
            column.moveToGrid(targetGrid, targetGrid.getLastColumn());
        }
    }

    evacuate(targetGrid: Grid) {
        for (const column of this.columns.iterator()) {
            column.moveToGrid(targetGrid, targetGrid.getLastColumn());
        }
    }

    destroy() {
        this.userResizeFinishedDelayer.destroy();
    }
}
