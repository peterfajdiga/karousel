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
        this.columns.insertEnd(column.node);
    }

    removeColumn(column) {
        this.columns.remove(column.node);
    }

    arrange() {
        let x = this.area.x + GAPS_OUTER.x;
        for (const columnNode of this.columns.iterator()) {
            const column = columnNode.item;
            let y = this.area.y + GAPS_OUTER.y;
            for (const windowNode of column.windows.iterator()) {
                const window = windowNode.item;
                const client = window.client;
                client.frameGeometry.x = x;
                client.frameGeometry.y = y;
                y += client.frameGeometry.height + GAPS_INNER.y;
            }
            x += column.width + GAPS_INNER.x;
        }
    }
}
