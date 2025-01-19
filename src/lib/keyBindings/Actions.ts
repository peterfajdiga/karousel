class Actions {
    constructor(
        private readonly config: Actions.Config,
    ) {}

    public readonly focusLeft = (cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) => {
        const leftColumn = grid.getLeftColumn(column);
        if (leftColumn === null) {
            return;
        }
        leftColumn.focus();
    }

    public readonly focusRight = (cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) => {
        const rightColumn = grid.getRightColumn(column);
        if (rightColumn === null) {
            return;
        }
        rightColumn.focus();
    }

    public readonly focusUp = (cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) => {
        const aboveWindow = column.getAboveWindow(window);
        if (aboveWindow === null) {
            return;
        }
        aboveWindow.focus();
    }

    public readonly focusDown = (cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) => {
        const belowWindow = column.getBelowWindow(window);
        if (belowWindow === null) {
            return;
        }
        belowWindow.focus();
    }

    public readonly focusNext = (cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) => {
        const belowWindow = column.getBelowWindow(window);
        if (belowWindow !== null) {
            belowWindow.focus();
        } else {
            const rightColumn = grid.getRightColumn(column);
            if (rightColumn === null) {
                return;
            }
            rightColumn.getFirstWindow().focus();
        }
    }

    public readonly focusPrevious = (cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) => {
        const aboveWindow = column.getAboveWindow(window);
        if (aboveWindow !== null) {
            aboveWindow.focus();
        } else {
            const leftColumn = grid.getLeftColumn(column);
            if (leftColumn === null) {
                return;
            }
            leftColumn.getLastWindow().focus();
        }
    }

    public readonly focusStart = (cm: ClientManager, dm: DesktopManager) => {
        const grid = dm.getCurrentDesktop().grid;
        const firstColumn = grid.getFirstColumn();
        if (firstColumn === null) {
            return;
        }
        firstColumn.focus();
    }

    public readonly focusEnd = (cm: ClientManager, dm: DesktopManager) => {
        const grid = dm.getCurrentDesktop().grid;
        const lastColumn = grid.getLastColumn();
        if (lastColumn === null) {
            return;
        }
        lastColumn.focus();
    }

    public readonly windowMoveLeft = (cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) => {
        if (column.getWindowCount() === 1) {
            // move from own column into existing column
            const leftColumn = grid.getLeftColumn(column);
            if (leftColumn === null) {
                return;
            }
            window.moveToColumn(leftColumn, true);
            grid.desktop.autoAdjustScroll();
        } else {
            // move from shared column into own column
            const newColumn = new Column(grid, grid.getLeftColumn(column));
            window.moveToColumn(newColumn, true);
        }
    }

    public readonly windowMoveRight = (cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid, bottom: boolean = true) => {
        if (column.getWindowCount() === 1) {
            // move from own column into existing column
            const rightColumn = grid.getRightColumn(column);
            if (rightColumn === null) {
                return;
            }
            window.moveToColumn(rightColumn, bottom);
            grid.desktop.autoAdjustScroll();
        } else {
            // move from shared column into own column
            const newColumn = new Column(grid, column);
            window.moveToColumn(newColumn, true);
        }
    }

    // TODO (optimization): only arrange moved windows
    public readonly windowMoveUp = (cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) => {
        column.moveWindowUp(window);
    }

    // TODO (optimization): only arrange moved windows
    public readonly windowMoveDown = (cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) => {
        column.moveWindowDown(window);
    }

    public readonly windowMoveNext = (cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) => {
        const canMoveDown = window !== column.getLastWindow();
        if (canMoveDown) {
            column.moveWindowDown(window);
        } else {
            this.windowMoveRight(cm, dm, window, column, grid, false);
        }
    }

    public readonly windowMovePrevious = (cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) => {
        const canMoveUp = window !== column.getFirstWindow();
        if (canMoveUp) {
            column.moveWindowUp(window);
        } else {
            this.windowMoveLeft(cm, dm, window, column, grid);
        }
    }

    public readonly windowMoveStart = (cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) => {
        const newColumn = new Column(grid, null);
        window.moveToColumn(newColumn, true);
    }

    public readonly windowMoveEnd = (cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) => {
        const newColumn = new Column(grid, grid.getLastColumn());
        window.moveToColumn(newColumn, true);
    }

    public readonly windowToggleFloating = (cm: ClientManager, dm: DesktopManager) => {
        if (Workspace.activeWindow === null) {
            return;
        }
        cm.toggleFloatingClient(Workspace.activeWindow);
    }

    public readonly columnMoveLeft = (cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) => {
        grid.moveColumnLeft(column);
    }

    public readonly columnMoveRight = (cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) => {
        grid.moveColumnRight(column);
    }

    public readonly columnMoveStart = (cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) => {
        grid.moveColumn(column, null);
    }

    public readonly columnMoveEnd = (cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) => {
        grid.moveColumn(column, grid.getLastColumn());
    }

    public readonly columnToggleStacked = (cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) => {
        column.toggleStacked();
    }

    public readonly columnWidthIncrease = (cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) => {
        this.config.columnResizer.increaseWidth(column);
    }

    public readonly columnWidthDecrease = (cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) => {
        this.config.columnResizer.decreaseWidth(column);
    }

    public readonly cyclePresetWidths = (cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) => {
        const nextWidth = this.config.presetWidths.next(column.getWidth(), column.getMinWidth(), column.getMaxWidth());
        column.setWidth(nextWidth, true);
    }

    public readonly cyclePresetWidthsReverse = (cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) => {
        const nextWidth = this.config.presetWidths.prev(column.getWidth(), column.getMinWidth(), column.getMaxWidth());
        column.setWidth(nextWidth, true);
    }

    public readonly columnsWidthEqualize = (cm: ClientManager, dm: DesktopManager) => {
        const desktop = dm.getCurrentDesktop();
        const visibleRange = desktop.getCurrentVisibleRange();
        const visibleColumns = Array.from(desktop.grid.getVisibleColumns(visibleRange, true));

        const availableSpace = desktop.tilingArea.width;
        const gapsWidth = desktop.grid.config.gapsInnerHorizontal * (visibleColumns.length-1);
        const widths = fillSpace(
            availableSpace - gapsWidth,
            visibleColumns.map(column => ({ min: column.getMinWidth(), max: column.getMaxWidth() })),
        );
        visibleColumns.forEach((column, index) => column.setWidth(widths[index], true));

        desktop.scrollCenterRange(Range.fromRanges(
            visibleColumns[0],
            visibleColumns[visibleColumns.length - 1],
        ));
    }

    public readonly columnsSqueezeLeft = (cm: ClientManager, dm: DesktopManager, window: Window, focusedColumn: Column, grid: Grid) => {
        const visibleRange = grid.desktop.getCurrentVisibleRange();
        if (!Range.contains(visibleRange, focusedColumn)) {
            return;
        }

        const currentVisibleColumns = Array.from(grid.getVisibleColumns(visibleRange, true));
        console.assert(currentVisibleColumns.includes(focusedColumn), "should at least contain the focused column");

        const targetColumn = grid.getLeftColumn(currentVisibleColumns[0]);
        if (targetColumn === null) {
            return;
        }

        const wantedVisibleColumns = [targetColumn, ...currentVisibleColumns];
        while (true) {
            const success = this.squeezeColumns(wantedVisibleColumns);
            if (success) {
                break;
            }
            const removedColumn = wantedVisibleColumns.pop();
            if (removedColumn === focusedColumn) {
                break; // don't scroll past the currently focused column
            }
        }
    }

    public readonly columnsSqueezeRight = (cm: ClientManager, dm: DesktopManager, window: Window, focusedColumn: Column, grid: Grid) => {
        const visibleRange = grid.desktop.getCurrentVisibleRange();
        if (!Range.contains(visibleRange, focusedColumn)) {
            return;
        }

        const currentVisibleColumns = Array.from(grid.getVisibleColumns(visibleRange, true));
        console.assert(currentVisibleColumns.includes(focusedColumn), "should at least contain the focused column");

        const targetColumn = grid.getRightColumn(currentVisibleColumns[currentVisibleColumns.length-1]);
        if (targetColumn === null) {
            return;
        }

        const wantedVisibleColumns = [...currentVisibleColumns, targetColumn];
        while (true) {
            const success = this.squeezeColumns(wantedVisibleColumns);
            if (success) {
                break;
            }
            const removedColumn = wantedVisibleColumns.shift();
            if (removedColumn === focusedColumn) {
                break; // don't scroll past the currently focused column
            }
        }
    }

    private readonly squeezeColumns = (columns: Column[]) => {
        const firstColumn = columns[0];
        const lastColumn = columns[columns.length-1];
        const grid = firstColumn.grid;
        const desktop = grid.desktop;

        const availableSpace = desktop.tilingArea.width;
        const gapsWidth = grid.config.gapsInnerHorizontal * (columns.length-1);
        const columnConstraints = columns.map(column => ({ min: column.getMinWidth(), max: column.getWidth() }));
        const minTotalWidth = gapsWidth + columnConstraints.reduce((acc, constraint) => acc + constraint.min, 0);
        if (minTotalWidth > availableSpace) {
            // there's nothing we can do
            return false;
        }

        const widths = fillSpace(availableSpace - gapsWidth, columnConstraints);
        columns.forEach((column, index) => column.setWidth(widths[index], true));
        desktop.scrollCenterRange(Range.fromRanges(firstColumn, lastColumn));
        return true;
    }

    public readonly gridScrollLeft = (cm: ClientManager, dm: DesktopManager) => {
        this.gridScroll(dm, -this.config.manualScrollStep);
    }

    public readonly gridScrollRight = (cm: ClientManager, dm: DesktopManager) => {
        this.gridScroll(dm, this.config.manualScrollStep);
    }

    private readonly gridScroll = (desktopManager: DesktopManager, amount: number) => {
        desktopManager.getCurrentDesktop().adjustScroll(amount, false);
    }

    public readonly gridScrollStart = (cm: ClientManager, dm: DesktopManager) => {
        const grid = dm.getCurrentDesktop().grid;
        const firstColumn = grid.getFirstColumn();
        if (firstColumn === null) {
            return;
        }
        grid.desktop.scrollToColumn(firstColumn, false);
    }

    public readonly gridScrollEnd = (cm: ClientManager, dm: DesktopManager) => {
        const grid = dm.getCurrentDesktop().grid;
        const lastColumn = grid.getLastColumn();
        if (lastColumn === null) {
            return;
        }
        grid.desktop.scrollToColumn(lastColumn, false);
    }

    public readonly gridScrollFocused = (cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) => {
        const scrollAmount = Range.minus(column, grid.desktop.getCurrentVisibleRange());
        if (scrollAmount !== 0) {
            grid.desktop.adjustScroll(scrollAmount, true);
        } else {
            grid.desktop.scrollToColumn(column, true);
        }
    }

    public readonly gridScrollLeftColumn = (cm: ClientManager, dm: DesktopManager) => {
        const grid = dm.getCurrentDesktop().grid;
        const column = grid.getLeftmostVisibleColumn(grid.desktop.getCurrentVisibleRange(), true);
        if (column === null) {
            return;
        }

        const leftColumn = grid.getLeftColumn(column);
        if (leftColumn === null) {
            return;
        }

        grid.desktop.scrollToColumn(leftColumn, false);
    }

    public readonly gridScrollRightColumn = (cm: ClientManager, dm: DesktopManager) => {
        const grid = dm.getCurrentDesktop().grid;
        const column = grid.getRightmostVisibleColumn(grid.desktop.getCurrentVisibleRange(), true);
        if (column === null) {
            return;
        }

        const rightColumn = grid.getRightColumn(column);
        if (rightColumn === null) {
            return;
        }

        grid.desktop.scrollToColumn(rightColumn, false);
    }

    public readonly screenSwitch = (cm: ClientManager, dm: DesktopManager) => {
        dm.selectScreen(Workspace.activeScreen);
    }

    public readonly focus = (columnIndex: number, cm: ClientManager, dm: DesktopManager) => {
        const grid = dm.getCurrentDesktop().grid;
        const targetColumn = grid.getColumnAtIndex(columnIndex);
        if (targetColumn === null) {
            return;
        }
        targetColumn.focus();
    };

    public readonly windowMoveToColumn = (columnIndex: number, cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) => {
        const targetColumn = grid.getColumnAtIndex(columnIndex);
        if (targetColumn === null) {
            return;
        }
        window.moveToColumn(targetColumn, true);
        grid.desktop.autoAdjustScroll();
    };

    public readonly columnMoveToColumn = (columnIndex: number, cm: ClientManager, dm: DesktopManager, window: Window, column: Column, grid: Grid) => {
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

    public readonly columnMoveToDesktop = (desktopIndex: number, cm: ClientManager, dm: DesktopManager, window: Window, column: Column, oldGrid: Grid) => {
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

    public readonly tailMoveToDesktop = (desktopIndex: number, cm: ClientManager, dm: DesktopManager, window: Window, column: Column, oldGrid: Grid) => {
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
        presetWidths: {
            next: (currentWidth: number, minWidth: number, maxWidth: number) => number;
            prev: (currentWidth: number, minWidth: number, maxWidth: number) => number
};
        columnResizer: ColumnResizer;
    };

    export type ColumnResizer = {
        increaseWidth(column: Column): void;
        decreaseWidth(column: Column): void;
    };
}
