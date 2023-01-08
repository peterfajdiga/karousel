class Grid {
    constructor(desktopIndex) {
        this.__columns = new LinkedList();
        this.__scrollX = 0;

        const desktopNumber = desktopIndex + 1;
        this.area = workspace.clientArea(workspace.PlacementArea, 0, desktopNumber);
        // TODO: multi-screen support
        // TODO: react to changes in resolution
    }

    setupColumn(column) {
        column.setGrid(this);
    }

    addColumn(column) {
        this.setupColumn(column);
        this.__columns.insertEnd(column);
    }

    addColumnBefore(column, nextColumn) {
        this.setupColumn(column);
        this.__columns.insertBefore(column, nextColumn)
    }

    addColumnAfter(column, prevColumn) {
        this.setupColumn(column);
        this.__columns.insertAfter(column, prevColumn)
    }

    removeColumn(column) {
        assert(column.isEmpty());
        column.setGrid(null);
        this.__columns.remove(column);
    }

    moveColumnLeft(column) {
        this.__columns.moveBack(column);
    }

    moveColumnRight(column) {
        this.__columns.moveForward(column);
    }

    mergeColumns(donorColumn, targetColumn) {
        assert(targetColumn !== null);
        donorColumn.moveWindowsTo(targetColumn);
    }

    mergeColumnsLeft(donorColumn) {
        const prevColumn = this.__columns.getPrev(donorColumn);
        if (prevColumn === null) {
            return;
        }
        this.mergeColumns(donorColumn, prevColumn);
    }

    mergeColumnsRight(donorColumn) {
        const nextColumn = this.__columns.getNext(donorColumn);
        if (nextColumn === null) {
            return;
        }
        this.mergeColumns(donorColumn, nextColumn);
    }

    adjustScroll(xDelta) {
        this.__scrollX += xDelta;
    }

    arrange() {
        // TODO (optimization): only arrange visible windows
        let x = this.area.x + GAPS_OUTER.x - this.__scrollX;
        for (const column of this.__columns.iterator()) {
            column.arrange(x);
            x += column.getWidth() + GAPS_INNER.x;
        }
    }

    onColumnRemoveWindow(column, window) {
        if (column.isEmpty()) {
            this.removeColumn(column);
        }
    }
}
