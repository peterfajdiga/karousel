class MockQSignal<T extends unknown[]> {
    public readonly __brand = "QSignal";

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
