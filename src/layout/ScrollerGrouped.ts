class ScrollerGrouped {
    private readonly layoutConfig: LayoutConfig;

    constructor(layoutConfig: LayoutConfig) {
        this.layoutConfig = layoutConfig;
    }

    public focusColumn(desktop: Desktop, column: Column) {
        const columnRange = new ScrollerGrouped.ColumnRange(column);
        const visibleRange = desktop.getCurrentVisibleRange();
        columnRange.addNeighbors(visibleRange, this.layoutConfig.gapsInnerHorizontal, true);
        columnRange.addNeighbors(visibleRange, this.layoutConfig.gapsInnerHorizontal, false);
        desktop.scrollCenterRange(columnRange);
    }
}

namespace ScrollerGrouped {
    import Range = Desktop.Range;

    export class ColumnRange {
        private left: Column;
        private right: Column;
        private width: number;

        constructor(initialColumn: Column) {
            this.left = initialColumn;
            this.right = initialColumn;
            this.width = initialColumn.getWidth();
        }

        public addNeighbors(visibleRange: Range, gap: number, requireVisible: boolean) {
            const grid = this.left.grid;

            let leftColumn: Column|null = this.left;
            while (true) {
                leftColumn = grid.getPrevColumn(leftColumn);
                if (
                    leftColumn === null ||
                    requireVisible && !leftColumn.isVisible(visibleRange, true) ||
                    this.width + gap + leftColumn.getWidth() > visibleRange.getWidth()
                ) {
                    break;
                }
                this.addLeft(leftColumn, gap);
            }

            let rightColumn: Column|null = this.right;
            while (true) {
                rightColumn = grid.getNextColumn(rightColumn);
                if (
                    rightColumn === null ||
                    requireVisible && !rightColumn.isVisible(visibleRange, true) ||
                    this.width + gap + rightColumn.getWidth() > visibleRange.getWidth()
                ) {
                    break;
                }
                this.addRight(rightColumn, gap);
            }
        }

        public addLeft(column: Column, gap: number) {
            this.left = column;
            this.width += column.getWidth() + gap;
        }

        public addRight(column: Column, gap: number) {
            this.right = column;
            this.width += column.getWidth() + gap;
        }

        public getLeft() {
            return this.left.getLeft();
        }

        public getRight() {
            return this.right.getRight();
        }

        public getWidth() {
            return this.width;
        }
    }
}
