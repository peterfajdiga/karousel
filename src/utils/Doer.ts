class Doer {
    private nCalls: number;

    constructor() {
        this.nCalls = 0;
    }

    do (f: () => void) {
        this.nCalls++;
        f();
        this.nCalls--;
    }

    isDoing() {
        return this.nCalls > 0;
    }
}
