class Column {
    constructor() {
        this.grid = null;
        this.windows = new LinkedList();
        this.__width = null;
    }

    addWindow(window) {
        window.column = this;

        this.windows.insertEnd(window);
        if (this.__width === null) {
            this.setWidth(window.preferredWidth);
        }
        // TODO: also change column width if the new window requires it

        this.resizeWindows();
    }

    removeWindow(window) {
        window.column = null;
        this.windows.remove(window);
        this.resizeWindows();
    }

    getWidth() {
        assert(this.__width !== null);
        return this.__width;
    }

    setWidth(width) {
        this.__width = width;
    }

    resizeWindows() {
        const nWindows = this.windows.length();
        if (nWindows === 0) {
            return;
        }

        let remainingPixels = this.grid.area.height - 2*GAPS_OUTER.y - (nWindows-1)*GAPS_INNER.y;
        let remainingWindows = nWindows;
        for (const window of this.windows.iterator()) {
            const windowHeight = Math.round(remainingPixels / remainingWindows);
            window.height = windowHeight;
            remainingPixels -= windowHeight;
            remainingWindows--;
        }
        // TODO: respect min height and unresizable windows
    }
}
