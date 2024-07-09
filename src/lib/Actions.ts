namespace Actions {
    export function getAction(world: World, config: Config, name: string) {
        switch (name) {
            case "focus-left": return () => {
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                    const prevColumn = grid.getPrevColumn(column);
                    if (prevColumn === null) {
                        return;
                    }
                    prevColumn.focus();
                });
            };

            case "focus-right": return () => {
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                    const nextColumn = grid.getNextColumn(column);
                    if (nextColumn === null) {
                        return;
                    }
                    nextColumn.focus();
                });
            };

            case "focus-up": return () => {
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                    const prevWindow = column.getPrevWindow(window);
                    if (prevWindow === null) {
                        return;
                    }
                    prevWindow.focus();
                });
            };

            case "focus-down": return () => {
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                    const nextWindow = column.getNextWindow(window);
                    if (nextWindow === null) {
                        return;
                    }
                    nextWindow.focus();
                });
            };

            case "focus-start": return () => {
                world.do((clientManager, desktopManager) => {
                    const grid = desktopManager.getCurrentDesktop().grid;
                    const firstColumn = grid.getFirstColumn();
                    if (firstColumn === null) {
                        return;
                    }
                    firstColumn.focus();
                });
            };

            case "focus-end": return () => {
                world.do((clientManager, desktopManager) => {
                    const grid = desktopManager.getCurrentDesktop().grid;
                    const lastColumn = grid.getLastColumn();
                    if (lastColumn === null) {
                        return;
                    }
                    lastColumn.focus();
                });
            };

            case "window-move-left": return () => {
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
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
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
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
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                    column.moveWindowUp(window);
                });
            };

            case "window-move-down": return () => {
                // TODO (optimization): only arrange moved windows
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                    column.moveWindowDown(window);
                });
            };

            case "window-move-start": return () => {
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                    const newColumn = new Column(grid, null);
                    window.moveToColumn(newColumn);
                });
            };

            case "window-move-end": return () => {
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                    const newColumn = new Column(grid, grid.getLastColumn());
                    window.moveToColumn(newColumn);
                });
            };

            case "window-toggle-floating": return () => {
                const kwinClient = Workspace.activeWindow;
                world.do((clientManager, desktopManager) => {
                    clientManager.toggleFloatingClient(kwinClient);
                });
            };

            case "column-move-left": return () => {
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                    grid.moveColumnLeft(column);
                });
            };

            case "column-move-right": return () => {
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                    grid.moveColumnRight(column);
                });
            };

            case "column-move-start": return () => {
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                    grid.moveColumn(column, null);
                });
            };

            case "column-move-end": return () => {
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                    grid.moveColumn(column, grid.getLastColumn());
                });
            };

            case "column-toggle-stacked": return () => {
                world.doIfTiledFocused(false, (clientManager, desktopManager, window, column, grid) => {
                    column.toggleStacked();
                });
            };

            case "column-width-increase": return () => {
                world.doIfTiledFocused(false, (clientManager, desktopManager, window, column, grid) => {
                    config.columnResizer.increaseWidth(column, config.manualResizeStep);
                });
            };

            case "column-width-decrease": return () => {
                world.doIfTiledFocused(false, (clientManager, desktopManager, window, column, grid) => {
                    config.columnResizer.decreaseWidth(column, config.manualResizeStep);
                });
            };

            case "columns-width-equalize": return () => {
                world.do((clientManager, desktopManager) => {
                    desktopManager.getCurrentDesktop().equalizeVisibleColumnsWidths();
                });
            };

            case "grid-scroll-left": return () => {
                gridScroll(world, -config.manualScrollStep);
            };

            case "grid-scroll-right": return () => {
                gridScroll(world, config.manualScrollStep);
            };

            case "grid-scroll-start": return () => {
                world.do((clientManager, desktopManager) => {
                    const grid = desktopManager.getCurrentDesktop().grid;
                    const firstColumn = grid.getFirstColumn();
                    if (firstColumn === null) {
                        return;
                    }
                    grid.desktop.scrollToColumn(firstColumn);
                });
            };

            case "grid-scroll-end": return () => {
                world.do((clientManager, desktopManager) => {
                    const grid = desktopManager.getCurrentDesktop().grid;
                    const lastColumn = grid.getLastColumn();
                    if (lastColumn === null) {
                        return;
                    }
                    grid.desktop.scrollToColumn(lastColumn);
                });
            };

            case "grid-scroll-focused": return () => {
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                    grid.desktop.scrollCenterRange(column);
                })
            };

            case "grid-scroll-left-column": return () => {
                world.do((clientManager, desktopManager) => {
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
                world.do((clientManager, desktopManager) => {
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
                world.do((clientManager, desktopManager) => {
                    desktopManager.selectScreen(Workspace.activeScreen);
                });
            };

            default: throw new Error("unknown action: " + name);
        }
    }

    export function getNumAction(world: World, name: string) {
        switch (name) {
            case "focus-": return (columnIndex: number) => {
                world.do((clientManager, desktopManager) => {
                    const grid = desktopManager.getCurrentDesktop().grid;
                    const targetColumn = grid.getColumnAtIndex(columnIndex);
                    if (targetColumn === null) {
                        return;
                    }
                    targetColumn.focus();
                });
            };

            case "window-move-to-column-": return (columnIndex: number) => {
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                    const targetColumn = grid.getColumnAtIndex(columnIndex);
                    if (targetColumn === null) {
                        return;
                    }
                    window.moveToColumn(targetColumn);
                    grid.desktop.autoAdjustScroll();
                });
            };

            case "column-move-to-column-": return (columnIndex: number) => {
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
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
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, oldGrid) => {
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
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, oldGrid) => {
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

    function gridScroll(world: World, amount: number) {
        world.do((clientManager, desktopManager) => {
            const grid = desktopManager.getCurrentDesktop().grid;
            grid.desktop.adjustScroll(amount, false);
        });
    }

    export type Config = {
        manualScrollStep: number,
        manualResizeStep: number,
        columnResizer: ColumnResizer,
    };

    export type ColumnResizer = {
        increaseWidth(column: Column, step: number): void,
        decreaseWidth(column: Column, step: number): void,
    }
}
