class MockQmlRect {
    constructor(
        private _x: number,
        private _y: number,
        private _width: number,
        private _height: number,
        private readonly onChanged: (oldRect: MockQmlRect) => void = () => {},
    ) {}

    public get x() {
        return this._x;
    }

    public set x(x: number) {
        const oldRect = this.clone();
        this._x = x;
        this.onChanged(oldRect);
    }

    public get y() {
        return this._y;
    }

    public set y(y: number) {
        const oldRect = this.clone();
        this._y = y;
        this.onChanged(oldRect);
    }

    public get width() {
        return this._width;
    }

    public set width(width: number) {
        const oldRect = this.clone();
        this._width = width;
        this.onChanged(oldRect);
    }

    public get height() {
        return this._height;
    }

    public set height(height: number) {
        const oldRect = this.clone();
        this._height = height;
        this.onChanged(oldRect);
    }

    public get top() {
        return this.y;
    }

    public get bottom() {
        return this.y + this.height;
    }

    public get left() {
        return this.x;
    }

    public get right() {
        return this.x + this.width;
    }

    public clone() {
        return new MockQmlRect(
            this._x,
            this._y,
            this._width,
            this._height,
        );
    }

    public toString() {
        return `(${this.x} ${this.y} ${this.width} ${this.height})`;
    }
}
