namespace Mocks {
    export class QmlRect {
        constructor(
            public x: number,
            public y: number,
            public width: number,
            public height: number,
        ) {}

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
    }
}
