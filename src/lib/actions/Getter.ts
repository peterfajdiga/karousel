namespace Actions {
    export class Getter {
        private readonly actions: Actions;

        constructor(world: World, config: Config) {
            this.actions = new Actions(world, config);
        }

        public getAction(action: string) {
            return this.actions.getAction(action);
        }

        public getNumAction(action: string) {
            return this.actions.getNumAction(action);
        }
    }

    export type Config = {
        manualScrollStep: number,
        manualResizeStep: number,
        columnResizer: ColumnResizer,
    };

    export type ColumnResizer = {
        increaseWidth(column: Column, step: number): void,
        decreaseWidth(column: Column, step: number): void,
    }
}
