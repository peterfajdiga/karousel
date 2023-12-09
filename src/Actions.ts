namespace Actions {
    export function init(world: World, config: Config) {
        return {
            focusLeft: () => {
                world.doIfTiledFocused(true, (world, desktopManager, window, column, grid) => {
                    const prevColumn = grid.getPrevColumn(column);
                    if (prevColumn === null) {
                        return;
                    }
                    prevColumn.focus();
                });
            },

            focusRight: () => {
                world.doIfTiledFocused(true, (world, desktopManager, window, column, grid) => {
                    const nextColumn = grid.getNextColumn(column);
                    if (nextColumn === null) {
                        return;
                    }
                    nextColumn.focus();
                });
            },

            focusUp: () => {
                world.doIfTiledFocused(true, (world, desktopManager, window, column, grid) => {
                    const prevWindow = column.getPrevWindow(window);
                    if (prevWindow === null) {
                        return;
                    }
                    prevWindow.focus();
                });
            },

            focusDown: () => {
                world.doIfTiledFocused(true, (world, desktopManager, window, column, grid) => {
                    const nextWindow = column.getNextWindow(window);
                    if (nextWindow === null) {
                        return;
                    }
                    nextWindow.focus();
                });
            },

            focusStart: () => {
                world.do((clientManager, desktopManager) => {
                    const grid = desktopManager.getCurrentDesktop().grid;
                    const firstColumn = grid.getFirstColumn();
                    if (firstColumn === null) {
                        return;
                    }
                    firstColumn.focus();
                });
            },

            focusEnd: () => {
                world.do((clientManager, desktopManager) => {
                    const grid = desktopManager.getCurrentDesktop().grid;
                    const lastColumn = grid.getLastColumn();
                    if (lastColumn === null) {
                        return;
                    }
                    lastColumn.focus();
                });
            },

            windowMoveLeft: () => {
                world.doIfTiledFocused(true, (world, desktopManager, window, column, grid) => {
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
            },

            windowMoveRight: () => {
                world.doIfTiledFocused(true, (world, desktopManager, window, column, grid) => {
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
            },

            windowMoveUp: () => {
                // TODO (optimization): only arrange moved windows
                world.doIfTiledFocused(true, (world, desktopManager, window, column, grid) => {
                    column.moveWindowUp(window);
                });
            },

            windowMoveDown: () => {
                // TODO (optimization): only arrange moved windows
                world.doIfTiledFocused(true, (world, desktopManager, window, column, grid) => {
                    column.moveWindowDown(window);
                });
            },

            windowMoveStart: () => {
                world.doIfTiledFocused(true, (world, desktopManager, window, column, grid) => {
                    const newColumn = new Column(grid, null);
                    window.moveToColumn(newColumn);
                });
            },

            windowMoveEnd: () => {
                world.doIfTiledFocused(true, (world, desktopManager, window, column, grid) => {
                    const newColumn = new Column(grid, grid.getLastColumn());
                    window.moveToColumn(newColumn);
                });
            },

            windowToggleFloating: () => {
                const kwinClient = workspace.activeClient;
                world.do((clientManager, desktopManager) => {
                    clientManager.toggleFloatingClient(kwinClient);
                });
            },

            columnMoveLeft: () => {
                world.doIfTiledFocused(true, (world, desktopManager, window, column, grid) => {
                    grid.moveColumnLeft(column);
                });
            },

            columnMoveRight: () => {
                world.doIfTiledFocused(true, (world, desktopManager, window, column, grid) => {
                    grid.moveColumnRight(column);
                });
            },

            columnMoveStart: () => {
                world.doIfTiledFocused(true, (world, desktopManager, window, column, grid) => {
                    column.moveAfter(null);
                });
            },

            columnMoveEnd: () => {
                world.doIfTiledFocused(true, (world, desktopManager, window, column, grid) => {
                    column.moveAfter(grid.getLastColumn());
                });
            },

            columnToggleStacked: () => {
                world.doIfTiledFocused(false, (world, desktopManager, window, column, grid) => {
                    column.toggleStacked();
                });
            },

            columnWidthIncrease: () => {
                world.doIfTiledFocused(false, (world, desktopManager, window, column, grid) => {
                    grid.increaseColumnWidth(column);
                });
            },

            columnWidthDecrease: () => {
                world.doIfTiledFocused(false, (world, desktopManager, window, column, grid) => {
                    grid.decreaseColumnWidth(column);
                });
            },

            columnsWidthEqualize: () => {
                world.do((clientManager, desktopManager) => {
                    desktopManager.getCurrentDesktop().equalizeVisibleColumnsWidths();
                });
            },

            gridScrollLeft: () => {
                gridScroll(world, -config.manualScrollStep);
            },

            gridScrollRight: () => {
                gridScroll(world, config.manualScrollStep);
            },

            gridScrollStart: () => {
                world.do((clientManager, desktopManager) => {
                    const grid = desktopManager.getCurrentDesktop().grid;
                    const firstColumn = grid.getFirstColumn();
                    if (firstColumn === null) {
                        return;
                    }
                    grid.desktop.scrollToColumn(firstColumn);
                });
            },

            gridScrollEnd: () => {
                world.do((clientManager, desktopManager) => {
                    const grid = desktopManager.getCurrentDesktop().grid;
                    const lastColumn = grid.getLastColumn();
                    if (lastColumn === null) {
                        return;
                    }
                    grid.desktop.scrollToColumn(lastColumn);
                });
            },

            gridScrollFocused: () => {
                world.doIfTiledFocused(true, (world, desktopManager, window, column, grid) => {
                    grid.desktop.scrollToColumn(column);
                })
            },

            gridScrollLeftColumn: () => {
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
            },

            gridScrollRightColumn: () => {
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
            },
        };
    }

    export function initNum(world: World) {
        return {
            focusColumn: (columnIndex: number) => {
                world.do((clientManager, desktopManager) => {
                    const grid = desktopManager.getCurrentDesktop().grid;
                    const targetColumn = grid.getColumnAtIndex(columnIndex);
                    if (targetColumn === null) {
                        return null;
                    }
                    targetColumn.focus();
                });
            },

            windowMoveToColumn: (columnIndex: number) => {
                world.doIfTiledFocused(true, (world, desktopManager, window, column, grid) => {
                    const targetColumn = grid.getColumnAtIndex(columnIndex);
                    if (targetColumn === null) {
                        return null;
                    }
                    window.moveToColumn(targetColumn);
                    grid.desktop.autoAdjustScroll();
                });
            },

            columnMoveToColumn: (columnIndex: number) => {
                world.doIfTiledFocused(true, (world, desktopManager, window, column, grid) => {
                    const targetColumn = grid.getColumnAtIndex(columnIndex);
                    if (targetColumn === null || targetColumn === column) {
                        return null;
                    }
                    if (targetColumn.isAfter(column)) {
                        column.moveAfter(targetColumn);
                    } else {
                        column.moveAfter(grid.getPrevColumn(targetColumn));
                    }
                });
            },

            columnMoveToDesktop: (desktopIndex: number) => {
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, oldGrid) => {
                    const desktopNumber = desktopIndex + 1;
                    const newGrid = desktopManager.getDesktopInCurrentActivity(desktopNumber).grid;
                    if (newGrid === null || newGrid === oldGrid) {
                        return;
                    }
                    column.moveToGrid(newGrid, newGrid.getLastColumn());
                });
            },

            tailMoveToDesktop: (desktopIndex: number) => {
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, oldGrid) => {
                    const desktopNumber = desktopIndex + 1;
                    const newGrid = desktopManager.getDesktopInCurrentActivity(desktopNumber).grid;
                    if (newGrid === null || newGrid === oldGrid) {
                        return;
                    }
                    oldGrid.evacuateTail(newGrid, column);
                });
            },
        };
    }

    function gridScroll(world: World, amount: number) {
        world.do((clientManager, desktopManager) => {
            const grid = desktopManager.getCurrentDesktop().grid;
            grid.desktop.adjustScroll(amount, false);
        });
    }

    export type Config = {
        manualScrollStep: number,
    };
}
