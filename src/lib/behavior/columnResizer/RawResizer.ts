class RawResizer {
    constructor(
        private readonly presetWidths: { getWidths: (minWidth: number, maxWidth: number) => number[] },
    ) {}

    public increaseWidth(column: Column) {
        const newWidth = findMinPositive(
            [
                ...this.presetWidths.getWidths(column.getMinWidth(), column.getMaxWidth()),
            ],
            width => width - column.getWidth(),
        );
        if (newWidth === undefined) {
            return;
        }
        column.setWidth(newWidth, true);
    }

    public decreaseWidth(column: Column) {
        const newWidth = findMinPositive(
            [
                ...this.presetWidths.getWidths(column.getMinWidth(), column.getMaxWidth()),
            ],
            width => column.getWidth() - width,
        );
        if (newWidth === undefined) {
            return;
        }
        column.setWidth(newWidth, true);
    }

    public maximizeWidth(column: Column) {
        const presetWidths = this.presetWidths.getWidths(column.getMinWidth(), column.getMaxWidth());
        const maxWidth = presetWidths[presetWidths.length-1];
        column.setWidth(maxWidth, true);
    }

    public minimizeWidth(column: Column) {
        const presetWidths = this.presetWidths.getWidths(column.getMinWidth(), column.getMaxWidth());
        const minWidth = presetWidths[0];
        column.setWidth(minWidth, true);
    }
}
