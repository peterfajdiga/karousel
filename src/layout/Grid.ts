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

    public moveColumnLeft(column: Column) {
        this.columns.moveBack(column);
        this.columnsSetX(column);
        this.desktop.onLayoutChanged();
        this.desktop.autoAdjustScroll();
    }

    public moveColumnRight(column: Column) {
        const nextColumn = this.columns.getNext(column);
        if (nextColumn === null) {
            return;
        }
        this.moveColumnLeft(nextColumn);
    }

    public getWidth() {
        return this.width;
    }

    public getPrevColumn(column: Column) {
        return this.columns.getPrev(column);
    }

    public getNextColumn(column: Column) {
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
        const scrollX = visibleRange.getLeft();
        for (const column of this.columns.iterator()) {
            const x = fullyVisible ? column.getLeft() : column.getRight() + (this.config.gapsInnerHorizontal - 1);
            if (x >= scrollX) {
                return column;
            }
        }
        return null;
    }

    public getRightmostVisibleColumn(visibleRange: Desktop.Range, fullyVisible: boolean) {
        const scrollX = visibleRange.getRight();
        let last = null;
        for (const column of this.columns.iterator()) {
            const x = fullyVisible ? column.getRight() : column.getLeft() - (this.config.gapsInnerHorizontal - 1);
            if (x <= scrollX) {
                last = column;
            } else {
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

    public getVisibleColumnsWidth(visibleRange: Desktop.Range, fullyVisible: boolean) {
        let width = 0;
        let nVisible = 0;
        for (const column of this.getVisibleColumns(visibleRange, fullyVisible)) {
            width += column.getWidth();
            nVisible++;
        }

        if (nVisible > 0) {
            width += (nVisible-1) * this.config.gapsInnerHorizontal;
        }

        return width;
    }

    private getLeftOffScreenColumn(visibleRange: Desktop.Range) {
        const leftVisible = this.getLeftmostVisibleColumn(visibleRange, true);
        if (leftVisible === null) {
            return null;
        }
        return this.getPrevColumn(leftVisible);
    }

    private getRightOffScreenColumn(visibleRange: Desktop.Range) {
        const rightVisible = this.getRightmostVisibleColumn(visibleRange, true);
        if (rightVisible === null) {
            return null;
        }
        return this.getNextColumn(rightVisible);
    }

    public increaseColumnWidth(column: Column) {
        const visibleRange = this.desktop.calculateVisibleRange(column);
        if (this.width < visibleRange.getWidth()) {
            column.adjustWidth(visibleRange.getWidth() - this.width, true);
            return;
        }

        let leftColumn = this.getLeftmostVisibleColumn(visibleRange, false);
        if (leftColumn === column) {
            leftColumn = null;
        }
        let rightColumn = this.getRightmostVisibleColumn(visibleRange, false);
        if (rightColumn === column) {
            rightColumn = null;
        }
        if (leftColumn === null && rightColumn === null) {
            return;
        }

        const leftVisibleWidth = leftColumn === null ? Infinity : leftColumn.getRight() - visibleRange.getLeft();
        const rightVisibleWidth = rightColumn === null ? Infinity : visibleRange.getRight() - rightColumn.getLeft();
        const expandLeft = leftVisibleWidth < rightVisibleWidth;
        const widthDelta = (expandLeft ? leftVisibleWidth : rightVisibleWidth) + this.config.gapsInnerHorizontal;
        column.adjustWidth(widthDelta, true);
        if (expandLeft) {
            this.desktop.setScroll(column.gridX, false);
        }
    }

    public decreaseColumnWidth(column: Column) {
        const visibleRange = this.desktop.calculateVisibleRange(column);
        if (this.width <= visibleRange.getWidth()) {
            column.setWidth(Math.round(column.getWidth() / 2), true);
            return;
        }

        let leftColumn = this.getLeftOffScreenColumn(visibleRange);
        if (leftColumn === column) {
            leftColumn = null;
        }
        let rightColumn = this.getRightOffScreenColumn(visibleRange);
        if (rightColumn === column) {
            rightColumn = null;
        }
        if (leftColumn === null && rightColumn === null) {
            return;
        }

        const leftInvisibleWidth = leftColumn === null ? Infinity : visibleRange.getLeft() - leftColumn.getLeft();
        const rightInvisibleWidth = rightColumn === null ? Infinity : rightColumn.getRight() - visibleRange.getRight();
        const shrinkLeft = leftInvisibleWidth < rightInvisibleWidth;
        const widthDelta = (shrinkLeft ? leftInvisibleWidth : rightInvisibleWidth);
        if (shrinkLeft) {
            const maxDelta = column.getWidth() - column.getMinWidth();
            this.desktop.adjustScroll(-Math.min(widthDelta, maxDelta), false);
        }
        column.adjustWidth(-widthDelta, true);
    }

    public arrange(x: number) {
        for (const column of this.columns.iterator()) {
            column.arrange(x);
            x += column.getWidth() + this.config.gapsInnerHorizontal;
        }

        const focusedWindow = this.getLastFocusedWindow();
        if (focusedWindow !== null) {
            focusedWindow.client.ensureTransientsVisible(this.desktop.clientArea);
        }
    }

    public onColumnAdded(column: Column, prevColumn: Column|null) {
        if (prevColumn === null) {
            this.columns.insertStart(column);
        } else {
            this.columns.insertAfter(column, prevColumn);
        }
        this.columnsSetX(column);
        this.desktop.onLayoutChanged();
        this.desktop.autoAdjustScroll();
    }

    public onColumnRemoved(column: Column, passFocus: boolean) {
        const isLastColumn = this.columns.length() === 1;
        const nextColumn = this.getNextColumn(column);
        const columnToFocus = isLastColumn ? null : this.getPrevColumn(column) ?? nextColumn;
        if (column === this.lastFocusedColumn) {
            this.lastFocusedColumn = columnToFocus;
        }

        this.columns.remove(column);
        this.columnsSetX(nextColumn);

        if (passFocus && columnToFocus !== null) {
            columnToFocus.focus();
        } else {
            this.desktop.autoAdjustScroll();
        }
        this.desktop.onLayoutChanged();
    }

    public onColumnMoved(column: Column, prevColumn: Column|null) {
        const movedLeft = prevColumn === null ? true : column.isAfter(prevColumn);
        const firstMovedColumn = movedLeft ? column : this.getNextColumn(column);
        this.columns.move(column, prevColumn);
        this.columnsSetX(firstMovedColumn);
        this.desktop.onLayoutChanged();
        this.desktop.autoAdjustScroll();
    }

    public onColumnWidthChanged(column: Column, oldWidth: number, width: number) {
        const nextColumn = this.columns.getNext(column);
        this.columnsSetX(nextColumn);
        if (!this.userResize) {
            this.desktop.autoAdjustScroll();
        }
        this.desktop.onLayoutChanged();
    }

    public onColumnFocused(column: Column) {
        const lastFocusedColumn = this.getLastFocusedColumn();
        if (lastFocusedColumn !== null) {
            lastFocusedColumn.restoreToTiled();
        }
        this.lastFocusedColumn = column;
        this.desktop.scroller.focusColumn(this.desktop, column);
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
