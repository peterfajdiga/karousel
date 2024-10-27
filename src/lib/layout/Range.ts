type Range = {
    getLeft(): number;
    getRight(): number;
    getWidth(): number;
};

type SuperRange = Range & {
    contains(child: Range): boolean;
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

        public contains(child: Range) {
            return child.getLeft() >= this.getLeft() &&
                child.getRight() <= this.getRight();
        }

        public static fromRanges(leftRange: Range, rightRange: Range) {
            const left = leftRange.getLeft();
            const right = rightRange.getRight();
            return new Basic(left, right - left);
        }
    }
}
