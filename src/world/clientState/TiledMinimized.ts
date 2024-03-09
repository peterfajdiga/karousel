namespace ClientState {
    export class TiledMinimized implements State {
        private readonly signalManager: SignalManager;

        constructor(world: World, client: ClientWrapper) {
            this.signalManager = TiledMinimized.initSignalManager(world, client);
        }

        public destroy(passFocus: boolean) {
            this.signalManager.destroy();
        }

        private static initSignalManager(world: World, client: ClientWrapper) {
            const manager = new SignalManager();

            manager.connect(client.kwinClient.minimizedChanged, () => {
                console.assert(!client.kwinClient.minimized);
                world.do((clientManager, desktopManager) => {
                    clientManager.unminimizeClient(client.kwinClient);
                });
            });

            return manager;
        }
    }
}
