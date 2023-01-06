class Grid {
    constructor(desktopIndex) {
        this.desktopIndex = desktopIndex;
        this.columns = new LinkedList();

        const desktopNumber = desktopIndex + 1;
        this.area = workspace.clientArea(workspace.PlacementArea, 0, desktopNumber);
        // TODO: multi-screen support
        // TODO: react to changes in resolution
    }

    addColumn(column) {
        column.grid = this;
        this.columns.insertEnd(column);
    }

    addColumnBefore(column, nextColumn) {
        column.grid = this;
        this.columns.insertBefore(column, nextColumn)
    }

    addColumnAfter(column, prevColumn) {
        column.grid = this;
        this.columns.insertAfter(column, prevColumn)
    }

    removeColumn(column) {
        assert(column.windows.length() === 0);
        this.columns.remove(column);
    }

    removeWindow(window) {
        const column = window.column;
        column.removeWindow(window);
        if (column.windows.length() === 0) {
            this.removeColumn(column);
        }
    }

    arrange() {
        // TODO (optimization): only arrange visible windows
        let x = this.area.x + GAPS_OUTER.x;
        for (const column of this.columns.iterator()) {
            let y = this.area.y + GAPS_OUTER.y;
            for (const window of column.windows.iterator()) {
                window.setRect(x, y, column.width, window.height);
                y += window.height + GAPS_INNER.y;
            }
            x += column.width + GAPS_INNER.x;
        }
    }
}
