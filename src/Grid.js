class Grid {
    constructor(desktopIndex) {
        this.columns = new LinkedList(); // private
        this.scrollX = 0; // private

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
        this.columns.insertEnd(column);
    }

    addColumnBefore(column, nextColumn) {
        this.setupColumn(column);
        this.columns.insertBefore(column, nextColumn)
    }

    addColumnAfter(column, prevColumn) {
        this.setupColumn(column);
        this.columns.insertAfter(column, prevColumn)
    }

    removeColumn(column) {
        assert(column.isEmpty());
        column.setGrid(null);
        this.columns.remove(column);
    }

    moveColumnLeft(column) {
        this.columns.moveBack(column);
    }

    moveColumnRight(column) {
        this.columns.moveForward(column);
    }

    mergeColumns(donorColumn, targetColumn) {
        assert(targetColumn !== null);
        donorColumn.moveWindowsTo(targetColumn);
    }

    mergeColumnsLeft(donorColumn) {
        const prevColumn = this.columns.getPrev(donorColumn);
        if (prevColumn === null) {
            return;
        }
        this.mergeColumns(donorColumn, prevColumn);
    }

    mergeColumnsRight(donorColumn) {
        const nextColumn = this.columns.getNext(donorColumn);
        if (nextColumn === null) {
            return;
        }
        this.mergeColumns(donorColumn, nextColumn);
    }

    adjustScroll(xDelta) {
        this.scrollX += xDelta;
    }

    arrange() {
        // TODO (optimization): only arrange visible windows
        let x = this.area.x + GAPS_OUTER.x - this.scrollX;
        for (const column of this.columns.iterator()) {
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
