function clamp(value: number, min: number, max: number) {
    if (value < min) {
        return min;
    }
    if (value > max) {
        return max;
    }
    return value;
}

function union<T>(array0: T[], array1: T[]) {
    const set = new Set([...array0, ...array1]);
    return [...set];
}
