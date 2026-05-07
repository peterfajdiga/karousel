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

function rectRight(rect: QmlRect) {
    return rect.x + rect.width;
}

function rectBottom(rect: QmlRect) {
    return rect.y + rect.height;
}

function rectContainsPoint(rect: QmlRect, point: QmlPoint) {
    return rect.x <= point.x &&
        rectRight(rect) >= point.x &&
        rect.y <= point.y &&
        rectBottom(rect) >= point.y;
}

function roundQtRect(rect: QmlRect) {
    return Qt.rect(
        rect.x.round(),
        rect.y.round(),
        rect.width.round(),
        rect.height.round(),
    );
}

function rectRightRound(rect: QmlRect) {
    return rect.x.round() + rect.width.round();
}

function rectBottomRound(rect: QmlRect) {
    return rect.y.round() + rect.height.round();
}
