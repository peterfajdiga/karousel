namespace ClientState {
    export class Docked implements State {
        private readonly world: World;
        private readonly signalManager: SignalManager;

        constructor(world: World, kwinClient: TopLevel) {
            this.world = world;
            this.signalManager = Docked.initSignalManager(world, kwinClient);
            world.onScreenResized();
        }

        public destroy(passFocus: boolean) {
            this.signalManager.destroy();
            this.world.onScreenResized();
        }

        private static initSignalManager(world: World, kwinClient: TopLevel) {
            const manager = new SignalManager();
            manager.connect(kwinClient.frameGeometryChanged, (kwinClient: TopLevel, oldGeometry: QRect) => {
                world.onScreenResized();
            });
            return manager;
        }
    }
}
