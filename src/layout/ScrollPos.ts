class ScrollPos {
    public readonly x: number;
    public readonly width: number;

    constructor(x: number, width: number) {
        this.x = x;
        this.width = width;
    }

    public getLeft() {
        return this.x;
    }

    public getRight() {
        return this.x + this.width;
    }
}
