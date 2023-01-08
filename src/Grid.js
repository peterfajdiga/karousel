class Grid {
    constructor(desktopIndex) {
        this.desktopIndex = desktopIndex;
        this.columns = new LinkedList();
        this.scrollX = 0;

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

    moveColumnBack(column) {
        this.columns.moveBack(column);
    }

    moveColumnForward(column) {
        this.columns.moveForward(column);
    }

    mergeColumns(donorColumn, targetColumn) {
        if (targetColumn === null) {
            return;
        }
        donorColumn.moveWindowsTo(targetColumn);
    }

    mergeColumnsPrev(donorColumn) {
        this.mergeColumns(donorColumn, this.columns.getPrev(donorColumn));
    }

    mergeColumnsNext(donorColumn) {
        this.mergeColumns(donorColumn, this.columns.getNext(donorColumn));
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
