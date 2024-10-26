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
        const landmarks = buildLandmarks(items);
        const ranges: Range[] = [];
        let n = 0;
        for (let i = 1; i < landmarks.length; i++) {
            const startLandmark = landmarks[i-1];
            const endLandmark = landmarks[i];
            n = n - startLandmark.nMax + startLandmark.nMin;
            ranges.push({
                start: startLandmark.value,
                end: endLandmark.value,
                n: n,
            });
        }
        return ranges;
    }

    function buildLandmarks(items: { min: number, max: number }[]) {
        const landmarks = new Map<number, Landmark>();
        for (const item of items) {
            mapGetOrInit(landmarks, item.min, { value: item.min, nMin: 0, nMax: 0 }).nMin++;
            mapGetOrInit(landmarks, item.max, { value: item.max, nMin: 0, nMax: 0 }).nMax++;
        }

        const array = Array.from(landmarks.values());
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

    type Range = {
        start: number,
        end: number,
        n: number,
    };

    type Landmark = {
        value: number,
        nMin: number,
        nMax: number,
    }
}
