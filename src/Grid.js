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
        column.grid = this;
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
        assert(column.windows.length() === 0);
        column.grid = null;
        this.columns.remove(column);
    }

    moveColumnBack(column) {
        this.columns.moveBack(column);
    }

    moveColumnForward(column) {
        this.columns.moveForward(column);
    }

    removeWindow(window) {
        const column = window.column;
        column.removeWindow(window);
        if (column.windows.length() === 0) {
            this.removeColumn(column);
        }
    }

    adjustScroll(xDelta) {
        this.scrollX += xDelta;
    }

    arrange() {
        // TODO (optimization): only arrange visible windows
        let x = this.area.x + GAPS_OUTER.x - this.scrollX;
        for (const column of this.columns.iterator()) {
            let y = this.area.y + GAPS_OUTER.y;
            for (const window of column.windows.iterator()) {
                if (!window.skipArrange) {
                    window.setRect(x, y, column.getWidth(), window.height);
                }
                y += window.height + GAPS_INNER.y;
            }
            x += column.getWidth() + GAPS_INNER.x;
        }
    }
}
