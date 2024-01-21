class Desktop {
    public readonly grid: Grid;
    public readonly desktopNumber: number;
    private readonly pinManager: PinManager;
    private readonly config: Desktop.Config;
    private scrollX: number;
    private dirty: boolean;
    private dirtyScroll: boolean;
    private dirtyPins: boolean;
    public clientArea: QmlRect;
    public tilingArea: QmlRect;

    constructor(desktopNumber: number, pinManager: PinManager, config: Desktop.Config, layoutConfig: LayoutConfig) {
        this.pinManager = pinManager;
        this.config = config;
        this.scrollX = 0;
        this.dirty = true;
        this.dirtyScroll = true;
        this.dirtyPins = true;
        this.desktopNumber = desktopNumber;
        this.grid = new Grid(this, layoutConfig);
        this.clientArea = Desktop.getClientArea(desktopNumber);
        this.tilingArea = Desktop.getTilingArea(this.clientArea, desktopNumber, pinManager, config);
    }

    private updateArea() {
        const newClientArea = Desktop.getClientArea(this.desktopNumber);
        if (newClientArea === this.clientArea && !this.dirtyPins) {
            return;
        }
        this.clientArea = newClientArea;
        this.tilingArea = Desktop.getTilingArea(newClientArea, this.desktopNumber, this.pinManager, this.config);
        this.dirty = true;
        this.dirtyScroll = true;
        this.dirtyPins = false;
        this.grid.onScreenSizeChanged();
        this.autoAdjustScroll();
    }

    private static getClientArea(desktopNumber: number) {
        return workspace.clientArea(ClientAreaOption.PlacementArea, 0, desktopNumber);
    }

    private static getTilingArea(clientArea: QmlRect, desktopNumber: number, pinManager: PinManager, config: Desktop.Config) {
        const availableSpace = pinManager.getAvailableSpace(desktopNumber, clientArea);
        const top = availableSpace.top + config.marginTop;
        const bottom = availableSpace.bottom - config.marginBottom;
        const left = availableSpace.left + config.marginLeft;
        const right = availableSpace.right - config.marginRight;
        return Qt.rect(
            left,
            top,
            right - left,
            bottom - top,
        )
    }

    // calculates a Range that scrolls the contained Range into view
    public calculateVisibleRange(containedRange: Desktop.Range) {
        const left = containedRange.getLeft();
        const right = containedRange.getRight();
        const initialVisibleRange = this.getCurrentVisibleRange();

        let targetScrollX: number;
        if (left < initialVisibleRange.getLeft()) {
            targetScrollX = left;
        } else if (right > initialVisibleRange.getRight()) {
            targetScrollX = right - this.tilingArea.width;
        } else {
            return this.getVisibleRange(this.clampScrollX(this.scrollX));
        }

        const overscroll = this.getTargetOverscroll(targetScrollX, left < initialVisibleRange.getLeft());
        return this.getVisibleRange(this.clampScrollX(targetScrollX + overscroll));
    }

    private getTargetOverscroll(targetScrollX: number, scrollLeft: boolean) {
        if (this.config.overscroll === 0) {
            return 0;
        }
        const visibleColumnsWidth = this.grid.getVisibleColumnsWidth(this.getVisibleRange(targetScrollX), true);
        const remainingSpace = this.tilingArea.width - visibleColumnsWidth;
        const overscrollX = Math.min(this.config.overscroll, Math.round(remainingSpace / 2));
        const direction = scrollLeft ? -1 : 1;
        return overscrollX * direction;
    }

    public scrollToRange(range: Desktop.Range) {
        this.setScroll(this.calculateVisibleRange(range).getLeft(), true);
    }

    public scrollCenterRange(range: Desktop.Range) {
        const windowCenter = range.getLeft() + range.getWidth() / 2;
        const screenCenter = this.scrollX + this.tilingArea.width / 2;
        this.adjustScroll(Math.round(windowCenter - screenCenter), false);
    }

    public scrollCenterVisible(focusedColumn: Column) {
        const columnRange = new Desktop.ColumnRange(focusedColumn);
        const visibleRange = this.getCurrentVisibleRange();
        columnRange.addNeighbors(visibleRange, this.grid.config.gapsInnerHorizontal, column => column.isVisible(visibleRange, true));
        columnRange.addNeighbors(visibleRange, this.grid.config.gapsInnerHorizontal, () => true);
        this.scrollCenterRange(columnRange);
    }

    public autoAdjustScroll() {
        const focusedColumn = this.grid.getLastFocusedColumn();
        if (focusedColumn === null || focusedColumn.grid !== this.grid) {
            return;
        }

        this.scrollToColumn(focusedColumn);
    }

    public scrollToColumn(column: Column) {
        if (this.dirtyScroll || !column.isVisible(this.getCurrentVisibleRange(), true)) {
            this.config.scroller.scrollToColumn(this, column);
        }
    }

    private getVisibleRange(scrollX: number) {
        return new Desktop.RangeImpl(scrollX, this.tilingArea.width);
    }

    public getCurrentVisibleRange() {
        return this.getVisibleRange(this.scrollX);
    }

    private clampScrollX(x: number) {
        return this.config.scroller.clampScrollX(this, x);
    }

    public setScroll(x: number, force: boolean) {
        const oldScrollX = this.scrollX;
        this.scrollX = force ? x : this.clampScrollX(x);
        if (this.scrollX !== oldScrollX) {
            this.onLayoutChanged();
        }
        this.dirtyScroll = false;
    }

    public adjustScroll(dx: number, force: boolean) {
        this.setScroll(this.scrollX + dx, force);
    }

    public equalizeVisibleColumnsWidths() {
        const visibleRange = this.getCurrentVisibleRange();
        const visibleColumns = Array.from(this.grid.getVisibleColumns(visibleRange, true));

        let remainingWidth = this.tilingArea.width - (visibleColumns.length-1) * this.grid.config.gapsInnerHorizontal;
        let remainingColumns = visibleColumns.length;

        const minWidths = visibleColumns.map(column => column.getMinWidth()).sort((a, b) => b - a);
        for (const minWidth of minWidths) {
            if (minWidth > remainingWidth / remainingColumns) {
                remainingWidth -= minWidth;
                remainingColumns--;
            }
        }

        const avgWidth = remainingWidth / remainingColumns;
        for (const column of visibleColumns) {
            const minWidth = column.getMinWidth();
            if (minWidth > avgWidth) {
                column.setWidth(minWidth, true);
            } else {
                const columnWidth = Math.round(remainingWidth / remainingColumns);
                column.setWidth(columnWidth, true);
                remainingWidth -= column.getWidth();
                remainingColumns--;
            }
        }

        this.scrollCenterRange(Desktop.RangeImpl.fromRanges(
            visibleColumns[0],
            visibleColumns[visibleColumns.length - 1],
        ));
    }

    public arrange() {
        // TODO (optimization): only arrange visible windows
        this.updateArea();
        if (!this.dirty) {
            return;
        }
        this.grid.arrange(this.tilingArea.x - this.scrollX, this.getCurrentVisibleRange());
        this.dirty = false;
    }

    public onLayoutChanged() {
        this.dirty = true;
        this.dirtyScroll = true;
    }

    public onPinsChanged() {
        this.dirty = true;
        this.dirtyScroll = true;
        this.dirtyPins = true;
    }

    public destroy() {
        this.grid.destroy();
    }
}

