class MockQmlPoint {
    public readonly __brand = "QmlPoint";

    constructor(
        public x: number,
        public y: number,
    ) {}

    public clone() {
        return new MockQmlPoint(
            this.x,
            this.y,
        );
    }
}
