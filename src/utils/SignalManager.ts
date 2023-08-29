class SignalManager {
    private connections: { signal: QSignal<any>, handler: (...args: any) => void }[];

    constructor() {
        this.connections = [];
    }

    public connect<T extends unknown[]>(signal: QSignal<T>, handler: (...args: [...T]) => void) {
        signal.connect(handler);
        this.connections.push({ signal: signal, handler: handler });
    }

    public destroy() {
        for (const connection of this.connections) {
            connection.signal.disconnect(connection.handler);
        }
        this.connections = [];
    }
}