namespace Desktop {
    export type Config = {
        marginTop: number,
        marginBottom: number,
        marginLeft: number,
        marginRight: number,
        overscroll: number,
        scroller: Desktop.Scroller,
    };

    export type Range = {
        getLeft(): number;
        getRight(): number;
        getWidth(): number;
    }

    export class RangeImpl {
        private readonly x: number;
        private readonly width: number;

        constructor(x: number, width: number) {
            this.x = x;
            this.width = width;
        }

        public getLeft() {
            return this.x;
        }

        public getRight() {
            return this.x + this.width;
        }

        public getWidth() {
            return this.width;
        }

        public static fromRanges(leftRange: Range, rightRange: Range) {
            const left = leftRange.getLeft();
            const right = rightRange.getRight();
            return new RangeImpl(left, right - left);
        }
    }

    export class ColumnRange {
        private left: Column;
        private right: Column;
        private width: number;

        constructor(initialColumn: Column) {
            this.left = initialColumn;
            this.right = initialColumn;
            this.width = initialColumn.getWidth();
        }

        public addNeighbors(visibleRange: Desktop.Range, gap: number, condition: (column: Column) => boolean) {
            const grid = this.left.grid;

            const columnRange = this;
            function canFit(column: Column) {
                return columnRange.width + gap + column.getWidth() <= visibleRange.getWidth()
            }
            function isUsable(column: Column|null) {
                return column !== null &&
                    canFit(column) &&
                    condition(column)
            }

            let leftColumn = grid.getPrevColumn(this.left);
            let rightColumn = grid.getNextColumn(this.right);
            function checkColumns() {
                if (!isUsable(leftColumn)) {
                    leftColumn = null;
                }
                if (!isUsable(rightColumn)) {
                    rightColumn = null;
                }
            }
            checkColumns();

            while (leftColumn !== null || rightColumn !== null) {
                const leftWidth = leftColumn === null ? 0 : leftColumn.getWidth();
                const rightWidth = rightColumn === null ? 0 : rightColumn.getWidth();
                if (leftWidth > rightWidth) {
                    this.addLeft(leftColumn!, gap);
                    leftColumn = grid.getPrevColumn(leftColumn!);
                } else {
                    this.addRight(rightColumn!, gap);
                    rightColumn = grid.getNextColumn(rightColumn!);
                }
                checkColumns();
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

    export type Scroller = {
        scrollToColumn(desktop: Desktop, column: Column): void;
        clampScrollX(desktop: Desktop, x: number): number;
    }
}
