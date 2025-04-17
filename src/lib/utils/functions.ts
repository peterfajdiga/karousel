interface Function {
    partial<H extends any[], T extends any[], R>(
        this: (...args: [...H, ...T]) => R,
        ...head: H
    ) : (...tail: T) => R;
}

Function.prototype.partial = function<H extends any[], T extends any[]>(...head: H) {
    return (...tail: T) => this(...head, ...tail);
};
