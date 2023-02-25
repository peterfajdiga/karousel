class WindowRuleEnforcer {
    private preferFloating: ClientMatcher;
    private preferTiling: ClientMatcher;
    private workspaceSignalManager: SignalManager;

    constructor(world: World, preferFloating: Map<string, RegExp>, preferTiling: Map<string, RegExp>) {
        this.preferFloating = new ClientMatcher(preferFloating);
        this.preferTiling = new ClientMatcher(preferTiling);
        this.workspaceSignalManager = this.initWorkspaceSignalHandlers(world);
    }

    shouldTile(kwinClient: AbstractClient) {
        return canTile(kwinClient) && (
            this.preferTiling.matches(kwinClient) ||
            kwinClient.normalWindow && kwinClient.managed && !this.preferFloating.matches(kwinClient)
        );
    }

    initWorkspaceSignalHandlers(world: World) {
        const manager = new SignalManager();

        manager.connect(workspace.clientAdded, (kwinClient: AbstractClient) => {
            if (this.shouldTile(kwinClient)) {
                world.addClient(kwinClient);
            }
        });

        return manager;
    }

    destroy() {
        this.workspaceSignalManager.disconnect();
    }
}
