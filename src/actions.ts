function initActions(world: World) {
    return {
        focusLeft: () => {
            world.doIfTiledFocused(true, (window, column, grid) => {
                const prevColumn = grid.getPrevColumn(column);
                if (prevColumn === null) {
                    return;
                }
                prevColumn.focus();
            });
        },

        focusRight: () => {
            world.doIfTiledFocused(true, (window, column, grid) => {
                const nextColumn = grid.getNextColumn(column);
                if (nextColumn === null) {
                    return;
                }
                nextColumn.focus();
            });
        },

        focusUp: () => {
            world.doIfTiledFocused(true, (window, column, grid) => {
                const prevWindow = column.getPrevWindow(window);
                if (prevWindow === null) {
                    return;
                }
                prevWindow.focus();
            });
        },

        focusDown: () => {
            world.doIfTiledFocused(true, (window, column, grid) => {
                const nextWindow = column.getNextWindow(window);
                if (nextWindow === null) {
                    return;
                }
                nextWindow.focus();
            });
        },

        focusStart: () => {
            const grid = world.getCurrentGrid();
            const firstColumn = grid.getFirstColumn();
            if (firstColumn === null) {
                return;
            }
            firstColumn.focus();
            grid.arrange();
        },

        focusEnd: () => {
            const grid = world.getCurrentGrid();
            const lastColumn = grid.getLastColumn();
            if (lastColumn === null) {
                return;
            }
            lastColumn.focus();
            grid.arrange();
        },

        windowMoveLeft: () => {
            world.doIfTiledFocused(true, (window, column, grid) => {
                if (column.getWindowCount() === 1) {
                    // move from own column into existing column
                    const prevColumn = grid.getPrevColumn(column);
                    if (prevColumn === null) {
                        return;
                    }
                    window.moveToColumn(prevColumn);
                    grid.autoAdjustScroll();
                } else {
                    // move from shared column into own column
                    const newColumn = new Column(grid, grid.getPrevColumn(column));
                    window.moveToColumn(newColumn);
                }
                grid.arrange();
            });
        },

        windowMoveRight: () => {
            world.doIfTiledFocused(true, (window, column, grid) => {
                if (column.getWindowCount() === 1) {
                    // move from own column into existing column
                    const nextColumn = grid.getNextColumn(column);
                    if (nextColumn === null) {
                        return;
                    }
                    window.moveToColumn(nextColumn);
                    grid.autoAdjustScroll();
                } else {
                    // move from shared column into own column
                    const newColumn = new Column(grid, column);
                    window.moveToColumn(newColumn);
                }
                grid.arrange();
            });
        },

        windowMoveUp: () => {
            world.doIfTiledFocused(true, (window, column, grid) => {
                column.moveWindowUp(window);
                grid.arrange(); // TODO (optimization): only arrange moved windows
            });
        },

        windowMoveDown: () => {
            world.doIfTiledFocused(true, (window, column, grid) => {
                column.moveWindowDown(window);
                grid.arrange(); // TODO (optimization): only arrange moved windows
            });
        },

        windowMoveStart: () => {
            world.doIfTiledFocused(true, (window, column, grid) => {
                const newColumn = new Column(grid, null);
                window.moveToColumn(newColumn);
                grid.arrange();
            });
        },

        windowMoveEnd: () => {
            world.doIfTiledFocused(true, (window, column, grid) => {
                const newColumn = new Column(grid, grid.getLastColumn());
                window.moveToColumn(newColumn);
                grid.arrange();
            });
        },

        windowExpand: () => {
            world.doIfTiledFocused(false, (window, column, grid) => {
                column.toggleStacked();
                grid.arrange();
            });
        },

        windowToggleFloating: () => {
            const kwinClient = workspace.activeClient;
            world.toggleFloatingClient(kwinClient);
        },

        columnMoveLeft: () => {
            world.doIfTiledFocused(true, (window, column, grid) => {
                grid.moveColumnLeft(column);
                grid.arrange();
            });
        },

        columnMoveRight: () => {
            world.doIfTiledFocused(true, (window, column, grid) => {
                grid.moveColumnRight(column);
                grid.arrange();
            });
        },

        columnMoveStart: () => {
            world.doIfTiledFocused(true, (window, column, grid) => {
                column.moveAfter(null);
                grid.arrange();
            });
        },

        columnMoveEnd: () => {
            world.doIfTiledFocused(true, (window, column, grid) => {
                column.moveAfter(grid.getLastColumn());
                grid.arrange();
            });
        },

        columnExpand: () => {
            world.doIfTiledFocused(false, (window, column, grid) => {
                column.expand();
                grid.arrange();
            });
        },

        columnWidthIncrease: () => {
            world.doIfTiledFocused(false, (window, column, grid) => {
                grid.increaseColumnWidth(column);
                grid.arrange();
            });
        },

        columnWidthDecrease: () => {
            world.doIfTiledFocused(false, (window, column, grid) => {
                grid.decreaseColumnWidth(column);
                grid.arrange();
            });
        },

        expandVisibleColumns: () => {
            const grid = world.getCurrentGrid();
            grid.rescaleVisibleColumns(true, true);
            grid.arrange();
        },

        shrinkVisibleColumns: () => {
            const grid = world.getCurrentGrid();
            grid.rescaleVisibleColumns(false, false);
            grid.arrange();
        },

        gridScrollLeft: () => {
            gridScroll(world, -world.config.manualScrollStep);
        },

        gridScrollRight: () => {
            gridScroll(world, world.config.manualScrollStep);
        },

        gridScrollStart: () => {
            const grid = world.getCurrentGrid();
            const firstColumn = grid.getFirstColumn();
            if (firstColumn === null) {
                return;
            }
            grid.scrollToColumn(firstColumn);
            grid.arrange();
        },

        gridScrollEnd: () => {
            const grid = world.getCurrentGrid();
            const lastColumn = grid.getLastColumn();
            if (lastColumn === null) {
                return;
            }
            grid.scrollToColumn(lastColumn);
            grid.arrange();
        },

        gridScrollFocused: () => {
            const focusedWindow = world.getFocusedWindow();
            if (focusedWindow === null) {
                return;
            }
            const column = focusedWindow.column;
            const grid = column.grid;
            grid.scrollCenterColumn(column);
            grid.arrange();
        },

        gridScrollLeftColumn: () => {
            const grid = world.getCurrentGrid();
            const column = grid.getLeftmostVisibleColumn(true);
            if (column === null) {
                return;
            }

            const prevColumn = grid.getPrevColumn(column);
            if (prevColumn === null) {
                return;
            }

            grid.scrollToColumn(prevColumn);
            grid.arrange();
        },

        gridScrollRightColumn: () => {
            const grid = world.getCurrentGrid();
            const column = grid.getRightmostVisibleColumn(true);
            if (column === null) {
                return;
            }

            const nextColumn = grid.getNextColumn(column);
            if (nextColumn === null) {
                return;
            }

            grid.scrollToColumn(nextColumn);
            grid.arrange();
        },
    };
}

