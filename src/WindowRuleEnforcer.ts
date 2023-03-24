class WindowRuleEnforcer {
    private preferFloating: ClientMatcher;
    private preferTiling: ClientMatcher;
    private followCaption: Set<string>;

    constructor(world: World, preferFloating: Map<string, RegExp>, preferTiling: Map<string, RegExp>) {
        this.preferFloating = new ClientMatcher(preferFloating);
        this.preferTiling = new ClientMatcher(preferTiling);
        this.followCaption = new Set([...preferFloating.keys(), ...preferTiling.keys()]);
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
