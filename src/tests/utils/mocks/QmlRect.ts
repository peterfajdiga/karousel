namespace Mocks {
    export class QmlRect {
        constructor(
            public x: number,
            public y: number,
            public width: number,
            public height: number,
        ) {}

        get top() {
            return this.y;
        }

        get bottom() {
            return this.y + this.height;
        }

        get left() {
            return this.x;
        }

        get right() {
            return this.x + this.width;
        }
    }
}
