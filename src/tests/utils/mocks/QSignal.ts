namespace Mocks {
    export class QSignal<T extends unknown[]> {
        private readonly handlers: Set<(...args: [...T]) => void> = new Set();

        public connect(handler: (...args: [...T]) => void) {
            this.handlers.add(handler);
        };

        public disconnect(handler: (...args: [...T]) => void) {
            this.handlers.delete(handler);
        };

        public fire(...args: [...T]) {
            for (const handler of this.handlers) {
                handler(...args);
            }
        }
    }
}
