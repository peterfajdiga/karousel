namespace ClientState {
    export class Pinned implements State {
        private readonly kwinClient: KwinClient;
        private readonly pinManager: PinManager;
        private readonly desktopManager: DesktopManager;
        private readonly config: ClientManager.Config;
        private readonly signalManager: SignalManager;

        constructor(world: World, pinManager: PinManager, desktopManager: DesktopManager, kwinClient: KwinClient, config: ClientManager.Config) {
            this.kwinClient = kwinClient;
            this.pinManager = pinManager;
            this.desktopManager = desktopManager;
            this.config = config;
            if (config.keepAbove) {
                kwinClient.keepAbove = true;
            }
            this.signalManager = Pinned.initSignalManager(world, pinManager, kwinClient);
        }

        public destroy(passFocus: boolean) {
            this.signalManager.destroy();
            if (this.config.keepAbove) {
                this.kwinClient.keepAbove = true;
            }
            this.pinManager.removeClient(this.kwinClient);
            for (const desktop of this.desktopManager.getDesktopsForClient(this.kwinClient)) {
                desktop.onPinsChanged();
            }
        }

        private static initSignalManager(world: World, pinManager: PinManager, kwinClient: KwinClient) {
            const manager = new SignalManager();
            let oldDesktopNumber = kwinClient.desktop;
            let oldActivities = kwinClient.activities;

            manager.connect(kwinClient.tileChanged, () => {
                const quickTileMode = Clients.guessQuickTileMode(kwinClient);
                if (quickTileMode === Clients.QuickTileMode.Untiled) {
                    world.do((clientManager, desktopManager) => {
                        clientManager.unpinClient(kwinClient);
                    });
                }
            });

            manager.connect(kwinClient.frameGeometryChanged, (kwinClient: KwinClient, oldGeometry: QRect) => {
                const quickTileMode = Clients.guessQuickTileMode(kwinClient);
                if (quickTileMode === Clients.QuickTileMode.Untiled) {
                    world.do((clientManager, desktopManager) => {
                        clientManager.unpinClient(kwinClient);
                    });
                    return;
                }

                world.do((clientManager, desktopManager) => {
                    pinManager.setClient(kwinClient, quickTileMode);
                    for (const desktop of desktopManager.getDesktopsForClient(kwinClient)) {
                        desktop.onPinsChanged();
                    }
                })
            });

            manager.connect(kwinClient.desktopChanged, () => {
                const changedDesktops = oldDesktopNumber === -1 || kwinClient.desktop === -1 ?
                    [] :
                    [oldDesktopNumber, kwinClient.desktop];
                world.do((clientManager, desktopManager) => {
                    for (const desktop of desktopManager.getDesktops(changedDesktops, kwinClient.activities)) {
                        desktop.onPinsChanged();
                    }
                });
                oldDesktopNumber = kwinClient.desktop;
            });

            manager.connect(kwinClient.activitiesChanged, (kwinClient: KwinClient) => {
                const desktops = kwinClient.desktop === -1 ? [] : [kwinClient.desktop];
                const changedActivities = oldActivities.length === 0 || kwinClient.activities.length === 0 ?
                    [] :
                    union(oldActivities, kwinClient.activities);
                world.do((clientManager, desktopManager) => {
                    for (const desktop of desktopManager.getDesktops(desktops, changedActivities)) {
                        desktop.onPinsChanged();
                    }
                });
                oldActivities = kwinClient.activities;
            });

            return manager;
        }
    }
}
