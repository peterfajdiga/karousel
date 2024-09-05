class Actions {
    constructor(
        private readonly config: Actions.Config,
    ) {}

    public focusLeft(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
        const leftColumn = grid.getLeftColumn(column);
        if (leftColumn === null) {
            return;
        }
        leftColumn.focus();
    }

    public focusRight(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
        const rightColumn = grid.getRightColumn(column);
        if (rightColumn === null) {
            return;
        }
        rightColumn.focus();
    }

    public focusUp(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
        const aboveWindow = column.getAboveWindow(window);
        if (aboveWindow === null) {
            return;
        }
        aboveWindow.focus();
    }

    public focusDown(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
        const belowWindow = column.getBelowWindow(window);
        if (belowWindow === null) {
            return;
        }
        belowWindow.focus();
    }

    public focusStart(clientManager: ClientManager, desktopManager: DesktopManager) {
        const grid = desktopManager.getCurrentDesktop().grid;
        const firstColumn = grid.getFirstColumn();
        if (firstColumn === null) {
            return;
        }
        firstColumn.focus();
    }

    public focusEnd(clientManager: ClientManager, desktopManager: DesktopManager) {
        const grid = desktopManager.getCurrentDesktop().grid;
        const lastColumn = grid.getLastColumn();
        if (lastColumn === null) {
            return;
        }
        lastColumn.focus();
    }

    public windowMoveLeft(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
        if (column.getWindowCount() === 1) {
            // move from own column into existing column
            const leftColumn = grid.getLeftColumn(column);
            if (leftColumn === null) {
                return;
            }
            window.moveToColumn(leftColumn);
            grid.desktop.autoAdjustScroll();
        } else {
            // move from shared column into own column
            const newColumn = new Column(grid, grid.getLeftColumn(column));
            window.moveToColumn(newColumn);
        }
    }

    public windowMoveRight(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
        if (column.getWindowCount() === 1) {
            // move from own column into existing column
            const rightColumn = grid.getRightColumn(column);
            if (rightColumn === null) {
                return;
            }
            window.moveToColumn(rightColumn);
            grid.desktop.autoAdjustScroll();
        } else {
            // move from shared column into own column
            const newColumn = new Column(grid, column);
            window.moveToColumn(newColumn);
        }
    }

    // TODO (optimization): only arrange moved windows
    public windowMoveUp(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
        column.moveWindowUp(window);
    }

    // TODO (optimization): only arrange moved windows
    public windowMoveDown(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
        column.moveWindowDown(window);
    }

    public windowMoveStart(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
        const newColumn = new Column(grid, null);
        window.moveToColumn(newColumn);
    }

    public windowMoveEnd(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
        const newColumn = new Column(grid, grid.getLastColumn());
        window.moveToColumn(newColumn);
    }

    public windowToggleFloating(clientManager: ClientManager, desktopManager: DesktopManager) {
        const kwinClient = Workspace.activeWindow;
        clientManager.toggleFloatingClient(kwinClient);
    }

    public columnMoveLeft(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
        grid.moveColumnLeft(column);
    }

    public columnMoveRight(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
        grid.moveColumnRight(column);
    }

    public columnMoveStart(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
        grid.moveColumn(column, null);
    }

    public columnMoveEnd(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
        grid.moveColumn(column, grid.getLastColumn());
    }

    public columnToggleStacked(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
        column.toggleStacked();
    }

    public columnWidthIncrease(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
        this.config.columnResizer.increaseWidth(column, this.config.manualResizeStep);
    }

    public columnWidthDecrease(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
        this.config.columnResizer.decreaseWidth(column, this.config.manualResizeStep);
    }

    public columnsWidthEqualize(clientManager: ClientManager, desktopManager: DesktopManager) {
        desktopManager.getCurrentDesktop().equalizeVisibleColumnsWidths();
    }

    public gridScrollLeft(clientManager: ClientManager, desktopManager: DesktopManager) {
        this.gridScroll(desktopManager, -this.config.manualScrollStep);
    }

    public gridScrollRight(clientManager: ClientManager, desktopManager: DesktopManager) {
        this.gridScroll(desktopManager, this.config.manualScrollStep);
    }

    private gridScroll(desktopManager: DesktopManager, amount: number) {
        const grid = desktopManager.getCurrentDesktop().grid;
        grid.desktop.adjustScroll(amount, false);
    }

    public gridScrollStart(clientManager: ClientManager, desktopManager: DesktopManager) {
        const grid = desktopManager.getCurrentDesktop().grid;
        const firstColumn = grid.getFirstColumn();
        if (firstColumn === null) {
            return;
        }
        grid.desktop.scrollToColumn(firstColumn);
    }

    public gridScrollEnd(clientManager: ClientManager, desktopManager: DesktopManager) {
        const grid = desktopManager.getCurrentDesktop().grid;
        const lastColumn = grid.getLastColumn();
        if (lastColumn === null) {
            return;
        }
        grid.desktop.scrollToColumn(lastColumn);
    }

    public gridScrollFocused(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
        grid.desktop.scrollCenterRange(column);
    }

    public gridScrollLeftColumn(clientManager: ClientManager, desktopManager: DesktopManager) {
        const grid = desktopManager.getCurrentDesktop().grid;
        const column = grid.getLeftmostVisibleColumn(grid.desktop.getCurrentVisibleRange(), true);
        if (column === null) {
            return;
        }

        const leftColumn = grid.getLeftColumn(column);
        if (leftColumn === null) {
            return;
        }

        grid.desktop.scrollToColumn(leftColumn);
    }

    public gridScrollRightColumn(clientManager: ClientManager, desktopManager: DesktopManager) {
        const grid = desktopManager.getCurrentDesktop().grid;
        const column = grid.getRightmostVisibleColumn(grid.desktop.getCurrentVisibleRange(), true);
        if (column === null) {
            return;
        }

        const rightColumn = grid.getRightColumn(column);
        if (rightColumn === null) {
            return;
        }

        grid.desktop.scrollToColumn(rightColumn);
    }

    public screenSwitch(clientManager: ClientManager, desktopManager: DesktopManager) {
        desktopManager.selectScreen(Workspace.activeScreen);
    }

    public focus(columnIndex: number, clientManager: ClientManager, desktopManager: DesktopManager) {
        const grid = desktopManager.getCurrentDesktop().grid;
        const targetColumn = grid.getColumnAtIndex(columnIndex);
        if (targetColumn === null) {
            return;
        }
        targetColumn.focus();
    };

    public windowMoveToColumn(columnIndex: number, clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
        const targetColumn = grid.getColumnAtIndex(columnIndex);
        if (targetColumn === null) {
            return;
        }
        window.moveToColumn(targetColumn);
        grid.desktop.autoAdjustScroll();
    };

    public columnMoveToColumn(columnIndex: number, clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
        const targetColumn = grid.getColumnAtIndex(columnIndex);
        if (targetColumn === null || targetColumn === column) {
            return;
        }
        if (targetColumn.isToTheRightOf(column)) {
            grid.moveColumn(column, targetColumn);
        } else {
            grid.moveColumn(column, grid.getLeftColumn(targetColumn));
        }
    };

    public columnMoveToDesktop(desktopIndex: number, clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, oldGrid: Grid) {
        const kwinDesktop = Workspace.desktops[desktopIndex];
        if (kwinDesktop === undefined) {
            return;
        }
        const newGrid = desktopManager.getDesktopInCurrentActivity(kwinDesktop).grid;
        if (newGrid === null || newGrid === oldGrid) {
            return;
        }
        column.moveToGrid(newGrid, newGrid.getLastColumn());
    };

    public tailMoveToDesktop(desktopIndex: number, clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, oldGrid: Grid) {
        const kwinDesktop = Workspace.desktops[desktopIndex];
        if (kwinDesktop === undefined) {
            return;
        }
        const newGrid = desktopManager.getDesktopInCurrentActivity(kwinDesktop).grid;
        if (newGrid === null || newGrid === oldGrid) {
            return;
        }
        oldGrid.evacuateTail(newGrid, column);
    };
}

namespace Actions {
    export type Config = {
        manualScrollStep: number;
        manualResizeStep: number;
        columnResizer: ColumnResizer;
    };

    export type ColumnResizer = {
        increaseWidth(column: Column, step: number): void;
        decreaseWidth(column: Column, step: number): void;
    };
}
