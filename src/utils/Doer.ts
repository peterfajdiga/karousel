class Doer {
    private nCalls: number;

    constructor() {
        this.nCalls = 0;
    }

    public do (f: () => void) {
        this.nCalls++;
        f();
        this.nCalls--;
    }

    public isDoing() {
        return this.nCalls > 0;
    }
}
