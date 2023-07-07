class ScrollView {
    public readonly world: World;
    public readonly grid: Grid;
    private scrollX: number;
    public clientArea: QRect;
    public tilingArea: QRect;
    public readonly desktop: number;

    constructor(world: World, desktop: number) {
        this.world = world;
        this.scrollX = 0;
        this.desktop = desktop;
        this.grid = new Grid(this);
        this.updateArea();
    }

    updateArea() {
        const newClientArea = workspace.clientArea(workspace.PlacementArea, 0, this.desktop);
        if (newClientArea === this.clientArea) {
            return;
        }

        this.clientArea = newClientArea;
        this.tilingArea = Qt.rect(
            newClientArea.x + this.world.config.gapsOuterLeft,
            newClientArea.y + this.world.config.gapsOuterTop,
            newClientArea.width - this.world.config.gapsOuterLeft - this.world.config.gapsOuterRight,
            newClientArea.height - this.world.config.gapsOuterTop - this.world.config.gapsOuterBottom,
        )
        this.grid.onScreenSizeChanged();

        this.autoAdjustScroll();
    }

    scrollToColumn(column: Column) {
        const left = this.gridToTilingSpace(column.getLeft());
        const right = this.gridToTilingSpace(column.getRight());
        if (left < 0) {
            this.adjustScroll(left, false);
        } else if (right > this.tilingArea.width) {
            this.adjustScroll(right - this.tilingArea.width, false);
        } else {
            this.removeOverscroll();
            return;
        }

        const remainingSpace = this.tilingArea.width - this.grid.getVisibleColumnsWidth(this.getScrollPos(), true);
        const overScrollX = Math.min(this.world.config.overscroll, Math.round(remainingSpace / 2));
        const direction = left < 0 ? -1 : 1;
        this.adjustScroll(overScrollX * direction, false);
    }

    scrollCenterColumn(column: Column) {
        const windowCenter = this.gridToTilingSpace(column.getRight() / 2 + this.world.config.gapsInnerHorizontal);
        const screenCenter = this.tilingArea.x + this.tilingArea.width / 2;
        this.adjustScroll(Math.round(windowCenter - screenCenter), false);
    }

    private autoAdjustScroll() {
        const focusedWindow = this.world.getFocusedWindow();
        if (focusedWindow === null) {
            this.removeOverscroll();
            return;
        }

        const column = focusedWindow.column;
        if (column.grid !== this.grid) {
            return;
        }
        this.scrollToColumn(column);
    }

    public getScrollPos() {
        return {
            left: this.scrollX,
            right: this.scrollX + this.tilingArea.width,
        };
    }

    private setScroll(x: number, force: boolean) {
        if (!force) {
            let minScroll = 0;
            let maxScroll = this.grid.getWidth() - this.tilingArea.width;
            if (maxScroll < 0) {
                const centerScroll = Math.round(maxScroll / 2);
                minScroll = centerScroll;
                maxScroll = centerScroll;
            }
            x = clamp(x, minScroll, maxScroll);
        }
        this.scrollX = x;
    }

    adjustScroll(dx: number, force: boolean) {
        this.setScroll(this.scrollX + dx, force);
    }

    private removeOverscroll() {
        this.setScroll(this.scrollX, false);
    }

    public arrange() {
        // TODO (optimization): only arrange visible windows
        this.updateArea();
        this.grid.arrange(this.tilingArea.x - this.scrollX);
    }

    // convert x coordinate from grid space to tilingArea space
    gridToTilingSpace(x: number) {
        return x - this.scrollX;
    }

    public onGridWidthChanged() {
        this.autoAdjustScroll();
    }

    public onGridReordered() {
        this.autoAdjustScroll();
    }

    public destroy() {
        this.grid.destroy();
    }
}

type ScrollPos = { // TODO: use Qt Rect
    left: number,
    right: number,
}
