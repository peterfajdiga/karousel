namespace Actions {
    export type Config = {
        manualScrollStep: number;
        manualResizeStep: number;
        columnResizer: ColumnResizer;
    };

    export type ColumnResizer = {
        increaseWidth(column: Column, step: number): void;
        decreaseWidth(column: Column, step: number): void;
    };
}
