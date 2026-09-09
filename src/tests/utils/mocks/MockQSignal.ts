class MockQSignal<T extends unknown[]> {
    public readonly __brand = "QSignal";

    private readonly handlers = new Set<(...args: [...T]) => void>();

    public connect(handler: (...args: [...T]) => void) {
        this.handlers.add(handler);
    };

    public disconnect(handler: (...args: [...T]) => void) {
        this.handlers.delete(handler);
    };

    public fire(...args: [...T]) {
        // Like Qt, don't call handlers that get connected or disconnected during this emission
        for (const handler of Array.from(this.handlers)) {
            if (this.handlers.has(handler)) {
                handler(...args);
            }
        }
    }
}
