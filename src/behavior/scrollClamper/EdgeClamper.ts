class EdgeClamper {
    public clampScrollX(desktop: Desktop, x: number) {
        let minScroll = 0;
        let maxScroll = desktop.grid.getWidth() - desktop.tilingArea.width;
        if (maxScroll < 0) {
            return Math.round(maxScroll / 2);
        }
        return clamp(x, minScroll, maxScroll);
    }
}
