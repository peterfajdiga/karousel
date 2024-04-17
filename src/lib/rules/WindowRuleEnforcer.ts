class WindowRuleEnforcer {
    private readonly preferFloating: ClientMatcher;
    private readonly preferTiling: ClientMatcher;
    private readonly followCaption: RegExp;

    constructor(windowRules: WindowRule[]) {
        const [floatRegex, tileRegex, followCaptionRegex] = WindowRuleEnforcer.createWindowRuleRegexes(windowRules);
        this.preferFloating = new ClientMatcher(floatRegex);
        this.preferTiling = new ClientMatcher(tileRegex);
        this.followCaption = followCaptionRegex;
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
        if (!this.followCaption.test(kwinClient.resourceClass)) {
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

    private static createWindowRuleRegexes(windowRules: WindowRule[]) {
        const floatRegexes: string[] = [];
        const tileRegexes: string[] = [];
        const followCaptionRegexes: string[] = [];
        for (const windowRule of windowRules) {
            const ruleClass = WindowRuleEnforcer.parseRegex(windowRule.class);
            const ruleCaption = WindowRuleEnforcer.parseRegex(windowRule.caption);
            const ruleString = ClientMatcher.getRuleString(ruleClass, ruleCaption);

            (windowRule.tile ? tileRegexes : floatRegexes).push(ruleString);
            if (ruleCaption !== ".*") {
                followCaptionRegexes.push(ruleClass);
            }
        }

        return [
            WindowRuleEnforcer.joinRegexes(floatRegexes),
            WindowRuleEnforcer.joinRegexes(tileRegexes),
            WindowRuleEnforcer.joinRegexes(followCaptionRegexes),
        ];
    }

    private static parseRegex(rawRule: string | undefined) {
        if (rawRule === undefined || rawRule === "" || rawRule === ".*") {
            return ".*";
        } else {
            return rawRule;
        }
    }

    private static joinRegexes(regexes: string[]) {
        if (regexes.length === 0) {
            return new RegExp("a^"); // match nothing
        }

        if (regexes.length === 1) {
            return new RegExp("^(" + regexes[0] + ")$");
        }

        const joinedRegexes = regexes.map(WindowRuleEnforcer.wrapParens).join("|");
        return new RegExp("^(" + joinedRegexes + ")$");
    }

    private static wrapParens(str: string) {
        return "(" + str + ")";
    }
}
