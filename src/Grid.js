class Grid {
    constructor(desktopIndex) {
        this.columns = new LinkedList(); // private
        this.scrollX = 0; // private

        const desktopNumber = desktopIndex + 1;
        this.area = workspace.clientArea(workspace.PlacementArea, 0, desktopNumber);
        this.area.x += GAPS_OUTER.x;
        this.area.y += GAPS_OUTER.y;
        this.area.width -= 2 * GAPS_OUTER.x;
        this.area.height -= 2 * GAPS_OUTER.y;
        // TODO: multi-screen support
        // TODO: react to changes in resolution
    }

    setupColumn(column) {
        column.setGrid(this);
        this.scrollToCenter();
    }

    addColumn(column) {
        this.columns.insertEnd(column);
        this.setupColumn(column);
    }

    addColumnBefore(column, nextColumn) {
        this.columns.insertBefore(column, nextColumn);
        this.setupColumn(column);
    }

    addColumnAfter(column, prevColumn) {
        this.columns.insertAfter(column, prevColumn);
        this.setupColumn(column);
    }

    removeColumn(column) {
        assert(column.isEmpty());
        column.setGrid(null);
        this.columns.remove(column);
        this.scrollToCenter();
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

    getTotalWidth() {
        // TODO: cache
        let columnsWidth = 0;
        for (const column of this.columns.iterator()) {
            columnsWidth += column.getWidth();
        }
        const gapsWidth = Math.max(0, (this.columns.length()-1) * GAPS_INNER.x);
        return columnsWidth + gapsWidth;
    }

    scrollToCenter() {
        const gridWidth = this.getTotalWidth();
        if (gridWidth > this.area.width) {
            // no centering in scrolling mode
            return;
        }

        const emptyWidth = this.area.width - gridWidth;
        this.scrollX = -Math.round(emptyWidth / 2);
    }

    scrollToWindow(window) {
        // TODO (refactor): instead of using frameGeometry, store x position inside Column
        //                  then we can pass column instead of window
        const rect = window.client.frameGeometry;
        const screen = this.area;
        if (rect.left < screen.left) {
            this.adjustScroll(rect.left - screen.left);
        } else if (rect.right > screen.right) {
            this.adjustScroll(rect.right - screen.right);
        }
    }

    adjustScroll(xDelta) {
        this.scrollX += xDelta;
    }

    arrange() {
        // TODO (optimization): only arrange visible windows
        let x = this.area.x - this.scrollX;
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

    onColumnWidthChanged(column, oldWidth, width) {
        this.scrollToCenter();
    }
}
