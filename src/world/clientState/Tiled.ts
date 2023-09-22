namespace ClientState {
    export class Tiled implements State {
        public readonly window: Window;
        private readonly signalManager: SignalManager;

        constructor(world: World, client: ClientWrapper, grid: Grid) {
            Tiled.prepareClientForTiling(client, grid.config);

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

            Tiled.restoreClientAfterTiling(client, grid.config, grid.desktop.clientArea);
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

            manager.connect(kwinClient.activitiesChanged, () => {
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
                    if (kwinClient.move) {
                        if (world.untileOnDrag) {
                            clientManager.untileClient(kwinClient);
                        }
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

            manager.connect(kwinClient.frameGeometryChanged, (kwinClient: KwinClient, oldGeometry: QRect) => {
                // on Wayland, this fires after `tileChanged`
                if (kwinClient.tile !== null) {
                    const quickTileMode = Clients.guessQuickTileMode(kwinClient);
                    if (quickTileMode !== Clients.QuickTileMode.Untiled) {
                        world.do((clientManager, desktopManager) => {
                            clientManager.pinClient(kwinClient, quickTileMode);
                        });
                        return;
                    }
                }

                const newGeometry = client.kwinClient.frameGeometry;
                const oldCenterX = oldGeometry.x + oldGeometry.width/2;
                const oldCenterY = oldGeometry.y + oldGeometry.height/2;
                const newCenterX = newGeometry.x + newGeometry.width/2;
                const newCenterY = newGeometry.y + newGeometry.height/2;
                const dx = Math.round(newCenterX - oldCenterX);
                const dy = Math.round(newCenterY - oldCenterY);
                if (dx !== 0 || dy !== 0) {
                    client.moveTransients(dx, dy);
                }

                if (kwinClient.resize) {
                    world.do(() => window.onUserResize(oldGeometry, !cursorChangedAfterResizeStart));
                } else if (
                    !client.isManipulatingGeometry(newGeometry) &&
                    !Clients.isMaximizedGeometry(kwinClient) &&
                    !Clients.isFullScreenGeometry(kwinClient) // not using `kwinClient.fullScreen` because it may not be set yet at this point
                ) {
                    world.do(() => window.onFrameGeometryChanged());
                }
            });

            manager.connect(kwinClient.fullScreenChanged, () => {
                world.do(() => window.onFullScreenChanged(kwinClient.fullScreen));
            });

            manager.connect(kwinClient.tileChanged, () => {
                // on X11, this fires after `frameGeometryChanged`
                const quickTileMode = Clients.guessQuickTileMode(kwinClient);
                if (quickTileMode !== Clients.QuickTileMode.Untiled) {
                    world.do((clientManager, desktopManager) => {
                        clientManager.pinClient(kwinClient, quickTileMode);
                    });
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

        private static prepareClientForTiling(client: ClientWrapper, config: LayoutConfig) {
            if (config.tiledKeepBelow) {
                client.kwinClient.keepBelow = true;
            }
            client.setFullScreen(false);
            if (client.kwinClient.tile !== null) {
                client.setMaximize(false, true); // disable quick tile mode
            }
            client.setMaximize(false, false);
        }

        private static restoreClientAfterTiling(client: ClientWrapper, config: LayoutConfig, screenSize: QRect) {
            if (config.tiledKeepBelow) {
                client.kwinClient.keepBelow = false;
            }
            client.setShade(false);
            client.setFullScreen(false);
            if (client.kwinClient.tile === null) {
                client.setMaximize(false, false);
            }
            client.ensureVisible(screenSize);
        }
    }
}
