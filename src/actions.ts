function initActions(world: World) {
    return {
        focusLeft: () => {
            world.doIfTiledFocused((window, column, grid) => {
                const prevColumn = grid.getPrevColumn(column);
                if (prevColumn === null) {
                    return;
                }
                prevColumn.focus();
            });
        },

        focusRight: () => {
            world.doIfTiledFocused((window, column, grid) => {
                const nextColumn = grid.getNextColumn(column);
                if (nextColumn === null) {
                    return;
                }
                nextColumn.focus();
            });
        },

        focusUp: () => {
            world.doIfTiledFocused((window, column, grid) => {
                const prevWindow = column.getPrevWindow(window);
                if (prevWindow === null) {
                    return;
                }
                prevWindow.focus();
            });
        },

        focusDown: () => {
            world.doIfTiledFocused((window, column, grid) => {
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
            world.doIfTiledFocused((window, column, grid) => {
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
            world.doIfTiledFocused((window, column, grid) => {
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
            world.doIfTiledFocused((window, column, grid) => {
                column.moveWindowUp(window);
                grid.arrange(); // TODO (optimization): only arrange moved windows
            });
        },

        windowMoveDown: () => {
            world.doIfTiledFocused((window, column, grid) => {
                column.moveWindowDown(window);
                grid.arrange(); // TODO (optimization): only arrange moved windows
            });
        },

        windowMoveStart: () => {
            world.doIfTiledFocused((window, column, grid) => {
                const newColumn = new Column(grid, null);
                window.moveToColumn(newColumn);
                grid.arrange();
            });
        },

        windowMoveEnd: () => {
            world.doIfTiledFocused((window, column, grid) => {
                const newColumn = new Column(grid, grid.getLastColumn());
                window.moveToColumn(newColumn);
                grid.arrange();
            });
        },

        windowExpand: () => {
            world.doIfTiledFocused((window, column, grid) => {
                column.toggleStacked();
                grid.arrange();
            });
        },

        windowToggleFloating: () => {
            const client = workspace.activeClient;
            if (world.hasClient(client)) {
                world.removeClient(client, false);
            } else if (shouldTile(client)) {
                world.addClient(client);
            }
        },

        columnMoveLeft: () => {
            world.doIfTiledFocused((window, column, grid) => {
                grid.moveColumnLeft(column);
                grid.arrange();
            });
        },

        columnMoveRight: () => {
            world.doIfTiledFocused((window, column, grid) => {
                grid.moveColumnRight(column);
                grid.arrange();
            });
        },

        columnMoveStart: () => {
            world.doIfTiledFocused((window, column, grid) => {
                column.moveAfter(null);
                grid.arrange();
            });
        },

        columnMoveEnd: () => {
            world.doIfTiledFocused((window, column, grid) => {
                column.moveAfter(grid.getLastColumn());
                grid.arrange();
            });
        },

        columnExpand: () => {
            world.doIfTiledFocused((window, column, grid) => {
                column.expand();
                grid.arrange();
            });
        },

        gridScrollLeft: () => {
            gridScroll(world, -1);
        },

        gridScrollRight: () => {
            gridScroll(world, 1);
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
            grid.scrollToColumn(column);
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

        focusColumn: (columnIndex: number) => {
            world.doIfTiledFocused((window, column, grid) => {
                const targetColumn = grid.getColumnAtIndex(columnIndex);
                if (targetColumn === null) {
                    return null;
                }
                targetColumn.focus();
            });
        },

        windowMoveToColumn: (columnIndex: number) => {
            world.doIfTiledFocused((window, column, grid) => {
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
            world.doIfTiledFocused((window, column, grid) => {
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
            world.doIfTiledFocused((window, column, oldGrid) => {
                const desktopNumber = desktopIndex + 1;
                const newGrid = world.getGrid(desktopNumber);
                if (newGrid === null || newGrid === oldGrid) {
                    return;
                }
                column.moveToGrid(newGrid, newGrid.getLastColumn());
                oldGrid.arrange();
                newGrid.arrange();
            });
        },

        tailMoveToDesktop: (desktopIndex: number) => {
            world.doIfTiledFocused((window, column, oldGrid) => {
                const desktopNumber = desktopIndex + 1;
                const newGrid = world.getGrid(desktopNumber);
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

function gridScroll(world: World, direction: number) {
    const scrollAmount = GRID_SCROLL_STEP * direction;
    const grid = world.getCurrentGrid();
    grid.adjustScroll(scrollAmount, false);
    grid.arrange();
}
