class Column {
    constructor() {
        this.grid = null;
        this.windows = new LinkedList();
        this.width = null;
    }

    addWindow(window) {
        window.column = this;
        const client = window.client;

        this.windows.insertEnd(window);
        if (this.width === null) {
            this.width = client.frameGeometry.width;
        }
        // TODO: also change column width if the new window requires it

        this.resizeWindows();
    }

    removeWindow(window) {
        this.windows.remove(window);
        this.resizeWindows();
    }

    resizeWindows() {
        const nWindows = this.windows.length();
        if (nWindows === 0) {
            return;
        }

        let remainingPixels = this.grid.area.height - 2*GAPS_OUTER.y - (nWindows-1)*GAPS_INNER.y;
        let remainingWindows = nWindows;
        for (const window of this.windows.iterator()) {
            const windowHeight = Math.round(remainingPixels) / remainingWindows;
            window.client.frameGeometry.height = windowHeight;
            remainingPixels -= windowHeight;
            remainingWindows--;
        }
        // TODO: respect min height and unresizable windows
    }
}
