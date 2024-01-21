namespace Actions {
    export function init(world: World, config: Config) {
        return {
            focusLeft: () => {
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                    const prevColumn = grid.getPrevColumn(column);
                    if (prevColumn === null) {
                        return;
                    }
                    prevColumn.focus();
                });
            },

            focusRight: () => {
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                    const nextColumn = grid.getNextColumn(column);
                    if (nextColumn === null) {
                        return;
                    }
                    nextColumn.focus();
                });
            },

            focusUp: () => {
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                    const prevWindow = column.getPrevWindow(window);
                    if (prevWindow === null) {
                        return;
                    }
                    prevWindow.focus();
                });
            },

            focusDown: () => {
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
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
            },

            windowMoveRight: () => {
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
            },

            windowMoveUp: () => {
                // TODO (optimization): only arrange moved windows
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                    column.moveWindowUp(window);
                });
            },

            windowMoveDown: () => {
                // TODO (optimization): only arrange moved windows
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                    column.moveWindowDown(window);
                });
            },

            windowMoveStart: () => {
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                    const newColumn = new Column(grid, null);
                    window.moveToColumn(newColumn);
                });
            },

            windowMoveEnd: () => {
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
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
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                    grid.moveColumnLeft(column);
                });
            },

            columnMoveRight: () => {
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                    grid.moveColumnRight(column);
                });
            },

            columnMoveStart: () => {
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                    column.moveAfter(null);
                });
            },

            columnMoveEnd: () => {
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                    column.moveAfter(grid.getLastColumn());
                });
            },

            columnToggleStacked: () => {
                world.doIfTiledFocused(false, (clientManager, desktopManager, window, column, grid) => {
                    column.toggleStacked();
                });
            },

            columnWidthIncrease: () => {
                world.doIfTiledFocused(false, (clientManager, desktopManager, window, column, grid) => {
                    const desktop = grid.desktop;
                    const visibleRange = desktop.getCurrentVisibleRange();
                    if(!column.isVisible(visibleRange, true) || column.getWidth() >= column.getMaxWidth()) {
                        return;
                    }

                    let leftVisibleColumn = grid.getLeftmostVisibleColumn(visibleRange, true);
                    let rightVisibleColumn = grid.getRightmostVisibleColumn(visibleRange, true);
                    if (leftVisibleColumn === null || rightVisibleColumn === null) {
                        console.assert(false);
                        return;
                    }

                    const leftSpace = leftVisibleColumn.getLeft() - visibleRange.getLeft();
                    const rightSpace = visibleRange.getRight() - rightVisibleColumn.getRight();
                    if (leftSpace + rightSpace > 0) {
                        column.adjustWidth(leftSpace + rightSpace, true);
                    } else {
                        // left and right columns are touching the screen's edges
                        const leftSpace = leftVisibleColumn === column ? Infinity : leftVisibleColumn.getWidth() + grid.config.gapsInnerHorizontal;
                        const rightSpace = rightVisibleColumn === column ? Infinity : rightVisibleColumn.getWidth() + grid.config.gapsInnerHorizontal;
                        if (leftSpace < rightSpace) {
                            column.adjustWidth(leftSpace, true);
                            leftVisibleColumn = grid.getNextColumn(leftVisibleColumn)!;
                        } else {
                            column.adjustWidth(rightSpace, true);
                            rightVisibleColumn = grid.getPrevColumn(rightVisibleColumn)!;
                        }
                    }

                    desktop.scrollCenterRange(Desktop.RangeImpl.fromRanges(leftVisibleColumn, rightVisibleColumn));
                });
            },

            columnWidthDecrease: () => {
                world.doIfTiledFocused(false, (clientManager, desktopManager, window, column, grid) => {
                    const desktop = grid.desktop;
                    const visibleRange = desktop.getCurrentVisibleRange();
                    if (!column.isVisible(visibleRange, true)) {
                        return;
                    }

                    if (grid.getWidth() <= visibleRange.getWidth()) {
                        column.setWidth(Math.round(column.getWidth() / 2), true);
                        return;
                    }

                    const leftVisibleColumn = grid.getLeftmostVisibleColumn(visibleRange, true);
                    const rightVisibleColumn = grid.getRightmostVisibleColumn(visibleRange, true);
                    if (leftVisibleColumn === null || rightVisibleColumn === null) {
                        console.assert(false);
                        return;
                    }

                    let leftOffScreenColumn = grid.getPrevColumn(leftVisibleColumn);
                    if (leftOffScreenColumn === column) {
                        leftOffScreenColumn = null;
                    }
                    let rightOffScreenColumn = grid.getNextColumn(rightVisibleColumn);
                    if (rightOffScreenColumn === column) {
                        rightOffScreenColumn = null;
                    }
                    if (leftOffScreenColumn === null && rightOffScreenColumn === null) {
                        console.assert(false);
                        return;
                    }

                    const leftInvisibleWidth = leftOffScreenColumn === null ? Infinity : visibleRange.getLeft() - leftOffScreenColumn.getLeft();
                    const rightInvisibleWidth = rightOffScreenColumn === null ? Infinity : rightOffScreenColumn.getRight() - visibleRange.getRight();

                    const leftSpace = leftVisibleColumn.getLeft() - visibleRange.getLeft();
                    const rightSpace = visibleRange.getRight() - rightVisibleColumn.getRight();

                    if (leftInvisibleWidth < rightInvisibleWidth) {
                        const deltaWidth = rightSpace - leftInvisibleWidth;
                        column.adjustWidth(deltaWidth, true);
                        console.assert(leftOffScreenColumn !== null);
                        const newVisibleWidth = rightVisibleColumn.getRight() - leftOffScreenColumn!.getLeft();
                        const leftVisibleColumn = newVisibleWidth <= visibleRange.getWidth() ? leftOffScreenColumn! : grid.getNextColumn(leftOffScreenColumn!)!;
                        desktop.scrollCenterRange(Desktop.RangeImpl.fromRanges(leftVisibleColumn, rightVisibleColumn));
                    } else {
                        const deltaWidth = leftSpace - rightInvisibleWidth;
                        column.adjustWidth(deltaWidth, true);
                        console.assert(rightOffScreenColumn !== null);
                        const newVisibleWidth = rightOffScreenColumn!.getRight() - leftVisibleColumn.getLeft();
                        const rightVisibleColumn = newVisibleWidth <= visibleRange.getWidth() ? rightOffScreenColumn! : grid.getPrevColumn(rightOffScreenColumn!)!;
                        desktop.scrollCenterRange(Desktop.RangeImpl.fromRanges(leftVisibleColumn, rightVisibleColumn));
                    }
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
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                    grid.desktop.scrollCenterRange(column);
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
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                    const targetColumn = grid.getColumnAtIndex(columnIndex);
                    if (targetColumn === null) {
                        return null;
                    }
                    window.moveToColumn(targetColumn);
                    grid.desktop.autoAdjustScroll();
                });
            },

            columnMoveToColumn: (columnIndex: number) => {
                world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
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
