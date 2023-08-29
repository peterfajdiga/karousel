class Desktop {
    public readonly grid: Grid;
    public readonly desktopNumber: number;
    private readonly config: Desktop.Config;
    private scrollX: number;
    private dirty: boolean;
    public clientArea: QRect;
    public tilingArea: QRect;

    constructor(desktopNumber: number, config: Desktop.Config, layoutConfig: LayoutConfig) {
        this.config = config;
        this.scrollX = 0;
        this.dirty = false;
        this.desktopNumber = desktopNumber;
        this.grid = new Grid(this, layoutConfig);
        this.clientArea = Desktop.getClientArea(desktopNumber);
        this.tilingArea = Desktop.getTilingArea(this.clientArea, config);
    }

    private updateArea() {
        const newClientArea = Desktop.getClientArea(this.desktopNumber);
        if (newClientArea === this.clientArea) {
            return;
        }
        this.tilingArea = Desktop.getTilingArea(this.clientArea, this.config);
        this.grid.onScreenSizeChanged();
        this.autoAdjustScroll();
    }

    private static getClientArea(desktopNumber: number) {
        return workspace.clientArea(workspace.PlacementArea, 0, desktopNumber);
    }

    private static getTilingArea(clientArea: QRect, config: Desktop.Config) {
        return Qt.rect(
            clientArea.x + config.marginLeft,
            clientArea.y + config.marginTop,
            clientArea.width - config.marginLeft - config.marginRight,
            clientArea.height - config.marginTop - config.marginBottom,
        )
    }

    // calculates Desktop.Pos that scrolls the column into view
    public getScrollPosForColumn(column: Column) {
        const left = column.getLeft();
        const right = column.getRight();
        const initialScrollPos = this.getCurrentScrollPos();

        let targetScrollX: number;
        if (left < initialScrollPos.getLeft()) {
            targetScrollX = left;
        } else if (right > initialScrollPos.getRight()) {
            targetScrollX = right - this.tilingArea.width;
        } else {
            return this.getScrollPos(this.clampScrollX(this.scrollX));
        }

        const overscroll = this.getTargetOverscroll(targetScrollX, left < initialScrollPos.getLeft());
        return this.getScrollPos(this.clampScrollX(targetScrollX + overscroll));
    }

    private getTargetOverscroll(targetScrollX: number, scrollLeft: boolean) {
        if (this.config.overscroll === 0) {
            return 0;
        }
        const visibleColumnsWidth = this.grid.getVisibleColumnsWidth(this.getScrollPos(targetScrollX), true);
        const remainingSpace = this.tilingArea.width - visibleColumnsWidth;
        const overscrollX = Math.min(this.config.overscroll, Math.round(remainingSpace / 2));
        const direction = scrollLeft ? -1 : 1;
        return overscrollX * direction;
    }

    public scrollToColumn(column: Column) {
        this.setScroll(this.getScrollPosForColumn(column).x, true);
    }

    public scrollCenterColumn(column: Column) {
        const windowCenter = column.getLeft() + column.getWidth() / 2;
        const screenCenter = this.scrollX + this.tilingArea.width / 2;
        this.adjustScroll(Math.round(windowCenter - screenCenter), false);
    }

    public autoAdjustScroll() {
        const focusedColumn = this.grid.getLastFocusedColumn();
        if (focusedColumn === null) {
            this.removeOverscroll();
            return;
        }

        if (focusedColumn.grid !== this.grid) {
            return;
        }

        this.scrollToColumn(focusedColumn);
    }

    private getScrollPos(scrollX: number) {
        return new Desktop.ScrollPos(scrollX, this.tilingArea.width);
    }

    public getCurrentScrollPos() {
        return this.getScrollPos(this.scrollX);
    }

    private clampScrollX(x: number) {
        let minScroll = 0;
        let maxScroll = this.grid.getWidth() - this.tilingArea.width;
        if (maxScroll < 0) {
            const centerScroll = Math.round(maxScroll / 2);
            minScroll = centerScroll;
            maxScroll = centerScroll;
        }
        return clamp(x, minScroll, maxScroll);
    }

    private setScroll(x: number, force: boolean) {
        const oldScrollX = this.scrollX;
        this.scrollX = force ? x : this.clampScrollX(x);
        if (this.scrollX !== oldScrollX) {
            this.onLayoutChanged();
        }
    }

    private applyScrollPos(scrollPos: Desktop.ScrollPos) {
        this.setScroll(scrollPos.x, true);
    }

    public adjustScroll(dx: number, force: boolean) {
        this.setScroll(this.scrollX + dx, force);
    }

    private removeOverscroll() {
        this.setScroll(this.scrollX, false);
    }

    public arrange() {
        // TODO (optimization): only arrange visible windows
        this.updateArea();
        if (!this.dirty) {
            return;
        }
        this.grid.arrange(this.tilingArea.x - this.scrollX);
        this.dirty = false;
    }

    public onLayoutChanged() {
        this.dirty = true;
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
    }

    export class ScrollPos {
        public readonly x: number;
        public readonly width: number;

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
    }
}