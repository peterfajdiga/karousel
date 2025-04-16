function fillSpace(availableSpace: number, items: { min: number, max: number }[]) {
    if (items.length === 0) {
        return [];
    }

    const middleSize = findMiddleSize(availableSpace, items);
    const sizes = items.map(item => clamp(middleSize, item.min, item.max));
    if (middleSize !== Math.floor(availableSpace / items.length)) {
        distributeRemainder(availableSpace, middleSize, sizes, items);
    }
    return sizes;

    function findMiddleSize(availableSpace: number, items: { min: number, max: number }[]) {
        const ranges = buildRanges(items);
        let requiredSpace = items.reduce((acc, item) => acc + item.min, 0);
        for (const range of ranges) {
            const rangeSize = range.end - range.start;
            const maxRequiredSpaceDelta = rangeSize * range.n;
            if (requiredSpace + maxRequiredSpaceDelta >= availableSpace) {
                const positionInRange = (availableSpace - requiredSpace) / maxRequiredSpaceDelta;
                return Math.floor(range.start + rangeSize * positionInRange);
            }
            requiredSpace += maxRequiredSpaceDelta;
        }
        return ranges[ranges.length-1].end;
    }

    function buildRanges(items: { min: number, max: number }[]) {
        const fenceposts = extractFenceposts(items);
        if (fenceposts.length === 1) {
            return [{
                start: fenceposts[0].value,
                end: fenceposts[0].value,
                n: items.length,
            }];
        }

        const ranges: Range[] = [];
        let n = 0;
        for (let i = 1; i < fenceposts.length; i++) {
            const startFencepost = fenceposts[i-1];
            const endFencepost = fenceposts[i];
            n = n - startFencepost.nMax + startFencepost.nMin;
            ranges.push({
                start: startFencepost.value,
                end: endFencepost.value,
                n: n,
            });
        }
        return ranges;
    }

    function extractFenceposts(items: { min: number, max: number }[]) {
        const fenceposts = new Map<number, Fencepost>();
        for (const item of items) {
            mapGetOrInit(fenceposts, item.min, { value: item.min, nMin: 0, nMax: 0 }).nMin++;
            mapGetOrInit(fenceposts, item.max, { value: item.max, nMin: 0, nMax: 0 }).nMax++;
        }

        const array = Array.from(fenceposts.values());
        array.sort((a, b) => a.value - b.value);
        return array;
    }

    function distributeRemainder(availableSpace: number, middleSize: number, sizes: number[], constraints: { max: number }[]) {
        const indexes = Array.from(sizes.keys())
            .filter(i => sizes[i] === middleSize);
        indexes.sort((a, b) => constraints[a].max - constraints[b].max);

        const requiredSpace = sum(...sizes);
        let remainder = availableSpace - requiredSpace;
        let n = indexes.length;
        for (const i of indexes) {
            if (remainder <= 0) {
                break;
            }
            const enlargable = constraints[i].max - sizes[i];
            if (enlargable > 0) {
                const enlarge = Math.min(enlargable, Math.ceil(remainder / n));
                sizes[i] += enlarge;
                remainder -= enlarge;
            }
            n--;
        }
    }

    interface Range {
        start: number,
        end: number,
        n: number,
    }

    interface Fencepost {
        value: number,
        nMin: number,
        nMax: number,
    }
}
