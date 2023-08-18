module Actions {
    export function init(world: World, config: Config) {
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
                grid.container.arrange();
            },

            focusEnd: () => {
                const grid = world.getCurrentGrid();
                const lastColumn = grid.getLastColumn();
                if (lastColumn === null) {
                    return;
                }
                lastColumn.focus();
                grid.container.arrange();
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
                        grid.container.onGridReordered();
                    } else {
                        // move from shared column into own column
                        const newColumn = new Column(grid, grid.getPrevColumn(column));
                        window.moveToColumn(newColumn);
                    }
                    grid.container.arrange();
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
                        grid.container.onGridReordered();
                    } else {
                        // move from shared column into own column
                        const newColumn = new Column(grid, column);
                        window.moveToColumn(newColumn);
                    }
                    grid.container.arrange();
                });
            },

            windowMoveUp: () => {
                world.doIfTiledFocused(true, (window, column, grid) => {
                    column.moveWindowUp(window);
                    grid.container.arrange(); // TODO (optimization): only arrange moved windows
                });
            },

            windowMoveDown: () => {
                world.doIfTiledFocused(true, (window, column, grid) => {
                    column.moveWindowDown(window);
                    grid.container.arrange(); // TODO (optimization): only arrange moved windows
                });
            },

            windowMoveStart: () => {
                world.doIfTiledFocused(true, (window, column, grid) => {
                    const newColumn = new Column(grid, null);
                    window.moveToColumn(newColumn);
                    grid.container.arrange();
                });
            },

            windowMoveEnd: () => {
                world.doIfTiledFocused(true, (window, column, grid) => {
                    const newColumn = new Column(grid, grid.getLastColumn());
                    window.moveToColumn(newColumn);
                    grid.container.arrange();
                });
            },

            windowToggleFloating: () => {
                const kwinClient = workspace.activeClient;
                world.toggleFloatingClient(kwinClient);
            },

            columnMoveLeft: () => {
                world.doIfTiledFocused(true, (window, column, grid) => {
                    grid.moveColumnLeft(column);
                    grid.container.arrange();
                });
            },

            columnMoveRight: () => {
                world.doIfTiledFocused(true, (window, column, grid) => {
                    grid.moveColumnRight(column);
                    grid.container.arrange();
                });
            },

            columnMoveStart: () => {
                world.doIfTiledFocused(true, (window, column, grid) => {
                    column.moveAfter(null);
                    grid.container.arrange();
                });
            },

            columnMoveEnd: () => {
                world.doIfTiledFocused(true, (window, column, grid) => {
                    column.moveAfter(grid.getLastColumn());
                    grid.container.arrange();
                });
            },

            columnToggleStacked: () => {
                world.doIfTiledFocused(false, (window, column, grid) => {
                    column.toggleStacked();
                    grid.container.arrange();
                });
            },

            columnWidthIncrease: () => {
                world.doIfTiledFocused(false, (window, column, grid) => {
                    grid.increaseColumnWidth(column);
                    grid.container.arrange();
                });
            },

            columnWidthDecrease: () => {
                world.doIfTiledFocused(false, (window, column, grid) => {
                    grid.decreaseColumnWidth(column);
                    grid.container.arrange();
                });
            },

            gridScrollLeft: () => {
                gridScroll(world, -config.manualScrollStep);
            },

            gridScrollRight: () => {
                gridScroll(world, config.manualScrollStep);
            },

            gridScrollStart: () => {
                const grid = world.getCurrentGrid();
                const firstColumn = grid.getFirstColumn();
                if (firstColumn === null) {
                    return;
                }
                grid.container.scrollToColumn(firstColumn);
                grid.container.arrange();
            },

            gridScrollEnd: () => {
                const grid = world.getCurrentGrid();
                const lastColumn = grid.getLastColumn();
                if (lastColumn === null) {
                    return;
                }
                grid.container.scrollToColumn(lastColumn);
                grid.container.arrange();
            },

            gridScrollFocused: () => {
                const focusedWindow = world.getFocusedWindow(true);
                if (focusedWindow === null) {
                    return;
                }
                const column = focusedWindow.column;
                const grid = column.grid;
                grid.container.scrollCenterColumn(column);
                grid.container.arrange();
            },

            gridScrollLeftColumn: () => {
                const grid = world.getCurrentGrid();
                const column = grid.getLeftmostVisibleColumn(grid.container.getCurrentScrollPos(), true);
                if (column === null) {
                    return;
                }

                const prevColumn = grid.getPrevColumn(column);
                if (prevColumn === null) {
                    return;
                }

                grid.container.scrollToColumn(prevColumn);
                grid.container.arrange();
            },

            gridScrollRightColumn: () => {
                const grid = world.getCurrentGrid();
                const column = grid.getRightmostVisibleColumn(grid.container.getCurrentScrollPos(), true);
                if (column === null) {
                    return;
                }

                const nextColumn = grid.getNextColumn(column);
                if (nextColumn === null) {
                    return;
                }

                grid.container.scrollToColumn(nextColumn);
                grid.container.arrange();
            },
        };
    }

    export function initNum(world: World) {
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
                    grid.container.onGridReordered();
                    grid.container.arrange();
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
                    grid.container.arrange();
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
                    oldGrid.container.arrange();
                    newGrid.container.arrange();
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
                    oldGrid.container.arrange();
                    newGrid.container.arrange();
                });
            },
        };
    }

    function gridScroll(world: World, amount: number) {
        const scrollAmount = amount;
        const grid = world.getCurrentGrid();
        grid.container.adjustScroll(scrollAmount, false);
        grid.container.arrange();
    }

    export type Config = {
        manualScrollStep: number,
    }
}
