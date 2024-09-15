class MockQmlTimer {
    public interval = 0;
    public readonly triggered = new MockQSignal();

    public restart() {
        // no need to wait in tests, just fire immediately
        this.triggered.fire();
    };

    public destroy() {}
}
