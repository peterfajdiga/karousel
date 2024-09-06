interface Function {
    partial<H, T extends any[], R>(
        this: (head: H, ...tail: T) => R,
        head: H,
    ) : (...tail: T) => R;
}

Function.prototype.partial = function<H, T extends any[]>(head: H) {
    return (...tail: T) => this(head, ...tail);
}
