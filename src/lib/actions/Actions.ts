namespace Actions {
    export class Actions {
        constructor(
            private readonly world: World,
            private readonly config: Actions.Config,
        ) {}

        public getAction(name: string) {
            switch (name) {
                case "focus-left": return () => {
                    this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                        const prevColumn = grid.getPrevColumn(column);
                        if (prevColumn === null) {
                            return;
                        }
                        prevColumn.focus();
                    });
                };

                case "focus-right": return () => {
                    this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                        const nextColumn = grid.getNextColumn(column);
                        if (nextColumn === null) {
                            return;
                        }
                        nextColumn.focus();
                    });
                };

                case "focus-up": return () => {
                    this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                        const prevWindow = column.getPrevWindow(window);
                        if (prevWindow === null) {
                            return;
                        }
                        prevWindow.focus();
                    });
                };

                case "focus-down": return () => {
                    this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                        const nextWindow = column.getNextWindow(window);
                        if (nextWindow === null) {
                            return;
                        }
                        nextWindow.focus();
                    });
                };

                case "focus-start": return () => {
                    this.world.do((clientManager, desktopManager) => {
                        const grid = desktopManager.getCurrentDesktop().grid;
                        const firstColumn = grid.getFirstColumn();
                        if (firstColumn === null) {
                            return;
                        }
                        firstColumn.focus();
                    });
                };

                case "focus-end": return () => {
                    this.world.do((clientManager, desktopManager) => {
                        const grid = desktopManager.getCurrentDesktop().grid;
                        const lastColumn = grid.getLastColumn();
                        if (lastColumn === null) {
                            return;
                        }
                        lastColumn.focus();
                    });
                };

                case "window-move-left": return () => {
                    this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                        if (column.getWindowCount() === 1) {
                            // move from own column into existing column
                            const prevColumn = grid.getPrevColumn(column);
                            if (prevColumn === null) {
                                return;
                            }
                            window.moveToColumn(prevColumn);
                            grid.desktop.autoAdjustScroll();
                        } else {
                            // move from shared column into own column
                            const newColumn = new Column(grid, grid.getPrevColumn(column));
                            window.moveToColumn(newColumn);
                        }
                    });
                };

                case "window-move-right": return () => {
                    this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                        if (column.getWindowCount() === 1) {
                            // move from own column into existing column
                            const nextColumn = grid.getNextColumn(column);
                            if (nextColumn === null) {
                                return;
                            }
                            window.moveToColumn(nextColumn);
                            grid.desktop.autoAdjustScroll();
                        } else {
                            // move from shared column into own column
                            const newColumn = new Column(grid, column);
                            window.moveToColumn(newColumn);
                        }
                    });
                };

                case "window-move-up": return () => {
                    // TODO (optimization): only arrange moved windows
                    this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                        column.moveWindowUp(window);
                    });
                };

                case "window-move-down": return () => {
                    // TODO (optimization): only arrange moved windows
                    this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                        column.moveWindowDown(window);
                    });
                };

                case "window-move-start": return () => {
                    this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                        const newColumn = new Column(grid, null);
                        window.moveToColumn(newColumn);
                    });
                };

                case "window-move-end": return () => {
                    this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                        const newColumn = new Column(grid, grid.getLastColumn());
                        window.moveToColumn(newColumn);
                    });
                };

                case "window-toggle-floating": return () => {
                    const kwinClient = Workspace.activeWindow;
                    this.world.do((clientManager, desktopManager) => {
                        clientManager.toggleFloatingClient(kwinClient);
                    });
                };

                case "column-move-left": return () => {
                    this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                        grid.moveColumnLeft(column);
                    });
                };

                case "column-move-right": return () => {
                    this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                        grid.moveColumnRight(column);
                    });
                };

                case "column-move-start": return () => {
                    this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                        grid.moveColumn(column, null);
                    });
                };

                case "column-move-end": return () => {
                    this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                        grid.moveColumn(column, grid.getLastColumn());
                    });
                };

                case "column-toggle-stacked": return () => {
                    this.world.doIfTiledFocused(false, (clientManager, desktopManager, window, column, grid) => {
                        column.toggleStacked();
                    });
                };

                case "column-width-increase": return () => {
                    this.world.doIfTiledFocused(false, (clientManager, desktopManager, window, column, grid) => {
                        this.config.columnResizer.increaseWidth(column, this.config.manualResizeStep);
                    });
                };

                case "column-width-decrease": return () => {
                    this.world.doIfTiledFocused(false, (clientManager, desktopManager, window, column, grid) => {
                        this.config.columnResizer.decreaseWidth(column, this.config.manualResizeStep);
                    });
                };

                case "columns-width-equalize": return () => {
                    this.world.do((clientManager, desktopManager) => {
                        desktopManager.getCurrentDesktop().equalizeVisibleColumnsWidths();
                    });
                };

                case "grid-scroll-left": return () => {
                    this.gridScroll(-this.config.manualScrollStep);
                };

                case "grid-scroll-right": return () => {
                    this.gridScroll(this.config.manualScrollStep);
                };

                case "grid-scroll-start": return () => {
                    this.world.do((clientManager, desktopManager) => {
                        const grid = desktopManager.getCurrentDesktop().grid;
                        const firstColumn = grid.getFirstColumn();
                        if (firstColumn === null) {
                            return;
                        }
                        grid.desktop.scrollToColumn(firstColumn);
                    });
                };

                case "grid-scroll-end": return () => {
                    this.world.do((clientManager, desktopManager) => {
                        const grid = desktopManager.getCurrentDesktop().grid;
                        const lastColumn = grid.getLastColumn();
                        if (lastColumn === null) {
                            return;
                        }
                        grid.desktop.scrollToColumn(lastColumn);
                    });
                };

                case "grid-scroll-focused": return () => {
                    this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                        grid.desktop.scrollCenterRange(column);
                    })
                };

                case "grid-scroll-left-column": return () => {
                    this.world.do((clientManager, desktopManager) => {
                        const grid = desktopManager.getCurrentDesktop().grid;
                        const column = grid.getLeftmostVisibleColumn(grid.desktop.getCurrentVisibleRange(), true);
                        if (column === null) {
                            return;
                        }

                        const prevColumn = grid.getPrevColumn(column);
                        if (prevColumn === null) {
                            return;
                        }

                        grid.desktop.scrollToColumn(prevColumn);
                    });
                };

                case "grid-scroll-right-column": return () => {
                    this.world.do((clientManager, desktopManager) => {
                        const grid = desktopManager.getCurrentDesktop().grid;
                        const column = grid.getRightmostVisibleColumn(grid.desktop.getCurrentVisibleRange(), true);
                        if (column === null) {
                            return;
                        }

                        const nextColumn = grid.getNextColumn(column);
                        if (nextColumn === null) {
                            return;
                        }

                        grid.desktop.scrollToColumn(nextColumn);
                    });
                };

                case "screen-switch": return () => {
                    this.world.do((clientManager, desktopManager) => {
                        desktopManager.selectScreen(Workspace.activeScreen);
                    });
                };

                default: throw new Error("unknown action: " + name);
            }
        }

        public getNumAction(name: string) {
            switch (name) {
                case "focus-": return (columnIndex: number) => {
                    this.world.do((clientManager, desktopManager) => {
                        const grid = desktopManager.getCurrentDesktop().grid;
                        const targetColumn = grid.getColumnAtIndex(columnIndex);
                        if (targetColumn === null) {
                            return;
                        }
                        targetColumn.focus();
                    });
                };

                case "window-move-to-column-": return (columnIndex: number) => {
                    this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                        const targetColumn = grid.getColumnAtIndex(columnIndex);
                        if (targetColumn === null) {
                            return;
                        }
                        window.moveToColumn(targetColumn);
                        grid.desktop.autoAdjustScroll();
                    });
                };

                case "column-move-to-column-": return (columnIndex: number) => {
                    this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                        const targetColumn = grid.getColumnAtIndex(columnIndex);
                        if (targetColumn === null || targetColumn === column) {
                            return;
                        }
                        if (targetColumn.isToTheRightOf(column)) {
                            grid.moveColumn(column, targetColumn);
                        } else {
                            grid.moveColumn(column, grid.getPrevColumn(targetColumn));
                        }
                    });
                };

                case "column-move-to-desktop-": return (desktopIndex: number) => {
                    this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, oldGrid) => {
                        const kwinDesktop = Workspace.desktops[desktopIndex];
                        if (kwinDesktop === undefined) {
                            return;
                        }
                        const newGrid = desktopManager.getDesktopInCurrentActivity(kwinDesktop).grid;
                        if (newGrid === null || newGrid === oldGrid) {
                            return;
                        }
                        column.moveToGrid(newGrid, newGrid.getLastColumn());
                    });
                };

                case "tail-move-to-desktop-": return (desktopIndex: number) => {
                    this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, oldGrid) => {
                        const kwinDesktop = Workspace.desktops[desktopIndex];
                        if (kwinDesktop === undefined) {
                            return;
                        }
                        const newGrid = desktopManager.getDesktopInCurrentActivity(kwinDesktop).grid;
                        if (newGrid === null || newGrid === oldGrid) {
                            return;
                        }
                        oldGrid.evacuateTail(newGrid, column);
                    });
                };

                default: throw new Error("unknown num action: " + name);
            }
        }

        private gridScroll(amount: number) {
            this.world.do((clientManager, desktopManager) => {
                const grid = desktopManager.getCurrentDesktop().grid;
                grid.desktop.adjustScroll(amount, false);
            });
        }
    }
}
