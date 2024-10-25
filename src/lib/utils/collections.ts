function union<T>(array0: T[], array1: T[]) {
    const set = new Set([...array0, ...array1]);
    return [...set];
}

function uniq(sortedArray: any[]) {
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

function mapGetOrInit<K, V>(map: Map<K, V>, key: K, defaultItem: V) {
    const item = map.get(key);
    if (item !== undefined) {
        return item;
    } else {
        map.set(key, defaultItem);
        return defaultItem;
    }
}

function findMinPositive<T>(items: T[], evaluate: (item: T) => number) {
    let bestScore = Infinity;
    let bestItem = undefined;
    for (const item of items) {
        const score = evaluate(item);
        if (score > 0 && score < bestScore) {
            bestScore = score;
            bestItem = item;
        }
    }
    return bestItem;
}
