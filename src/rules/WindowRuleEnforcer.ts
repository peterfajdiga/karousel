class WindowRuleEnforcer {
    private readonly preferFloating: ClientMatcher;
    private readonly preferTiling: ClientMatcher;
    private readonly followCaption: Set<string>;

    constructor(windowRules: WindowRule[]) {
        const [mapFloat, mapTile] = WindowRuleEnforcer.createWindowRuleMaps(windowRules);
        this.preferFloating = new ClientMatcher(mapFloat);
        this.preferTiling = new ClientMatcher(mapTile);
        this.followCaption = new Set([...mapFloat.keys(), ...mapTile.keys()]);
    }

    public shouldTile(kwinClient: KwinClient) {
        return Clients.canTileNow(kwinClient) && (
            this.preferTiling.matches(kwinClient) || (
                kwinClient.normalWindow &&
                !kwinClient.transient &&
                kwinClient.managed &&
                !this.preferFloating.matches(kwinClient)
            )
        );
    }

    public initClientSignalManager(world: World, kwinClient: KwinClient) {
        if (!this.followCaption.has(kwinClient.resourceClass)) {
            return null;
        }

        const enforcer = this;
        const manager = new SignalManager();
        manager.connect(kwinClient.captionChanged, () => {
            const shouldTile = enforcer.shouldTile(kwinClient);
            world.do((clientManager, desktopManager) => {
                const desktop = desktopManager.getDesktopForClient(kwinClient);
                if (shouldTile && desktop !== undefined) {
                    clientManager.tileKwinClient(kwinClient, desktop.grid);
                } else {
                    clientManager.floatKwinClient(kwinClient);
                }
            });
        });
        return manager;
    }

    private static createWindowRuleMaps(windowRules: WindowRule[]) {
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
            WindowRuleEnforcer.createWindowRuleRegexMap(mapFloat),
            WindowRuleEnforcer.createWindowRuleRegexMap(mapTile),
        ];
    }

    private static createWindowRuleRegexMap(windowRuleMap: Map<string, string[]>) {
        const regexMap = new Map<string, RegExp>;
        for (const [k, v] of windowRuleMap) {
            regexMap.set(k, WindowRuleEnforcer.joinRegexes(v));
        }
        return regexMap;
    }

    private static joinRegexes(regexes: string[]) {
        if (regexes.length === 0) {
            return new RegExp("");
        }

        if (regexes.length === 1) {
            return new RegExp("^" + regexes[0] + "$");
        }

        const joinedRegexes = regexes.map(WindowRuleEnforcer.wrapParens).join("|");
        return new RegExp("^" + joinedRegexes + "$");
    }

    private static wrapParens(str: string) {
        return "(" + str + ")";
    }
}
