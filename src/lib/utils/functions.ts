interface Number {
    round(this: number): number;
    floor(this: number): number;
    ceil(this: number): number;
}

Number.prototype.round = function() {
    return Math.round(this);
};

Number.prototype.floor = function() {
    return Math.floor(this);
};

Number.prototype.ceil = function() {
    return Math.ceil(this);
};

interface Function {
    partial<H extends any[], T extends any[], R>(
        this: (...args: [...H, ...T]) => R,
        ...head: H
    ) : (...tail: T) => R;
}

Function.prototype.partial = function<H extends any[], T extends any[]>(...head: H) {
    return (...tail: T) => this(...head, ...tail);
};
