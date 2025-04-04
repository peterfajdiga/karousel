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

function pointEquals(a: QmlPoint, b: QmlPoint) {
    return a.x === b.x &&
        a.y === b.y;
}

function rectContainsPoint(rect: QmlRect, point: QmlPoint) {
    return rect.left <= point.x &&
        rect.right >= point.x &&
        rect.top <= point.y &&
        rect.bottom >= point.y;
}
