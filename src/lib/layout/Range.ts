type Range = {
    getLeft(): number;
    getRight(): number;
    getWidth(): number;
};

namespace Range {
    export class Basic {
        private readonly x: number;
        private readonly width: number;

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

        public getWidth() {
            return this.width;
        }

        public static fromRanges(leftRange: Range, rightRange: Range) {
            const left = leftRange.getLeft();
            const right = rightRange.getRight();
            return new Basic(left, right - left);
        }
    }

    export function contains(parent: Range, child: Range) {
        return child.getLeft() >= parent.getLeft() &&
            child.getRight() <= parent.getRight();
    }
}
