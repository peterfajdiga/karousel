namespace Actions {
    export class Actions {
        constructor(
            private readonly config: Actions.Config,
        ) {}

        public "focus-left"(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
            const leftColumn = grid.getLeftColumn(column);
            if (leftColumn === null) {
                return;
            }
            leftColumn.focus();
        }

        public "focus-right"(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
            const rightColumn = grid.getRightColumn(column);
            if (rightColumn === null) {
                return;
            }
            rightColumn.focus();
        }

        public "focus-up"(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
            const aboveWindow = column.getAboveWindow(window);
            if (aboveWindow === null) {
                return;
            }
            aboveWindow.focus();
        }

        public "focus-down"(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
            const belowWindow = column.getBelowWindow(window);
            if (belowWindow === null) {
                return;
            }
            belowWindow.focus();
        }

        public "focus-start"(clientManager: ClientManager, desktopManager: DesktopManager) {
            const grid = desktopManager.getCurrentDesktop().grid;
            const firstColumn = grid.getFirstColumn();
            if (firstColumn === null) {
                return;
            }
            firstColumn.focus();
        }

        public "focus-end"(clientManager: ClientManager, desktopManager: DesktopManager) {
            const grid = desktopManager.getCurrentDesktop().grid;
            const lastColumn = grid.getLastColumn();
            if (lastColumn === null) {
                return;
            }
            lastColumn.focus();
        }

        public "window-move-left"(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
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

        public "window-move-right"(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
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
        public "window-move-up"(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
            column.moveWindowUp(window);
        }

        // TODO (optimization): only arrange moved windows
        public "window-move-down"(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
            column.moveWindowDown(window);
        }

        public "window-move-start"(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
            const newColumn = new Column(grid, null);
            window.moveToColumn(newColumn);
        }

        public "window-move-end"(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
            const newColumn = new Column(grid, grid.getLastColumn());
            window.moveToColumn(newColumn);
        }

        public "window-toggle-floating"(clientManager: ClientManager, desktopManager: DesktopManager) {
            const kwinClient = Workspace.activeWindow;
            clientManager.toggleFloatingClient(kwinClient);
        }

        public "column-move-left"(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
            grid.moveColumnLeft(column);
        }

        public "column-move-right"(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
            grid.moveColumnRight(column);
        }

        public "column-move-start"(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
            grid.moveColumn(column, null);
        }

        public "column-move-end"(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
            grid.moveColumn(column, grid.getLastColumn());
        }

        public "column-toggle-stacked"(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
            column.toggleStacked();
        }

        public "column-width-increase"(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
            this.config.columnResizer.increaseWidth(column, this.config.manualResizeStep);
        }

        public "column-width-decrease"(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
            this.config.columnResizer.decreaseWidth(column, this.config.manualResizeStep);
        }

        public "columns-width-equalize"(clientManager: ClientManager, desktopManager: DesktopManager) {
            desktopManager.getCurrentDesktop().equalizeVisibleColumnsWidths();
        }

        public "grid-scroll-left"(clientManager: ClientManager, desktopManager: DesktopManager) {
            this.gridScroll(desktopManager, -this.config.manualScrollStep);
        }

        public "grid-scroll-right"(clientManager: ClientManager, desktopManager: DesktopManager) {
            this.gridScroll(desktopManager, this.config.manualScrollStep);
        }

        public "grid-scroll-start"(clientManager: ClientManager, desktopManager: DesktopManager) {
            const grid = desktopManager.getCurrentDesktop().grid;
            const firstColumn = grid.getFirstColumn();
            if (firstColumn === null) {
                return;
            }
            grid.desktop.scrollToColumn(firstColumn);
        }

        public "grid-scroll-end"(clientManager: ClientManager, desktopManager: DesktopManager) {
            const grid = desktopManager.getCurrentDesktop().grid;
            const lastColumn = grid.getLastColumn();
            if (lastColumn === null) {
                return;
            }
            grid.desktop.scrollToColumn(lastColumn);
        }

        public "grid-scroll-focused"(clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
            grid.desktop.scrollCenterRange(column);
        }

        public "grid-scroll-left-column"(clientManager: ClientManager, desktopManager: DesktopManager) {
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

        public "grid-scroll-right-column"(clientManager: ClientManager, desktopManager: DesktopManager) {
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

        public "screen-switch"(clientManager: ClientManager, desktopManager: DesktopManager) {
            desktopManager.selectScreen(Workspace.activeScreen);
        }

        private gridScroll(desktopManager: DesktopManager, amount: number) {
            const grid = desktopManager.getCurrentDesktop().grid;
            grid.desktop.adjustScroll(amount, false);
        }
    }
}
