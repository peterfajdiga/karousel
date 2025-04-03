function runMaybe(f: () => void) {
    if (Math.random() < 0.5) {
        f();
    }
}

function runOneOf(...fs: (() => void)[]) {
    const index = randomInt(fs.length);
    runLog.push(`${getStackFrame(1)} - Chose ${index}`);
    fs[index]();
}

function runReorder(...fs: (() => void)[]) {
    const fis = fs.map((f, index) => ({ f: f, index: index }));
    shuffle(fis);

    const indexes = fis.map((fi) => fi.index);
    runLog.push(`${getStackFrame(1)} - Order ${indexes}`);

    for (const fi of fis) {
        fi.f();
    }
}

function runReorderDebug(order: number[], ...fs: (() => void)[]) {
    for (const index of order) {
        fs[index]();
    }
}

function randomInt(n: number) {
    return Math.floor(Math.random() * n);
}

function randomItem(items: any[]) {
    Assert.assert(items.length > 0);
    const index = randomInt(items.length);
    return items[index];
}

function shuffle(items: any[]) {
    for (let n = items.length; n > 1; n--) {
        const i = n-1;
        const j = randomInt(n);
        [items[i], items[j]] = [items[j], items[i]];
    }
}

function getStackFrame(index: number) {
    return new Error().stack!.split("\n")[index+2].substring(7);
}
