class Desktop {
    public readonly grid: Grid;
    private scrollX: number;
    private phantomScrollX: number | null;
    private dirty: boolean;
    private dirtyScroll: boolean;
    private dirtyPins: boolean;
    public clientArea: QmlRect;
    public tilingArea: QmlRect;

    constructor(
        public readonly kwinDesktop: KwinDesktop,
        private readonly pinManager: PinManager,
        private readonly config: Desktop.Config,
        private readonly getScreen: () => Output,
        layoutConfig: LayoutConfig,
    ) {
        this.scrollX = 0;
        this.phantomScrollX = null;
        this.dirty = true;
        this.dirtyScroll = true;
        this.dirtyPins = true;
        this.grid = new Grid(this, layoutConfig);
        this.clientArea = Desktop.getClientArea(this.getScreen(), kwinDesktop);
        this.tilingArea = Desktop.getTilingArea(this.clientArea, kwinDesktop, pinManager, config);
    }

    private updateArea() {
        const newClientArea = Desktop.getClientArea(this.getScreen(), this.kwinDesktop);
        if (rectEquals(newClientArea, this.clientArea) && !this.dirtyPins) {
            return;
        }
        this.clientArea = newClientArea;
        this.tilingArea = Desktop.getTilingArea(newClientArea, this.kwinDesktop, this.pinManager, this.config);
        this.dirty = true;
        this.dirtyScroll = true;
        this.dirtyPins = false;
        this.grid.onScreenSizeChanged();
        this.autoAdjustScroll();
    }

    private static getClientArea(screen: Output, kwinDesktop: KwinDesktop) {
        return Workspace.clientArea(ClientAreaOption.PlacementArea, screen, kwinDesktop);
    }

    private static getTilingArea(clientArea: QmlRect, kwinDesktop: KwinDesktop, pinManager: PinManager, config: Desktop.Config) {
        const availableSpace = pinManager.getAvailableSpace(kwinDesktop, clientArea);
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

    public scrollIntoView(range: Range) {
        const left = range.getLeft();
        const right = range.getRight();
        const initialVisibleRange = this.getCurrentVisibleRange();

        let targetScrollX: number;
        if (left < initialVisibleRange.getLeft()) {
            targetScrollX = left;
        } else if (right > initialVisibleRange.getRight()) {
            targetScrollX = right - this.tilingArea.width;
        } else {
            targetScrollX = initialVisibleRange.getLeft();
        }

        this.setScroll(targetScrollX, false);
    }

    public scrollCenterRange(range: Range) {
        const scrollAmount = Range.minus(range, this.getCurrentVisibleRange());
        this.adjustScroll(scrollAmount, true);
    }

    public scrollCenterVisible(focusedColumn: Column) {
        const columnRange = new Desktop.ColumnRange(focusedColumn);
        const visibleRange = this.getCurrentVisibleRange();
        columnRange.addNeighbors(visibleRange, this.grid.config.gapsInnerHorizontal);
        this.scrollCenterRange(columnRange);
    }

    public autoAdjustScroll() {
        const focusedColumn = this.grid.getLastFocusedColumn();
        if (focusedColumn === null || focusedColumn.grid !== this.grid) {
            return;
        }

        this.scrollToColumn(focusedColumn, false);
    }

    public scrollToColumn(column: Column, force: boolean) {
        if (force || this.dirtyScroll || !Range.contains(this.getCurrentVisibleRange(), column)) {
            this.config.scroller.scrollToColumn(this, column);
        }
    }

    private getVisibleRange(scrollX: number) {
        return Range.create(scrollX, this.tilingArea.width);
    }

    public getCurrentVisibleRange() {
        return this.getVisibleRange(this.scrollX);
    }

    private clampScrollX(x: number) {
        return this.config.clamper.clampScrollX(this, x);
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

    public gestureScroll(progress: number) {
        if (this.phantomScrollX === null) {
            this.phantomScrollX = this.scrollX;
        }

        if (this.config.naturalScrolling) {
            progress = -progress;
        }
        this.setScroll(this.phantomScrollX + this.clientArea.width * progress, false);
        this.arrange();
    }

    public finishGesture() {
        this.phantomScrollX = null;
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

    public forceArrange() {
        this.dirty = true;
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
        marginTop: number;
        marginBottom: number;
        marginLeft: number;
        marginRight: number;
        naturalScrolling: boolean;
        scroller: Desktop.Scroller;
        clamper: Desktop.Clamper;
    };

    export class ColumnRange {
        private left: Column;
        private right: Column;
        private width: number;

        constructor(initialColumn: Column) {
            this.left = initialColumn;
            this.right = initialColumn;
            this.width = initialColumn.getWidth();
        }

        public addNeighbors(visibleRange: Range, gap: number) {
            const grid = this.left.grid;

            const columnRange = this;
            function canFit(column: Column) {
                return columnRange.width + gap + column.getWidth() <= visibleRange.getWidth();
            }
            function isUsable(column: Column|null) {
                return column !== null && canFit(column);
            }

            let leftColumn = grid.getLeftColumn(this.left);
            let rightColumn = grid.getRightColumn(this.right);
            function checkColumns() {
                if (!isUsable(leftColumn)) {
                    leftColumn = null;
                }
                if (!isUsable(rightColumn)) {
                    rightColumn = null;
                }
            }
            checkColumns();

            const visibleCenter = visibleRange.getLeft() + visibleRange.getWidth() / 2;
            while (leftColumn !== null || rightColumn !== null) {
                const leftToCenter = leftColumn === null ? Infinity : Math.abs(leftColumn.getLeft() - visibleCenter);
                const rightToCenter = rightColumn === null ? Infinity : Math.abs(rightColumn.getRight() - visibleCenter);
                if (leftToCenter < rightToCenter) {
                    this.addLeft(leftColumn!, gap);
                    leftColumn = grid.getLeftColumn(leftColumn!);
                } else {
                    this.addRight(rightColumn!, gap);
                    rightColumn = grid.getRightColumn(rightColumn!);
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
    };

    export type Clamper = {
        clampScrollX(desktop: Desktop, x: number): number;
    };
}
