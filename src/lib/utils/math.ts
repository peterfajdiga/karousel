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

function union<T>(array0: T[], array1: T[]) {
    const set = new Set([...array0, ...array1]);
    return [...set];
}

function uniq<T>(sortedArray: T[]) {
    const filtered = [];
    let lastItem;
    for (const item of sortedArray) {
        if (item !== lastItem) {
            filtered.push(item);
            lastItem = item;
        }
    }
    return filtered;
}

function rectEquals(a: QmlRect, b: QmlRect) {
    return a.x === b.x &&
        a.y === b.y &&
        a.width === b.width &&
        a.height === b.height;
}
