namespace Actions {
    export class Getter {
        private readonly actions: Actions;
        private readonly numActions: NumActions;

        constructor(world: World, config: Config) {
            this.actions = new Actions(world, config);
            this.numActions = new NumActions(world);
        }

        public getAction(action: string) {
            return this.actions.getAction(action);
        }

        public getNumAction(action: string) {
            return this.numActions.getNumAction(action);
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
