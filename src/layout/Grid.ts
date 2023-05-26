class Grid {
    public readonly world: World;
    private readonly columns: LinkedList<Column>;
    private lastFocusedColumn: Column|null;
    private scrollX: number;
    private width: number;
    private userResize: boolean; // is any part of the grid being resized by the user
    public clientArea: QRect;
    public tilingArea: QRect;
    public readonly desktop: number;
    private readonly userResizeFinishedDelayer: Delayer;

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
        const newClientArea = workspace.clientArea(workspace.PlacementArea, 0, this.desktop);
        if (newClientArea === this.clientArea) {
            return;
        }

        this.clientArea = newClientArea;
        this.tilingArea = Qt.rect(
            newClientArea.x + this.world.config.gapsOuterLeft,
            newClientArea.y + this.world.config.gapsOuterTop,
            newClientArea.width - this.world.config.gapsOuterLeft - this.world.config.gapsOuterRight,
            newClientArea.height - this.world.config.gapsOuterTop - this.world.config.gapsOuterBottom,
        )
        for (const column of this.columns.iterator()) {
            column.resizeWindows();
        }

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
        if (this.lastFocusedColumn === null || this.lastFocusedColumn.grid !== this) {
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
            if (x <= this.tilingArea.width) {
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
        const remainingSpace = this.tilingArea.width - column.width;
        const overScrollX = Math.min(this.world.config.overscroll, Math.round(remainingSpace / 2));
        if (left < 0) {
            this.adjustScroll(left - overScrollX, false);
        } else if (right > this.tilingArea.width) {
            this.adjustScroll(right - this.tilingArea.width + overScrollX, false);
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
        if (column.grid !== this) {
            return;
        }
        this.scrollToColumn(column);
    }

    setScroll(x: number, force: boolean) {
        if (!force) {
            let minScroll = 0;
            let maxScroll = this.width - this.tilingArea.width;
            if (maxScroll < 0) {
                const centerScroll = Math.round(maxScroll / 2);
                minScroll = centerScroll;
                maxScroll = centerScroll;
            }
            x = clamp(x, minScroll, maxScroll);
        }
        this.scrollX = x;
    }

    adjustScroll(dx: number, force: boolean) {
        this.setScroll(this.scrollX + dx, force);
    }

    removeOverscroll() {
        this.setScroll(this.scrollX, false);
    }

    columnsSetX(firstMovedColumn: Column|null) {
        const lastUnmovedColumn = firstMovedColumn === null ? this.columns.getLast() : this.columns.getPrev(firstMovedColumn);
        let x = lastUnmovedColumn === null ? 0 : lastUnmovedColumn.gridX + lastUnmovedColumn.width + this.world.config.gapsInnerHorizontal;
        if (firstMovedColumn !== null) {
            for (const column of this.columns.iteratorFrom(firstMovedColumn)) {
                column.gridX = x;
                x += column.width + this.world.config.gapsInnerHorizontal;
            }
        }
        this.width = x - this.world.config.gapsInnerHorizontal;
    }

    arrange() {
        // TODO (optimization): only arrange visible windows
        this.updateArea();
        let x = this.tilingArea.x - this.scrollX;
        for (const column of this.columns.iterator()) {
            column.arrange(x);
            x += column.getWidth() + this.world.config.gapsInnerHorizontal;
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
        const lastFocusedColumn = this.getLastFocusedColumn();
        if (lastFocusedColumn !== null) {
            lastFocusedColumn.restoreToTiled();
        }
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
