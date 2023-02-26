class WindowRuleEnforcer {
    private preferFloating: ClientMatcher;
    private preferTiling: ClientMatcher;
    private followCaption: Set<string>;
    private workspaceSignalManager: SignalManager;
    private clientSignalManagers: Map<AbstractClient, SignalManager>;

    constructor(world: World, preferFloating: Map<string, RegExp>, preferTiling: Map<string, RegExp>) {
        this.preferFloating = new ClientMatcher(preferFloating);
        this.preferTiling = new ClientMatcher(preferTiling);
        this.followCaption = new Set([...preferFloating.keys(), ...preferTiling.keys()]);
        this.workspaceSignalManager = this.initWorkspaceSignalHandlers(world);
        this.clientSignalManagers = new Map();
    }

    shouldTile(kwinClient: AbstractClient) {
        return canTile(kwinClient) && (
            this.preferTiling.matches(kwinClient) ||
            kwinClient.normalWindow && kwinClient.managed && !this.preferFloating.matches(kwinClient)
        );
    }

    initWorkspaceSignalHandlers(world: World) {
        const enforcer = this;
        const manager = new SignalManager();

        manager.connect(workspace.clientAdded, (kwinClient: AbstractClient) => {
            if (enforcer.shouldTile(kwinClient)) {
                world.addClient(kwinClient);
            }
            if (enforcer.followCaption.has(kwinClient.resourceClass)) {
                enforcer.addClientSignalManager(world, kwinClient);
            }
        });

        manager.connect(workspace.clientRemoved, (kwinClient: AbstractClient) => {
            this.removeClientSignalManager(kwinClient);
        });

        return manager;
    }

    addClientSignalManager(world: World, kwinClient: AbstractClient) {
        const enforcer = this;
        const manager = new SignalManager();

        manager.connect(kwinClient.captionChanged, () => {
            const shouldTile = enforcer.shouldTile(kwinClient);
            const isTiled = world.hasClient(kwinClient);
            if (isTiled && !shouldTile) {
                world.removeClient(kwinClient, false);
            } else if (!isTiled && shouldTile) {
                world.addClient(kwinClient);
            }
        });

        this.clientSignalManagers.set(kwinClient, manager);
    }

    removeClientSignalManager(kwinClient: AbstractClient) {
        const manager = this.clientSignalManagers.get(kwinClient);
        if (manager !== undefined) {
            manager.disconnect();
            this.clientSignalManagers.delete(kwinClient);
        }
    }

    destroy() {
        this.workspaceSignalManager.disconnect();
        for (const clientSignalManager of this.clientSignalManagers.values()) {
            clientSignalManager.disconnect();
        }
        this.clientSignalManagers.clear();
    }
}
