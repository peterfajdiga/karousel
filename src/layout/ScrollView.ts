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
        for (const column of this.grid.columns.iterator()) {
            column.resizeWindows();
        }

        this.autoAdjustScroll();
    }

    getLeftmostVisibleColumn(fullyVisible: boolean) {
        for (const column of this.grid.columns.iterator()) {
            const left = this.gridToTilingSpace(column.getLeft());
            const right = left + column.width;
            const x = fullyVisible ? left : right;
            if (x >= 0) {
                return column;
            }
        }
        return null;
    }

    getRightmostVisibleColumn(fullyVisible: boolean) {
        let last = null;
        for (const column of this.grid.columns.iterator()) {
            const left = this.gridToTilingSpace(column.getLeft());
            const right = left + column.width;
            const x = fullyVisible ? right : left;
            if (x <= this.tilingArea.width) {
                last = column;
            } else {
                break;
            }
        }
        return last;
    }

    isColumnVisible(column: Column, fullyVisible: boolean) {
        const left = this.gridToTilingSpace(column.getLeft());
        const right = this.gridToTilingSpace(column.getRight());
        if (fullyVisible) {
            return left >= 0 && right <= this.tilingArea.width;
        } else {
            return right >= 0 && left <= this.tilingArea.width;
        }
    }

    getVisibleColumnsWidth(fullyVisible: boolean) {
        let width = 0;
        let nVisible = 0;
        for (const column of this.grid.columns.iterator()) {
            if (this.isColumnVisible(column, fullyVisible)) {
                width += column.width;
                nVisible++;
            }
        }

        if (nVisible > 0) {
            width += (nVisible-1) * this.world.config.gapsInnerHorizontal;
        }

        return width;
    }

    getLeftOffScreenColumn() {
        const leftVisible = this.getLeftmostVisibleColumn(true);
        if (leftVisible === null) {
            return null;
        }
        return this.grid.getPrevColumn(leftVisible);
    }

    getRightOffScreenColumn() {
        const rightVisible = this.getRightmostVisibleColumn(true);
        if (rightVisible === null) {
            return null;
        }
        return this.grid.getNextColumn(rightVisible);
    }

    increaseColumnWidth(column: Column) {
        this.scrollToColumn(column);
        if (this.grid.getWidth() < this.tilingArea.width) {
            column.adjustWidth(this.tilingArea.width - this.grid.getWidth(), false);
            this.arrange();
            return;
        }

        let leftColumn = this.getLeftmostVisibleColumn(false);
        if (leftColumn === column) {
            leftColumn = null;
        }
        let rightColumn = this.getRightmostVisibleColumn(false);
        if (rightColumn === column) {
            rightColumn = null;
        }
        if (leftColumn === null && rightColumn === null) {
            return;
        }

        const leftVisibleWidth = leftColumn === null ? Infinity : this.gridToTilingSpace(leftColumn.getRight());
        const rightVisibleWidth = rightColumn === null ? Infinity : this.tilingArea.width - this.gridToTilingSpace(rightColumn.getLeft());
        const expandLeft = leftVisibleWidth < rightVisibleWidth;
        const widthDelta = (expandLeft ? leftVisibleWidth : rightVisibleWidth) + this.world.config.gapsInnerHorizontal;
        if (expandLeft) {
            this.adjustScroll(widthDelta, false);
        }
        column.adjustWidth(widthDelta, true);
    }

    decreaseColumnWidth(column: Column) {
        this.scrollToColumn(column);
        if (this.grid.getWidth() <= this.tilingArea.width) {
            column.setWidth(Math.round(column.getWidth() / 2), false);
            this.arrange();
            return;
        }

        let leftColumn = this.getLeftOffScreenColumn();
        if (leftColumn === column) {
            leftColumn = null;
        }
        let rightColumn = this.getRightOffScreenColumn();
        if (rightColumn === column) {
            rightColumn = null;
        }
        if (leftColumn === null && rightColumn === null) {
            return;
        }

        const leftInvisibleWidth = leftColumn === null ? Infinity : -this.gridToTilingSpace(leftColumn.getLeft());
        const rightInvisibleWidth = rightColumn === null ? Infinity : this.gridToTilingSpace(rightColumn.getRight()) - this.tilingArea.width;
        const shrinkLeft = leftInvisibleWidth < rightInvisibleWidth;
        const widthDelta = (shrinkLeft ? leftInvisibleWidth : rightInvisibleWidth);
        if (shrinkLeft) {
            this.adjustScroll(-widthDelta, false);
        }
        column.adjustWidth(-widthDelta, true);
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

        const remainingSpace = this.tilingArea.width - this.getVisibleColumnsWidth(true);
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
