class ScrollerCentered {
    public scrollToColumn(desktop: Desktop, column: Column) {
        desktop.scrollCenterRange(column);
    }

    public clampScrollX(desktop: Desktop, x: number) {
        return ScrollerCentered.clampScrollX(desktop, x);
    }

    public static clampScrollX(desktop: Desktop, x: number) {
        const firstColumn = desktop.grid.getFirstColumn();
        if (firstColumn === null) {
            return 0;
        }
        const lastColumn = desktop.grid.getLastColumn()!;

        let minScroll = Math.round((firstColumn.getWidth() - desktop.tilingArea.width) / 2);
        let maxScroll = Math.round(desktop.grid.getWidth() - (desktop.tilingArea.width + lastColumn.getWidth()) / 2);
        return clamp(x, minScroll, maxScroll);
    }
}
