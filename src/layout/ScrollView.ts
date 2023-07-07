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

    // calculates ScrollPos that scrolls the column into view
    public getScrollPosForColumn(column: Column) {
        const left = this.gridToTilingSpace(column.getLeft());
        const right = this.gridToTilingSpace(column.getRight());
        let scrollPos: ScrollPos;
        if (left < 0) {
            scrollPos = this.getScrollPos(this.clampScrollX(this.scrollX + left));
        } else if (right > this.tilingArea.width) {
            scrollPos = this.getScrollPos(this.clampScrollX(this.scrollX + right - this.tilingArea.width));
        } else {
            return this.getScrollPos(this.clampScrollX(this.scrollX));
        }

        const remainingSpace = this.tilingArea.width - this.grid.getVisibleColumnsWidth(scrollPos, true);
        const overScrollX = Math.min(this.world.config.overscroll, Math.round(remainingSpace / 2));
        const direction = left < 0 ? -1 : 1;
        return this.getScrollPos(this.clampScrollX(scrollPos.left + overScrollX * direction));
    }

    scrollToColumn(column: Column) {
        this.scrollX = this.getScrollPosForColumn(column).left;
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

    private getScrollPos(scrollX: number) {
        return {
            left: scrollX,
            right: scrollX + this.tilingArea.width,
        }
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
        this.scrollX = force ? x : this.clampScrollX(x);
    }

    private applyScrollPos(scrollPos: ScrollPos) {
        this.scrollX = scrollPos.left;
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

    // TODO: remove
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
