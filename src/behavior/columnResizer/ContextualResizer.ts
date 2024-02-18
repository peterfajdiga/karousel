class ContextualResizer {
    public increaseWidth(column: Column, step: number) {
        const grid = column.grid;
        const desktop = grid.desktop;
        const visibleRange = desktop.getCurrentVisibleRange();
        if(!column.isVisible(visibleRange, true) || column.getWidth() >= column.getMaxWidth()) {
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

        const newWidth = ContextualResizer.findNextStep(
            [
                visibleRange.getWidth(),
                column.getWidth() + step,
                column.getWidth() + leftSpace + rightSpace,
                column.getWidth() + leftSpace + rightSpace + leftVisibleColumn.getWidth() + grid.config.gapsInnerHorizontal,
                column.getWidth() + leftSpace + rightSpace + rightVisibleColumn.getWidth() + grid.config.gapsInnerHorizontal,
            ],
            width => width - column.getWidth(),
        )
        if (newWidth === undefined) {
            return;
        }

        column.setWidth(newWidth, true);
        desktop.scrollCenterVisible(column);
    }

    public decreaseWidth(column: Column, step: number) {
        const grid = column.grid;
        const desktop = grid.desktop;
        const visibleRange = desktop.getCurrentVisibleRange();
        if(!column.isVisible(visibleRange, true) || column.getWidth() <= column.getMinWidth()) {
            return;
        }

        const leftVisibleColumn = grid.getLeftmostVisibleColumn(visibleRange, true);
        const rightVisibleColumn = grid.getRightmostVisibleColumn(visibleRange, true);
        if (leftVisibleColumn === null || rightVisibleColumn === null) {
            console.assert(false); // should at least see self
            return;
        }

        let leftOffScreenColumn = grid.getPrevColumn(leftVisibleColumn);
        if (leftOffScreenColumn === column) {
            leftOffScreenColumn = null;
        }
        let rightOffScreenColumn = grid.getNextColumn(rightVisibleColumn);
        if (rightOffScreenColumn === column) {
            rightOffScreenColumn = null;
        }

        const visibleColumnsWidth = rightVisibleColumn.getRight() - leftVisibleColumn.getLeft();
        const unusedWidth = visibleRange.getWidth() - visibleColumnsWidth;
        const leftOffScreen = leftOffScreenColumn === null ? 0 : leftOffScreenColumn.getWidth() + grid.config.gapsInnerHorizontal - unusedWidth;
        const rightOffScreen = rightOffScreenColumn === null ? 0 : rightOffScreenColumn.getWidth() + grid.config.gapsInnerHorizontal - unusedWidth;

        const newWidth = ContextualResizer.findNextStep(
            [
                visibleRange.getWidth(),
                column.getWidth() - step,
                column.getWidth() - leftOffScreen,
                column.getWidth() - rightOffScreen,
            ],
            width => column.getWidth() - width,
        )
        if (newWidth === undefined) {
            return;
        }

        column.setWidth(newWidth, true);
        desktop.scrollCenterVisible(column);
    }

    private static findNextStep(steps: number[], evaluate: (step: number) => number) {
        let bestScore = Infinity;
        let bestStep = undefined;
        for (const step of steps) {
            const score = evaluate(step);
            if (score > 0 && score < bestScore) {
                bestScore = score;
                bestStep = step;
            }
        }
        return bestStep;
    }
}
