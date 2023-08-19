class Grid {
    public readonly container: ScrollView;
    public readonly config: LayoutConfig;
    private readonly columns: LinkedList<Column>;
    private lastFocusedColumn: Column|null;
    private width: number;
    private userResize: boolean; // is any part of the grid being resized by the user
    private readonly userResizeFinishedDelayer: Delayer;

    constructor(container: ScrollView, config: LayoutConfig) {
        this.container = container;
        this.config = config;
        this.columns = new LinkedList();
        this.lastFocusedColumn = null;
        this.width = 0;
        this.userResize = false;
        this.userResizeFinishedDelayer = new Delayer(50, () => {
            // this delay prevents windows' contents from freezing after resizing
            this.container.onLayoutChanged();
            this.container.autoAdjustScroll();
            this.container.arrange();
        });
    }

    public moveColumnLeft(column: Column) {
        this.columns.moveBack(column);
        this.columnsSetX(column);
        this.container.onLayoutChanged();
        this.container.autoAdjustScroll();
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

    public getLeftmostVisibleColumn(scrollPos: ScrollView.Pos, fullyVisible: boolean) {
        const scrollX = scrollPos.getLeft();
        for (const column of this.columns.iterator()) {
            const x = fullyVisible ? column.getLeft() : column.getRight() + (this.config.gapsInnerHorizontal - 1);
            if (x >= scrollX) {
                return column;
            }
        }
        return null;
    }

    public getRightmostVisibleColumn(scrollPos: ScrollView.Pos, fullyVisible: boolean) {
        const scrollX = scrollPos.getRight();
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

    public getVisibleColumnsWidth(scrollPos: ScrollView.Pos, fullyVisible: boolean) {
        let width = 0;
        let nVisible = 0;
        for (const column of this.columns.iterator()) {
            if (column.isVisible(scrollPos, fullyVisible)) {
                width += column.getWidth();
                nVisible++;
            }
        }

        if (nVisible > 0) {
            width += (nVisible-1) * this.config.gapsInnerHorizontal;
        }

        return width;
    }

    private getLeftOffScreenColumn(scrollPos: ScrollView.Pos) {
        const leftVisible = this.getLeftmostVisibleColumn(scrollPos, true);
        if (leftVisible === null) {
            return null;
        }
        return this.getPrevColumn(leftVisible);
    }

    private getRightOffScreenColumn(scrollPos: ScrollView.Pos) {
        const rightVisible = this.getRightmostVisibleColumn(scrollPos, true);
        if (rightVisible === null) {
            return null;
        }
        return this.getNextColumn(rightVisible);
    }

    public increaseColumnWidth(column: Column) {
        const scrollPos = this.container.getScrollPosForColumn(column);
        if (this.width < scrollPos.width) {
            column.adjustWidth(scrollPos.width - this.width, false);
            return;
        }

        let leftColumn = this.getLeftmostVisibleColumn(scrollPos, false);
        if (leftColumn === column) {
            leftColumn = null;
        }
        let rightColumn = this.getRightmostVisibleColumn(scrollPos, false);
        if (rightColumn === column) {
            rightColumn = null;
        }
        if (leftColumn === null && rightColumn === null) {
            return;
        }

        const leftVisibleWidth = leftColumn === null ? Infinity : leftColumn.getRight() - scrollPos.getLeft();
        const rightVisibleWidth = rightColumn === null ? Infinity : scrollPos.getRight() - rightColumn.getLeft();
        const expandLeft = leftVisibleWidth < rightVisibleWidth;
        const widthDelta = (expandLeft ? leftVisibleWidth : rightVisibleWidth) + this.config.gapsInnerHorizontal;
        if (expandLeft) {
            this.container.adjustScroll(widthDelta, false);
        }
        column.adjustWidth(widthDelta, true);
    }

    public decreaseColumnWidth(column: Column) {
        const scrollPos = this.container.getScrollPosForColumn(column);
        if (this.width <= scrollPos.width) {
            column.setWidth(Math.round(column.getWidth() / 2), false);
            return;
        }

        let leftColumn = this.getLeftOffScreenColumn(scrollPos);
        if (leftColumn === column) {
            leftColumn = null;
        }
        let rightColumn = this.getRightOffScreenColumn(scrollPos);
        if (rightColumn === column) {
            rightColumn = null;
        }
        if (leftColumn === null && rightColumn === null) {
            return;
        }

        const leftInvisibleWidth = leftColumn === null ? Infinity : scrollPos.getLeft() - leftColumn.getLeft();
        const rightInvisibleWidth = rightColumn === null ? Infinity : rightColumn.getRight() - scrollPos.getRight();
        const shrinkLeft = leftInvisibleWidth < rightInvisibleWidth;
        const widthDelta = (shrinkLeft ? leftInvisibleWidth : rightInvisibleWidth);
        if (shrinkLeft) {
            const maxDelta = column.getWidth() - column.getMinWidth();
            this.container.adjustScroll(-Math.min(widthDelta, maxDelta), false);
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
            focusedWindow.client.ensureTransientsVisible(this.container.clientArea);
        }
    }

    public onColumnAdded(column: Column, prevColumn: Column|null) {
        if (prevColumn === null) {
            this.columns.insertStart(column);
        } else {
            this.columns.insertAfter(column, prevColumn);
        }
        this.columnsSetX(column);
        this.container.onLayoutChanged();
        this.container.autoAdjustScroll();
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
            this.container.autoAdjustScroll();
        }
        this.container.onLayoutChanged();
    }

    public onColumnMoved(column: Column, prevColumn: Column|null) {
        const movedLeft = prevColumn === null ? true : column.isAfter(prevColumn);
        const firstMovedColumn = movedLeft ? column : this.getNextColumn(column);
        this.columns.move(column, prevColumn);
        this.columnsSetX(firstMovedColumn);
        this.container.onLayoutChanged();
        this.container.autoAdjustScroll();
    }

    public onColumnWidthChanged(column: Column, oldWidth: number, width: number) {
        const nextColumn = this.columns.getNext(column);
        this.columnsSetX(nextColumn);
        if (!this.userResize) {
            this.container.autoAdjustScroll();
        }
        this.container.onLayoutChanged();
    }

    public onColumnFocused(column: Column) {
        const lastFocusedColumn = this.getLastFocusedColumn();
        if (lastFocusedColumn !== null) {
            lastFocusedColumn.restoreToTiled();
        }
        this.lastFocusedColumn = column;
        this.container.scrollToColumn(column);
    }

    public onScreenSizeChanged() {
        for (const column of this.columns.iterator()) {
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
