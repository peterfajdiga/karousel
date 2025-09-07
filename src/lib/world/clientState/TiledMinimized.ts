namespace ClientState {
    export class TiledMinimized implements State {
        private readonly signalManager: SignalManager;

        constructor(world: World, client: ClientWrapper) {
            this.signalManager = TiledMinimized.initSignalManager(world, client);
        }

        public destroy(passFocus: FocusPassing.Type) {
            this.signalManager.destroy();
        }

        private static initSignalManager(world: World, client: ClientWrapper) {
            const manager = new SignalManager();

            manager.connect(client.kwinClient.minimizedChanged, () => {
                console.assert(!client.kwinClient.minimized);
                world.do((clientManager, desktopManager) => {
                    const desktop = desktopManager.getDesktopForClient(client.kwinClient);
                    if (desktop !== undefined) {
                        clientManager.tileClient(client, desktop.grid);
                    } else {
                        clientManager.floatClient(client);
                    }
                });
            });

            return manager;
        }
    }
}
