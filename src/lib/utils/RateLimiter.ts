class RateLimiter {
    private i = 0;
    private intervalStart = 0;

    constructor(
        private readonly n: number,
        private readonly intervalMs: number,
    ) {}

    public acquire() {
        const now = Date.now();
        if (now - this.intervalStart >= this.intervalMs) {
            this.i = 0;
            this.intervalStart = now;
        }

        if (this.i < this.n) {
            this.i++;
            return true;
        } else {
            return false;
        }
    }
}