function initNumActions(world: World) {
    return {
        focusColumn: (columnIndex: number) => {
            const grid = world.getCurrentGrid();
            const targetColumn = grid.getColumnAtIndex(columnIndex);
            if (targetColumn === null) {
                return null;
            }
            targetColumn.focus();
        },

        windowMoveToColumn: (columnIndex: number) => {
            world.doIfTiledFocused(true, (window, column, grid) => {
                const targetColumn = grid.getColumnAtIndex(columnIndex);
                if (targetColumn === null) {
                    return null;
                }
                window.moveToColumn(targetColumn);
                grid.autoAdjustScroll();
                grid.arrange();
            });
        },

        columnMoveToColumn: (columnIndex: number) => {
            world.doIfTiledFocused(true, (window, column, grid) => {
                const targetColumn = grid.getColumnAtIndex(columnIndex);
                if (targetColumn === null || targetColumn === column) {
                    return null;
                }
                if (targetColumn.isAfter(column)) {
                    column.moveAfter(targetColumn);
                } else {
                    column.moveAfter(grid.getPrevColumn(targetColumn));
                }
                grid.arrange();
            });
        },

        columnMoveToDesktop: (desktopIndex: number) => {
            world.doIfTiledFocused(true, (window, column, oldGrid) => {
                const desktopNumber = desktopIndex + 1;
                const newGrid = world.getGridInCurrentActivity(desktopNumber);
                if (newGrid === null || newGrid === oldGrid) {
                    return;
                }
                column.moveToGrid(newGrid, newGrid.getLastColumn());
                oldGrid.arrange();
                newGrid.arrange();
            });
        },

        tailMoveToDesktop: (desktopIndex: number) => {
            world.doIfTiledFocused(true, (window, column, oldGrid) => {
                const desktopNumber = desktopIndex + 1;
                const newGrid = world.getGridInCurrentActivity(desktopNumber);
                if (newGrid === null || newGrid === oldGrid) {
                    return;
                }
                oldGrid.evacuateTail(newGrid, column);
                oldGrid.arrange();
                newGrid.arrange();
            });
        },
    };
}

function gridScroll(world: World, amount: number) {
    const scrollAmount = amount;
    const grid = world.getCurrentGrid();
    grid.adjustScroll(scrollAmount, false);
    grid.arrange();
}

function canTileEver(kwinClient: AbstractClient) {
    return kwinClient.resizeable;
}

function canTileNow(kwinClient: AbstractClient) {
    return canTileEver(kwinClient) && !kwinClient.minimized && kwinClient.desktop > 0 && kwinClient.activities.length === 1;
}

function makeTileable(kwinClient: AbstractClient) {
    if (kwinClient.minimized) {
        kwinClient.minimized = false;
    }
    if (kwinClient.desktop <= 0) {
        kwinClient.desktop = workspace.currentDesktop;
    }
    if (kwinClient.activities.length !== 1) {
        kwinClient.activities = [workspace.currentActivity];
    }
}
