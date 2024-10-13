namespace ClientState {
    export class Tiled implements State {
        public readonly window: Window;
        private readonly defaultState: Tiled.WindowState;
        private readonly signalManager: SignalManager;
        private static readonly maxExternalFrameGeometryChangedIntervalMs = 1000;

        constructor(world: World, client: ClientWrapper, grid: Grid) {
            this.defaultState = { skipSwitcher: client.kwinClient.skipSwitcher };
            Tiled.prepareClientForTiling(client, grid.config);

            const column = new Column(grid, grid.getLastFocusedColumn() ?? grid.getLastColumn());
            const window = new Window(client, column);

            this.window = window;
            this.signalManager = Tiled.initSignalManager(world, window, grid.config);
        }

        public destroy(passFocus: boolean) {
            this.signalManager.destroy();

            const window = this.window;
            const grid = window.column.grid;
            const client = window.client;
            window.destroy(passFocus);

            Tiled.restoreClientAfterTiling(client, grid.config, this.defaultState, grid.desktop.clientArea);
        }

        private static initSignalManager(world: World, window: Window, config: LayoutConfig) {
            const client = window.client;
            const kwinClient = client.kwinClient;
            const manager = new SignalManager();

            manager.connect(kwinClient.desktopsChanged, () => {
                world.do((clientManager, desktopManager) => {
                    const desktop = desktopManager.getDesktopForClient(kwinClient);
                    if (desktop === undefined) {
                        // windows on multiple desktops are not supported
                        clientManager.floatClient(client);
                        return;
                    }
                    Tiled.moveWindowToGrid(window, desktop.grid);
                });
            });

            manager.connect(kwinClient.activitiesChanged, () => {
                world.do((clientManager, desktopManager) => {
                    const desktop = desktopManager.getDesktopForClient(kwinClient);
                    if (desktop === undefined) {
                        // windows on multiple activities are not supported
                        clientManager.floatClient(client);
                        return;
                    }
                    Tiled.moveWindowToGrid(window, desktop.grid);
                });
            })

            manager.connect(kwinClient.minimizedChanged, () => {
                console.assert(kwinClient.minimized);
                world.do((clientManager, desktopManager) => {
                    clientManager.minimizeClient(kwinClient);
                });
            });

            manager.connect(kwinClient.maximizedAboutToChange, (maximizedMode: MaximizedMode) => {
                world.do(() => {
                    window.onMaximizedChanged(maximizedMode);
                });
            });

            let resizing = false;
            let resizeStartWidth = 0;
            let resizeNeighbor: { column: Column, startWidth: number } | undefined;
            manager.connect(kwinClient.interactiveMoveResizeStarted, () => {
                if (kwinClient.move) {
                    if (config.untileOnDrag) {
                        world.do((clientManager, desktopManager) => {
                            clientManager.floatClient(client);
                        });
                    }
                    return;
                }

                if (kwinClient.resize) {
                    resizing = true;
                    resizeStartWidth = window.column.getWidth();
                    if (config.resizeNeighborColumn) {
                        const resizeNeighborColumn = Tiled.getResizeNeighborColumn(window);
                        if (resizeNeighborColumn !== null) {
                            resizeNeighbor = {
                                column: resizeNeighborColumn,
                                startWidth: resizeNeighborColumn.getWidth(),
                            };
                        }
                    }
                    window.column.grid.onUserResizeStarted();
                }
            });

            manager.connect(kwinClient.interactiveMoveResizeFinished, () => {
                if (resizing) {
                    resizing = false;
                    resizeNeighbor = undefined;
                    window.column.grid.onUserResizeFinished();
                }
            });

            let externalFrameGeometryChangedRateLimiter = new RateLimiter(2, Tiled.maxExternalFrameGeometryChangedIntervalMs);
            manager.connect(kwinClient.frameGeometryChanged, (oldGeometry: QmlRect) => {
                // on Wayland, this fires after `tileChanged`
                if (kwinClient.tile !== null) {
                    world.do((clientManager, desktopManager) => {
                        clientManager.pinClient(kwinClient);
                    });
                    return;
                }

                const newGeometry = client.kwinClient.frameGeometry;
                const oldCenterX = oldGeometry.x + oldGeometry.width/2;
                const oldCenterY = oldGeometry.y + oldGeometry.height/2;
                const newCenterX = newGeometry.x + newGeometry.width/2;
                const newCenterY = newGeometry.y + newGeometry.height/2;
                const dx = Math.round(newCenterX - oldCenterX);
                const dy = Math.round(newCenterY - oldCenterY);
                if (dx !== 0 || dy !== 0) {
                    // TODO: instead of passing dx and dy, remember relative (to the parent) x and y for each
                    // transient window and use them for `moveTransients` and `ensureTransientsVisible`
                    client.moveTransients(dx, dy);
                }

                if (kwinClient.resize) {
                    world.do(() => window.onUserResize(oldGeometry, resizeStartWidth, resizeNeighbor));
                } else if (
                    !window.column.grid.isUserResizing() &&
                    !client.isManipulatingGeometry(newGeometry) &&
                    client.getMaximizedMode() === MaximizedMode.Unmaximized &&
                    !Clients.isFullScreenGeometry(kwinClient) // not using `kwinClient.fullScreen` because it may not be set yet at this point
                ) {
                    if (externalFrameGeometryChangedRateLimiter.acquire()) {
                        world.do(() => window.onFrameGeometryChanged());
                    }
                }
            });

            manager.connect(kwinClient.fullScreenChanged, () => {
                world.do(() => window.onFullScreenChanged(kwinClient.fullScreen));
            });

            manager.connect(kwinClient.tileChanged, () => {
                // on X11, this fires after `frameGeometryChanged`
                if (kwinClient.tile !== null) {
                    world.do((clientManager, desktopManager) => {
                        clientManager.pinClient(kwinClient);
                    });
                }
            });

            return manager;
        }

        private static getResizeNeighborColumn(window: Window) {
            const kwinClient = window.client.kwinClient;
            const column = window.column;
            if (Workspace.cursorPos.x > kwinClient.clientGeometry.right) {
                return column.grid.getRightColumn(column);
            } else if (Workspace.cursorPos.x < kwinClient.clientGeometry.left) {
                return column.grid.getLeftColumn(column);
            } else {
                return null;
            }
        }

        private static moveWindowToGrid(window: Window, grid: Grid) {
            if (grid === window.column.grid) {
                // window already on the given grid
                return;
            }

            const newColumn = new Column(grid, grid.getLastFocusedColumn() ?? grid.getLastColumn());
            window.moveToColumn(newColumn, true);
        }

        private static prepareClientForTiling(client: ClientWrapper, config: LayoutConfig) {
            if (config.skipSwitcher) {
                client.kwinClient.skipSwitcher = true;
            }
            if (config.tiledKeepBelow) {
                client.kwinClient.keepBelow = true;
            }
            client.setFullScreen(false);
            if (client.kwinClient.tile !== null) {
                client.setMaximize(false, true); // disable quick tile mode
            }
            client.setMaximize(false, false);
        }

        private static restoreClientAfterTiling(client: ClientWrapper, config: LayoutConfig, defaultState: Tiled.WindowState, screenSize: QmlRect) {
            if (config.skipSwitcher) {
                client.kwinClient.skipSwitcher = defaultState.skipSwitcher;
            }
            if (config.tiledKeepBelow) {
                client.kwinClient.keepBelow = false;
            }
            if (config.offScreenOpacity < 1.0) {
                client.kwinClient.opacity = 1.0;
            }
            client.setShade(false);
            client.setFullScreen(false);
            if (client.kwinClient.tile === null) {
                client.setMaximize(false, false);
            }
            client.ensureVisible(screenSize);
        }
    }

    namespace Tiled {
        export type WindowState = {
            skipSwitcher: boolean;
        };
    }
}
