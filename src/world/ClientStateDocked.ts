class ClientStateDocked {
    private world: World;
    private signalManager: SignalManager;

    constructor(world: World, kwinClient: AbstractClient) {
        this.world = world;
        this.signalManager = ClientStateDocked.initSignalManager(world, kwinClient);
        world.onScreenResized();
    }

    destroy(passFocus: boolean) {
        this.signalManager.disconnect();
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
