namespace Actions {
    export class Getter {
        private readonly actions: Actions;
        private readonly numActions: NumActions;

        constructor(world: World, config: Config) {
            this.actions = new Actions(world, config);
            this.numActions = new NumActions(world);
        }

        public getAction(action: keyof Actions) {
            return this.actions[action].bind(this.actions);
        }

        public getNumAction(action: keyof NumActions) {
            return this.numActions[action].bind(this.numActions);
        }
    }

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
