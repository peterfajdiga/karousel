class Actions {
    constructor(
        private readonly config: Actions.Config,
    ) {}

    public focusLeft(cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) {
        const leftColumn = grid.getLeftColumn(column);
        if (leftColumn === null) {
            return;
        }
        leftColumn.focus();
    }

    public focusRight(cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) {
        const rightColumn = grid.getRightColumn(column);
        if (rightColumn === null) {
            return;
        }
        rightColumn.focus();
    }

    public focusUp(cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) {
        const aboveWindow = column.getAboveWindow(window);
        if (aboveWindow === null) {
            return;
        }
        aboveWindow.focus();
    }

    public focusDown(cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) {
        const belowWindow = column.getBelowWindow(window);
        if (belowWindow === null) {
            return;
        }
        belowWindow.focus();
    }

    public focusStart(cm: ClientManager, dm: DesktopManager) {
        const grid = dm.getCurrentDesktop().grid;
        const firstColumn = grid.getFirstColumn();
        if (firstColumn === null) {
            return;
        }
        firstColumn.focus();
    }

    public focusEnd(cm: ClientManager, dm: DesktopManager) {
        const grid = dm.getCurrentDesktop().grid;
        const lastColumn = grid.getLastColumn();
        if (lastColumn === null) {
            return;
        }
        lastColumn.focus();
    }

    public windowMoveLeft(cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) {
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

    public windowMoveRight(cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) {
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
    public windowMoveUp(cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) {
        column.moveWindowUp(window);
    }

    // TODO (optimization): only arrange moved windows
    public windowMoveDown(cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) {
        column.moveWindowDown(window);
    }

    public windowMoveStart(cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) {
        const newColumn = new Column(grid, null);
        window.moveToColumn(newColumn);
    }

    public windowMoveEnd(cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) {
        const newColumn = new Column(grid, grid.getLastColumn());
        window.moveToColumn(newColumn);
    }

    public windowToggleFloating(cm: ClientManager, dm: DesktopManager) {
        const kwinClient = Workspace.activeWindow;
        cm.toggleFloatingClient(kwinClient);
    }

    public columnMoveLeft(cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) {
        grid.moveColumnLeft(column);
    }

    public columnMoveRight(cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) {
        grid.moveColumnRight(column);
    }

    public columnMoveStart(cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) {
        grid.moveColumn(column, null);
    }

    public columnMoveEnd(cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) {
        grid.moveColumn(column, grid.getLastColumn());
    }

    public columnToggleStacked(cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) {
        column.toggleStacked();
    }

    public columnWidthIncrease(cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) {
        this.config.columnResizer.increaseWidth(column, this.config.manualResizeStep);
    }

    public columnWidthDecrease(cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) {
        this.config.columnResizer.decreaseWidth(column, this.config.manualResizeStep);
    }

    public columnsWidthEqualize(cm: ClientManager, dm: DesktopManager) {
        dm.getCurrentDesktop().equalizeVisibleColumnsWidths();
    }

    public gridScrollLeft(cm: ClientManager, dm: DesktopManager) {
        this.gridScroll(dm, -this.config.manualScrollStep);
    }

    public gridScrollRight(cm: ClientManager, dm: DesktopManager) {
        this.gridScroll(dm, this.config.manualScrollStep);
    }

    private gridScroll(desktopManager: DesktopManager, amount: number) {
        const grid = desktopManager.getCurrentDesktop().grid;
        grid.desktop.adjustScroll(amount, false);
    }

    public gridScrollStart(cm: ClientManager, dm: DesktopManager) {
        const grid = dm.getCurrentDesktop().grid;
        const firstColumn = grid.getFirstColumn();
        if (firstColumn === null) {
            return;
        }
        grid.desktop.scrollToColumn(firstColumn);
    }

    public gridScrollEnd(cm: ClientManager, dm: DesktopManager) {
        const grid = dm.getCurrentDesktop().grid;
        const lastColumn = grid.getLastColumn();
        if (lastColumn === null) {
            return;
        }
        grid.desktop.scrollToColumn(lastColumn);
    }

    public gridScrollFocused(cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) {
        grid.desktop.scrollCenterRange(column);
    }

    public gridScrollLeftColumn(cm: ClientManager, dm: DesktopManager) {
        const grid = dm.getCurrentDesktop().grid;
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

    public gridScrollRightColumn(cm: ClientManager, dm: DesktopManager) {
        const grid = dm.getCurrentDesktop().grid;
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

    public screenSwitch(cm: ClientManager, dm: DesktopManager) {
        dm.selectScreen(Workspace.activeScreen);
    }

    public focus(columnIndex: number, cm: ClientManager, dm: DesktopManager) {
        const grid = dm.getCurrentDesktop().grid;
        const targetColumn = grid.getColumnAtIndex(columnIndex);
        if (targetColumn === null) {
            return;
        }
        targetColumn.focus();
    };

    public windowMoveToColumn(columnIndex: number, cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) {
        const targetColumn = grid.getColumnAtIndex(columnIndex);
        if (targetColumn === null) {
            return;
        }
        window.moveToColumn(targetColumn);
        grid.desktop.autoAdjustScroll();
    };

    public columnMoveToColumn(columnIndex: number, cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) {
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

    public columnMoveToDesktop(desktopIndex: number, cm: ClientManager, dm: DesktopManager, window: Window, column: Column, oldGrid: Grid) {
        const kwinDesktop = Workspace.desktops[desktopIndex];
        if (kwinDesktop === undefined) {
            return;
        }
        const newGrid = dm.getDesktopInCurrentActivity(kwinDesktop).grid;
        if (newGrid === null || newGrid === oldGrid) {
            return;
        }
        column.moveToGrid(newGrid, newGrid.getLastColumn());
    };

    public tailMoveToDesktop(desktopIndex: number, cm: ClientManager, dm: DesktopManager, window: Window, column: Column, oldGrid: Grid) {
        const kwinDesktop = Workspace.desktops[desktopIndex];
        if (kwinDesktop === undefined) {
            return;
        }
        const newGrid = dm.getDesktopInCurrentActivity(kwinDesktop).grid;
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
