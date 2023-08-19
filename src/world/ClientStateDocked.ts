class ClientStateDocked {
    private readonly world: World;
    private readonly signalManager: SignalManager;

    constructor(world: World, kwinClient: AbstractClient) {
        this.world = world;
        this.signalManager = ClientStateDocked.initSignalManager(world, kwinClient);
        world.onScreenResized();
    }

    public destroy(passFocus: boolean) {
        this.signalManager.destroy();
        this.world.onScreenResized();
    }

    private static initSignalManager(world: World, kwinClient: AbstractClient) {
        const manager = new SignalManager();
        manager.connect(kwinClient.frameGeometryChanged, (kwinClient: TopLevel, oldGeometry: QRect) => {
            world.onScreenResized();
        });
        return manager;
    }
}
