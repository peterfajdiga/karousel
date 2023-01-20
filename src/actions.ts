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
            const grid = world.getGrid(workspace.currentDesktop);
            const firstColumn = grid.getFirstColumn();
            if (firstColumn === null) {
                return;
            }
            firstColumn.focus();
            grid.arrange();
        },

        focusEnd: () => {
            const grid = world.getGrid(workspace.currentDesktop);
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
                    grid.mergeColumnsLeft(column);
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
                    grid.mergeColumnsRight(column);
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

        windowToggleFloating: () => {
            const client = workspace.activeClient;
            if (world.hasClient(client)) {
                world.removeClient(client);
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

        gridScrollLeft: () => {
            gridScroll(world, -1);
        },

        gridScrollRight: () => {
            gridScroll(world, 1);
        },

        gridScrollStart: () => {
            const grid = world.getGrid(workspace.currentDesktop);
            const firstColumn = grid.getFirstColumn();
            if (firstColumn === null) {
                return;
            }
            grid.scrollToColumn(firstColumn);
            grid.arrange();
        },

        gridScrollEnd: () => {
            const grid = world.getGrid(workspace.currentDesktop);
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
            const grid = world.getGrid(workspace.currentDesktop);
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
            const grid = world.getGrid(workspace.currentDesktop);
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

function gridScroll(world: World, direction: number) {
    const scrollAmount = GRID_SCROLL_STEP * direction;
    const grid = world.getGrid(workspace.currentDesktop);
    grid.adjustScroll(scrollAmount, false);
    grid.arrange();
}
