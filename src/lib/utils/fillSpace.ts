function fillSpace(availableSpace: number, items: { min: number, max: number }[]) {
    const mean = findMeanSpaceFiller(availableSpace, items);
    return items.map(item => clamp(mean, item.min, item.max));
}

function findMeanSpaceFiller(availableSpace: number, items: { min: number, max: number }[]) {
    let mean = Math.floor(availableSpace / items.length);
    for (let i = 0; true; i++) {
        let requiredSpace = 0;
        let low = -Infinity;
        let high = Infinity;
        for (const item of items) {
            const size = clamp(mean, item.min, item.max);
            requiredSpace += size;
            if (mean > item.min) {
                if (size > low) {
                    low = size;
                }
            }
            if (mean < item.max) {
                if (size < high) {
                    high = size;
                }
            }
        }

        const oldMean = mean;
        const error = requiredSpace - availableSpace;
        if (error > 0) {
            // need to decrease mean
            let decreasable = 0;
            for (const item of items) {
                if (mean > item.min && low - error < item.max) {
                    decreasable++;
                }
            }
            if (decreasable > 0) {
                mean = Math.floor(low - error / decreasable);
            }
        } else if (error < 0) {
            // need to increase mean
            let increasable = 0;
            for (const item of items) {
                if (mean < item.max && high - error > item.min) {
                    increasable++;
                }
            }
            if (increasable > 0) {
                mean = Math.floor(high - error / increasable);
            }
        }

        if (mean === oldMean) {
            log(`findMeanSpaceFiller ${i} / ${items.length}`);
            return mean;
        }
    }
}
