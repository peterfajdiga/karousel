namespace ClientState {
    export class Tiled implements State {
        public readonly window: Window;
        private readonly signalManager: SignalManager;

        constructor(world: World, client: ClientWrapper, grid: Grid) {
            Tiled.prepareClientForTiling(client);

            const column = new Column(grid, grid.getLastFocusedColumn() ?? grid.getLastColumn());
            const window = new Window(client, column);

            this.window = window;
            this.signalManager = Tiled.initSignalManager(world, window);
        }

        public destroy(passFocus: boolean) {
            this.signalManager.destroy();

            const window = this.window;
            const grid = window.column.grid;
            const client = window.client;
            window.destroy(passFocus);

            Tiled.restoreClientAfterTiling(client, grid.desktop.clientArea);
        }

        private static initSignalManager(world: World, window: Window) {
            const client = window.client;
            const kwinClient = client.kwinClient;
            const manager = new SignalManager();

            manager.connect(kwinClient.desktopChanged, () => {
                world.do((clientManager, desktopManager) => {
                    if (kwinClient.desktop === -1) {
                        // windows on all desktops are not supported
                        clientManager.untileClient(kwinClient);
                        return;
                    }
                    Tiled.moveWindowToCorrectGrid(desktopManager, window);
                });
            });

            manager.connect(kwinClient.activitiesChanged, (kwinClient: AbstractClient) => {
                world.do((clientManager, desktopManager) => {
                    if (kwinClient.activities.length !== 1) {
                        // windows on multiple activities are not supported
                        clientManager.untileClient(kwinClient);
                        return;
                    }
                    Tiled.moveWindowToCorrectGrid(desktopManager, window);
                });
            })

            let lastResize = false;
            manager.connect(kwinClient.moveResizedChanged, () => {
                world.do((clientManager, desktopManager) => {
                    if (world.untileOnDrag && kwinClient.move) {
                        clientManager.untileClient(kwinClient);
                        return;
                    }

                    const grid = window.column.grid;
                    const resize = kwinClient.resize;
                    if (!lastResize && resize) {
                        grid.onUserResizeStarted();
                    }
                    if (lastResize && !resize) {
                        grid.onUserResizeFinished();
                    }
                    lastResize = resize;
                });
            });

            let cursorChangedAfterResizeStart = false;
            manager.connect(kwinClient.moveResizeCursorChanged, () => {
                cursorChangedAfterResizeStart = true;
            });
            manager.connect(kwinClient.clientStartUserMovedResized, () => {
                cursorChangedAfterResizeStart = false;
            });

            manager.connect(kwinClient.frameGeometryChanged, (kwinClient: TopLevel, oldGeometry: QRect) => {
                world.do((clientManager, desktopManager) => {
                    if (kwinClient.resize) {
                        window.onUserResize(oldGeometry, !cursorChangedAfterResizeStart);
                    } else if (
                        !client.isManipulatingGeometry() &&
                        !Clients.isMaximizedGeometry(kwinClient) &&
                        !Clients.isFullScreenGeometry(kwinClient) // not using `kwinClient.fullScreen` because it may not be set yet at this point
                    ) {
                        window.onFrameGeometryChanged();
                    }
                });
            });

            manager.connect(kwinClient.fullScreenChanged, () => {
                window.onFullScreenChanged(kwinClient.fullScreen);
            });

            manager.connect(kwinClient.tileChanged, (tile: Tile) => {
                if (tile !== null) {
                    world.do((clientManager, desktopManager) => {
                        clientManager.untileClient(kwinClient);
                    })
                }
            });

            return manager;
        }

        private static moveWindowToCorrectGrid(desktopManager: DesktopManager, window: Window) {
            const kwinClient = window.client.kwinClient;

            const oldGrid = window.column.grid;
            const newGrid = desktopManager.getDesktopForClient(kwinClient).grid;
            if (oldGrid === newGrid) {
                // window already on the correct grid
                return;
            }

            const newColumn = new Column(newGrid, newGrid.getLastFocusedColumn() ?? newGrid.getLastColumn());
            window.moveToColumn(newColumn);
        }

        private static prepareClientForTiling(client: ClientWrapper) {
            client.kwinClient.keepBelow = true;
            client.setFullScreen(false);
            if (client.kwinClient.tile !== null) {
                client.setMaximize(false, true); // disable quick tile mode
            }
            client.setMaximize(false, false);
        }

        private static restoreClientAfterTiling(client: ClientWrapper, screenSize: QRect) {
            client.kwinClient.keepBelow = false;
            client.setShade(false);
            client.setFullScreen(false);
            if (client.kwinClient.tile === null) {
                client.setMaximize(false, false);
            }
            client.ensureVisible(screenSize);
        }
    }
}
