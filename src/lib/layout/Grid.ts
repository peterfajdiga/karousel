import Range = Desktop.Range;

class Grid {
    public readonly desktop: Desktop;
    public readonly config: LayoutConfig;
    private readonly columns: LinkedList<Column>;
    private lastFocusedColumn: Column|null;
    private width: number;
    private userResize: boolean; // is any part of the grid being resized by the user
    private readonly userResizeFinishedDelayer: Delayer;

    constructor(desktop: Desktop, config: LayoutConfig) {
        this.desktop = desktop;
        this.config = config;
        this.columns = new LinkedList();
        this.lastFocusedColumn = null;
        this.width = 0;
        this.userResize = false;
        this.userResizeFinishedDelayer = new Delayer(50, () => {
            // this delay prevents windows' contents from freezing after resizing
            this.desktop.onLayoutChanged();
            this.desktop.autoAdjustScroll();
            this.desktop.arrange();
        });
    }

    public moveColumn(column: Column, leftColumn: Column|null) {
        if (column === leftColumn) {
            return;
        }
        const movedLeft = leftColumn === null ? true : column.isToTheRightOf(leftColumn);
        const firstMovedColumn = movedLeft ? column : this.getRightColumn(column);
        this.columns.move(column, leftColumn);
        this.columnsSetX(firstMovedColumn);
        this.desktop.onLayoutChanged();
        this.desktop.autoAdjustScroll();
    }

    public moveColumnLeft(column: Column) {
        this.columns.moveBack(column);
        this.columnsSetX(column);
        this.desktop.onLayoutChanged();
        this.desktop.autoAdjustScroll();
    }

    public moveColumnRight(column: Column) {
        const rightColumn = this.columns.getNext(column);
        if (rightColumn === null) {
            return;
        }
        this.moveColumnLeft(rightColumn);
    }

    public getWidth() {
        return this.width;
    }

    public isUserResizing() {
        return this.userResize;
    }

    public getLeftColumn(column: Column) {
        return this.columns.getPrev(column);
    }

    public getRightColumn(column: Column) {
        return this.columns.getNext(column);
    }

    public getFirstColumn() {
        return this.columns.getFirst();
    }

    public getLastColumn() {
        return this.columns.getLast();
    }

    public getColumnAtIndex(i: number) {
        return this.columns.getItemAtIndex(i);
    }

    public getLastFocusedColumn() {
        if (this.lastFocusedColumn === null || this.lastFocusedColumn.grid !== this) {
            return null;
        }
        return this.lastFocusedColumn;
    }

    public getLastFocusedWindow() {
        const lastFocusedColumn = this.getLastFocusedColumn();
        if (lastFocusedColumn === null) {
            return null;
        }
        return lastFocusedColumn.getFocusTaker();
    }

    private columnsSetX(firstMovedColumn: Column|null) {
        const lastUnmovedColumn = firstMovedColumn === null ? this.columns.getLast() : this.columns.getPrev(firstMovedColumn);
        let x = lastUnmovedColumn === null ? 0 : lastUnmovedColumn.getRight() + this.config.gapsInnerHorizontal;
        if (firstMovedColumn !== null) {
            for (const column of this.columns.iteratorFrom(firstMovedColumn)) {
                column.gridX = x;
                x += column.getWidth() + this.config.gapsInnerHorizontal;
            }
        }
        this.width = x - this.config.gapsInnerHorizontal;
    }

    public getLeftmostVisibleColumn(visibleRange: Desktop.Range, fullyVisible: boolean) {
        for (const column of this.columns.iterator()) {
            if (column.isVisible(visibleRange, fullyVisible)) {
                return column;
            }
        }
        return null;
    }

    public getRightmostVisibleColumn(visibleRange: Desktop.Range, fullyVisible: boolean) {
        let last = null;
        for (const column of this.columns.iterator()) {
            if (column.isVisible(visibleRange, fullyVisible)) {
                last = column;
            } else if (last !== null) {
                break;
            }
        }
        return last;
    }

    public *getVisibleColumns(visibleRange: Desktop.Range, fullyVisible: boolean) {
        for (const column of this.columns.iterator()) {
            if (column.isVisible(visibleRange, fullyVisible)) {
                yield column;
            }
        }
    }

    public arrange(x: number, visibleRange: Range) {
        for (const column of this.columns.iterator()) {
            column.arrange(x, visibleRange, this.userResize);
            x += column.getWidth() + this.config.gapsInnerHorizontal;
        }

        const focusedWindow = this.getLastFocusedWindow();
        if (focusedWindow !== null) {
            focusedWindow.client.ensureTransientsVisible(this.desktop.clientArea);
        }
    }

    public onColumnAdded(column: Column, leftColumn: Column|null) {
        if (leftColumn === null) {
            this.columns.insertStart(column);
        } else {
            this.columns.insertAfter(column, leftColumn);
        }
        this.columnsSetX(column);
        this.desktop.onLayoutChanged();
        this.desktop.autoAdjustScroll();
    }

    public onColumnRemoved(column: Column, passFocus: boolean) {
        const isLastColumn = this.columns.length() === 1;
        const rightColumn = this.getRightColumn(column);
        const columnToFocus = isLastColumn ? null : this.getLeftColumn(column) ?? rightColumn;
        if (column === this.lastFocusedColumn) {
            this.lastFocusedColumn = columnToFocus;
        }

        this.columns.remove(column);
        this.columnsSetX(rightColumn);

        this.desktop.onLayoutChanged();
        if (passFocus && columnToFocus !== null) {
            columnToFocus.focus();
        } else {
            this.desktop.autoAdjustScroll();
        }
    }

    public onColumnWidthChanged(column: Column) {
        const rightColumn = this.columns.getNext(column);
        this.columnsSetX(rightColumn);
        this.desktop.onLayoutChanged();
        if (!this.userResize) {
            this.desktop.autoAdjustScroll();
        }
    }

    public onColumnFocused(column: Column) {
        const lastFocusedColumn = this.getLastFocusedColumn();
        if (lastFocusedColumn !== null && lastFocusedColumn !== column) {
            lastFocusedColumn.restoreToTiled();
        }
        this.lastFocusedColumn = column;
        this.desktop.scrollToColumn(column);
    }

    public onScreenSizeChanged() {
        for (const column of this.columns.iterator()) {
            column.updateWidth();
            column.resizeWindows();
        }
    }

    public onUserResizeStarted() {
        this.userResize = true;
    }

    public onUserResizeFinished() {
        this.userResize = false;
        this.userResizeFinishedDelayer.run();
    }

    public evacuateTail(targetGrid: Grid, startColumn: Column) {
        for (const column of this.columns.iteratorFrom(startColumn)) {
            column.moveToGrid(targetGrid, targetGrid.getLastColumn());
        }
    }

    public evacuate(targetGrid: Grid) {
        for (const column of this.columns.iterator()) {
            column.moveToGrid(targetGrid, targetGrid.getLastColumn());
        }
    }

    public destroy() {
        this.userResizeFinishedDelayer.destroy();
    }
}
