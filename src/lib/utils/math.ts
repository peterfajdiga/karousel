function clamp(value: number, min: number, max: number) {
    if (value < min) {
        return min;
    }
    if (value > max) {
        return max;
    }
    return value;
}

function sum(...list: number[]) {
    return list.reduce((acc, val) => acc + val);
}

function rectEquals(a: QmlRect, b: QmlRect) {
    return a.x === b.x &&
        a.y === b.y &&
        a.width === b.width &&
        a.height === b.height;
}
