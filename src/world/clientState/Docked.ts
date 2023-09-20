namespace ClientState {
    export class Docked implements State {
        private readonly world: World;
        private readonly signalManager: SignalManager;

        constructor(world: World, kwinClient: KwinClient) {
            this.world = world;
            this.signalManager = Docked.initSignalManager(world, kwinClient);
            world.onScreenResized();
        }

        public destroy(passFocus: boolean) {
            this.signalManager.destroy();
            this.world.onScreenResized();
        }

        private static initSignalManager(world: World, kwinClient: KwinClient) {
            const manager = new SignalManager();
            manager.connect(kwinClient.frameGeometryChanged, (kwinClient: KwinClient, oldGeometry: QRect) => {
                world.onScreenResized();
            });
            return manager;
        }
    }
}
