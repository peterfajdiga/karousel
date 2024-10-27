class ContextualResizer {
    constructor(
        private readonly presetWidths: { getWidths: (minWidth: number, maxWidth: number) => number[] },
    ) {}

    public increaseWidth(column: Column) {
        const grid = column.grid;
        const desktop = grid.desktop;
        const visibleRange = desktop.getCurrentVisibleRange();
        const minWidth = column.getMinWidth();
        const maxWidth = column.getMaxWidth();
        if(!visibleRange.contains(column) || column.getWidth() >= maxWidth) {
            return;
        }

        let leftVisibleColumn = grid.getLeftmostVisibleColumn(visibleRange, true);
        let rightVisibleColumn = grid.getRightmostVisibleColumn(visibleRange, true);
        if (leftVisibleColumn === null || rightVisibleColumn === null) {
            console.assert(false); // should at least see self
            return;
        }

        const leftSpace = leftVisibleColumn.getLeft() - visibleRange.getLeft();
        const rightSpace = visibleRange.getRight() - rightVisibleColumn.getRight();

        const newWidth = findMinPositive(
            [
                column.getWidth() + leftSpace + rightSpace,
                column.getWidth() + leftSpace + rightSpace + leftVisibleColumn.getWidth() + grid.config.gapsInnerHorizontal,
                column.getWidth() + leftSpace + rightSpace + rightVisibleColumn.getWidth() + grid.config.gapsInnerHorizontal,
                ...this.presetWidths.getWidths(minWidth, maxWidth),
            ],
            width => width - column.getWidth(),
        )
        if (newWidth === undefined) {
            return;
        }

        column.setWidth(newWidth, true);
        desktop.scrollCenterVisible(column);
    }

    public decreaseWidth(column: Column) {
        const grid = column.grid;
        const desktop = grid.desktop;
        const visibleRange = desktop.getCurrentVisibleRange();
        const minWidth = column.getMinWidth();
        const maxWidth = column.getMaxWidth();
        if(!visibleRange.contains(column) || column.getWidth() <= minWidth) {
            return;
        }

        const leftVisibleColumn = grid.getLeftmostVisibleColumn(visibleRange, true);
        const rightVisibleColumn = grid.getRightmostVisibleColumn(visibleRange, true);
        if (leftVisibleColumn === null || rightVisibleColumn === null) {
            console.assert(false); // should at least see self
            return;
        }

        let leftOffScreenColumn = grid.getLeftColumn(leftVisibleColumn);
        if (leftOffScreenColumn === column) {
            leftOffScreenColumn = null;
        }
        let rightOffScreenColumn = grid.getRightColumn(rightVisibleColumn);
        if (rightOffScreenColumn === column) {
            rightOffScreenColumn = null;
        }

        const visibleColumnsWidth = rightVisibleColumn.getRight() - leftVisibleColumn.getLeft();
        const unusedWidth = visibleRange.getWidth() - visibleColumnsWidth;
        const leftOffScreen = leftOffScreenColumn === null ? 0 : leftOffScreenColumn.getWidth() + grid.config.gapsInnerHorizontal - unusedWidth;
        const rightOffScreen = rightOffScreenColumn === null ? 0 : rightOffScreenColumn.getWidth() + grid.config.gapsInnerHorizontal - unusedWidth;

        const newWidth = findMinPositive(
            [
                column.getWidth() - leftOffScreen,
                column.getWidth() - rightOffScreen,
                ...this.presetWidths.getWidths(minWidth, maxWidth),
            ],
            width => column.getWidth() - width,
        )
        if (newWidth === undefined) {
            return;
        }

        column.setWidth(newWidth, true);
        desktop.scrollCenterVisible(column);
    }
}
