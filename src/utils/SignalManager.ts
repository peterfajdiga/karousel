class SignalManager {
    private connections: { signal: QSignal, handler: (...args: any[]) => void }[];

    constructor() {
        this.connections = [];
    }

    public connect(signal: QSignal, handler: (...args: any[]) => void) {
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
