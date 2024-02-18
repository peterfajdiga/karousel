class RawResizer {
    public increaseWidth(column: Column, step: number) {
        column.adjustWidth(step, true);
    }

    public decreaseWidth(column: Column, step: number) {
        column.adjustWidth(-step, true);
    }
}
