function fillSpace(availableSpace: number, items: { min: number, max: number }[]) {
    const mean = findMeanSpaceFiller(availableSpace, items);
    return items.map(item => clamp(mean, item.min, item.max));
}

function findMeanSpaceFiller(availableSpace: number, items: { min: number, max: number }[]) {
    const ranges = buildRanges(items);
    let requiredSpace = items.reduce((acc, item) => acc + item.min, 0);
    for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];
        const rangeSize = range.end - range.start;
        const maxRequiredSpaceDelta = rangeSize * range.n;
        if (requiredSpace + maxRequiredSpaceDelta >= availableSpace || i === ranges.length-1) {
            const positionInRange = (availableSpace - requiredSpace) / maxRequiredSpaceDelta;
            return Math.floor(range.start + rangeSize * positionInRange);
        }
        requiredSpace += maxRequiredSpaceDelta;
    }
    return 0;

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

        type Range = {
            start: number,
            end: number,
            n: number,
        };

        function buildLandmarks(items: { min: number, max: number }[]) {
            const landmarks = new Map<number, Landmark>();
            for (const item of items) {
                mapGetOrInit(landmarks, item.min, { value: item.min, nMin: 0, nMax: 0 }).nMin++;
                mapGetOrInit(landmarks, item.max, { value: item.max, nMin: 0, nMax: 0 }).nMax++;
            }

            const array = Array.from(landmarks.values());
            array.sort((a, b) => a.value - b.value);
            return array;

            type Landmark = {
                value: number,
                nMin: number,
                nMax: number,
            }
        }
    }
}
