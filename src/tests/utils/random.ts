function runOneOf(...fs: (() => void)[]) {
    randomItem(fs)();
}

function runReorder(...fs: (() => void)[]) {
    shuffle(fs);
    for (const f of fs) {
        f();
    }
}

function randomInt(n: number) {
    return Math.floor(Math.random() * n);
}

function randomItem<T>(items: T[]): T {
    return items[randomInt(items.length)];
}

function shuffle(items: any[]) {
    for (let n = items.length; n > 1; n--) {
        const i = n-1;
        const j = randomInt(n);
        [items[i], items[j]] = [items[j], items[i]];
    }
}
