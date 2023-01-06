class Column {
    constructor(grid) {
        this.node = new LinkedListNode(this);
        this.grid = grid;
        this.windows = new LinkedList();
        this.width = null;
    }

    addWindow(windowNode) {
        const window = windowNode.item
        const client = window.client;

        let availableHeight = this.grid.area.height - 2 * GAPS_OUTER.y;
        const nWindows = this.windows.length;
        const resizeRatio = (nWindows - 1) / nWindows;
        for (const windowNode of this.windows.iterator()) {
            const window = windowNode.item;
            const windowRect = window.client.frameGeometry;
            windowRect.height = Math.round(windowRect.height * resizeRatio);
            availableHeight -= windowRect.height;
        }
        client.frameGeometry.height = availableHeight;
        // TODO: respect min height and unresizable windows

        this.windows.insertEnd(windowNode);
        if (this.width === null) {
            this.width = client.frameGeometry.width;
        }
        // TODO: also change column width if the new window requires it
    }

    removeWindow(windowNode) {
        this.windows.remove(windowNode);
        if (this.windows.length === 0) {
            this.grid.removeColumn(this.node); // TODO: consider doing this in Grid instead
        }
    }
}
