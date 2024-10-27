type Range = {
    getLeft(): number;
    getRight(): number;
    getWidth(): number;
};

namespace Range {
    class Basic {
        constructor(
            private readonly x: number,
            private readonly width: number,
        ) {}

        public getLeft() {
            return this.x;
        }

        public getRight() {
            return this.x + this.width;
        }

        public getWidth() {
            return this.width;
        }
    }

    export function create(x: number, width: number) {
        return new Basic(x, width);
    }

    export function fromRanges(leftRange: Range, rightRange: Range) {
        const left = leftRange.getLeft();
        const right = rightRange.getRight();
        return new Basic(left, right - left);
    }

    export function contains(parent: Range, child: Range) {
        return child.getLeft() >= parent.getLeft() &&
            child.getRight() <= parent.getRight();
    }
}
