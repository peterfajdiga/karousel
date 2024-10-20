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

function findMeanInt(sum: number, constraints: { min: number, max: number }[]) {
    let mean = Math.floor(sum / constraints.length);
    while (true) {
        let actualSum = 0;
        let increasable = 0;
        let decreasable = 0;
        let low = -Infinity;
        let high = Infinity;
        for (const constraint of constraints) {
            const value = clamp(mean, constraint.min, constraint.max);
            actualSum += value;
            if (mean > constraint.min) {
                decreasable++;
                if (value > low) {
                    low = value;
                }
            }
            if (mean < constraint.max) {
                increasable++;
                if (value < high) {
                    high = value;
                }
            }
        }

        const oldMean = mean;
        const error = actualSum - sum;
        if (error > 0) {
            // need to decrease mean
            if (decreasable > 0) {
                mean = Math.floor(low - error / decreasable);
            }
        } else if (error < 0) {
            // need to increase mean
            if (increasable > 0) {
                mean = Math.floor(high - error / increasable);
            }
        }

        if (mean === oldMean) {
            return mean;
        }
    }
}

function rectEquals(a: QmlRect, b: QmlRect) {
    return a.x === b.x &&
        a.y === b.y &&
        a.width === b.width &&
        a.height === b.height;
}
