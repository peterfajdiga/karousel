class WindowRuleEnforcer {
    private preferFloating: ClientMatcher;
    private preferTiling: ClientMatcher;
    private followCaption: Set<string>;

    constructor(world: World, windowRules: WindowRule[]) {
        const [mapFloat, mapTile] = createWindowRuleMaps(windowRules);
        this.preferFloating = new ClientMatcher(mapFloat);
        this.preferTiling = new ClientMatcher(mapTile);
        this.followCaption = new Set([...mapFloat.keys(), ...mapTile.keys()]);
    }

    shouldTile(kwinClient: AbstractClient) {
        return canTile(kwinClient) && (
            this.preferTiling.matches(kwinClient) ||
            kwinClient.normalWindow && kwinClient.managed && !this.preferFloating.matches(kwinClient)
        );
    }

    initClientSignalManager(world: World, kwinClient: AbstractClient) {
        if (!this.followCaption.has(kwinClient.resourceClass)) {
            return null;
        }

        const enforcer = this;
        const manager = new SignalManager();
        manager.connect(kwinClient.captionChanged, () => {
            const shouldTile = enforcer.shouldTile(kwinClient);
            if (shouldTile) {
                world.tileClient(kwinClient);
            } else {
                world.untileClient(kwinClient);
            }
        });
        return manager;
    }
}

function createWindowRuleMaps(windowRules: WindowRule[]) {
    const mapFloat = new Map<string, string[]>();
    const mapTile = new Map<string, string[]>();
    for (const windowRule of windowRules) {
        const map = windowRule.tile ? mapTile : mapFloat;
        let captions = map.get(windowRule.class);
        if (captions === undefined) {
            captions = [];
            map.set(windowRule.class, captions);
        }
        if (windowRule.caption !== undefined) {
            captions.push(windowRule.caption);
        }
    }

    return [
        createWindowRuleRegexMap(mapFloat),
        createWindowRuleRegexMap(mapTile),
    ];
}

function createWindowRuleRegexMap(windowRuleMap: Map<string, string[]>) {
    const regexMap = new Map<string, RegExp>;
    for (const [k, v] of windowRuleMap) {
        regexMap.set(k, joinRegexes(v));
    }
    return regexMap;
}

function joinRegexes(regexes: string[]) {
    if (regexes.length == 0) {
        return new RegExp("");
    }

    if (regexes.length == 1) {
        return new RegExp("^" + regexes[0] + "$");
    }

    const joinedRegexes = regexes.map(wrapParens).join("|");
    return new RegExp("^" + joinedRegexes + "$");
}

function wrapParens(str: string) {
    return "(" + str + ")";
}
