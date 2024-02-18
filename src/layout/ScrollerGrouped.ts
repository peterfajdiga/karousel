class ScrollerGrouped {
    public scrollToColumn(desktop: Desktop, column: Column) {
        desktop.scrollCenterVisible(column);
    }

    public clampScrollX(desktop: Desktop, x: number) {
        return ScrollerCentered.clampScrollX(desktop, x);
    }
}
