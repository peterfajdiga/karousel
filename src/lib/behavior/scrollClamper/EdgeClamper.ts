class EdgeClamper {
    public clampScrollX(desktop: Desktop, x: number) {
        const minScroll = 0;
        const maxScroll = desktop.grid.getWidth() - desktop.tilingArea.width;
        if (maxScroll < 0) {
            return Math.round(maxScroll / 2);
        }
        return clamp(x, minScroll, maxScroll);
    }
}
