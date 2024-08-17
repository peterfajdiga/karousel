namespace Actions {
    export class Actions {
        constructor(
            private readonly world: World,
            private readonly config: Actions.Config,
        ) {}

        public "focus-left"() {
            this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                const prevColumn = grid.getPrevColumn(column);
                if (prevColumn === null) {
                    return;
                }
                prevColumn.focus();
            });
        }

        public "focus-right"() {
            this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                const nextColumn = grid.getNextColumn(column);
                if (nextColumn === null) {
                    return;
                }
                nextColumn.focus();
            });
        }

        public "focus-up"() {
            this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                const prevWindow = column.getPrevWindow(window);
                if (prevWindow === null) {
                    return;
                }
                prevWindow.focus();
            });
        }

        public "focus-down"() {
            this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                const nextWindow = column.getNextWindow(window);
                if (nextWindow === null) {
                    return;
                }
                nextWindow.focus();
            });
        }

        public "focus-start"() {
            this.world.do((clientManager, desktopManager) => {
                const grid = desktopManager.getCurrentDesktop().grid;
                const firstColumn = grid.getFirstColumn();
                if (firstColumn === null) {
                    return;
                }
                firstColumn.focus();
            });
        }

        public "focus-end"() {
            this.world.do((clientManager, desktopManager) => {
                const grid = desktopManager.getCurrentDesktop().grid;
                const lastColumn = grid.getLastColumn();
                if (lastColumn === null) {
                    return;
                }
                lastColumn.focus();
            });
        }

        public "window-move-left"() {
            this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
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
        }

        public "window-move-right"() {
            this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
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
        }

        public "window-move-up"() {
            // TODO (optimization): only arrange moved windows
            this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                column.moveWindowUp(window);
            });
        }

        public "window-move-down"() {
            // TODO (optimization): only arrange moved windows
            this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                column.moveWindowDown(window);
            });
        }

        public "window-move-start"() {
            this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                const newColumn = new Column(grid, null);
                window.moveToColumn(newColumn);
            });
        }

        public "window-move-end"() {
            this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                const newColumn = new Column(grid, grid.getLastColumn());
                window.moveToColumn(newColumn);
            });
        }

        public "window-toggle-floating"() {
            const kwinClient = Workspace.activeWindow;
            this.world.do((clientManager, desktopManager) => {
                clientManager.toggleFloatingClient(kwinClient);
            });
        }

        public "column-move-left"() {
            this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                grid.moveColumnLeft(column);
            });
        }

        public "column-move-right"() {
            this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                grid.moveColumnRight(column);
            });
        }

        public "column-move-start"() {
            this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                grid.moveColumn(column, null);
            });
        }

        public "column-move-end"() {
            this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                grid.moveColumn(column, grid.getLastColumn());
            });
        }

        public "column-toggle-stacked"() {
            this.world.doIfTiledFocused(false, (clientManager, desktopManager, window, column, grid) => {
                column.toggleStacked();
            });
        }

        public "column-width-increase"() {
            this.world.doIfTiledFocused(false, (clientManager, desktopManager, window, column, grid) => {
                this.config.columnResizer.increaseWidth(column, this.config.manualResizeStep);
            });
        }

        public "column-width-decrease"() {
            this.world.doIfTiledFocused(false, (clientManager, desktopManager, window, column, grid) => {
                this.config.columnResizer.decreaseWidth(column, this.config.manualResizeStep);
            });
        }

        public "columns-width-equalize"() {
            this.world.do((clientManager, desktopManager) => {
                desktopManager.getCurrentDesktop().equalizeVisibleColumnsWidths();
            });
        }

        public "grid-scroll-left"() {
            this.gridScroll(-this.config.manualScrollStep);
        }

        public "grid-scroll-right"() {
            this.gridScroll(this.config.manualScrollStep);
        }

        public "grid-scroll-start"() {
            this.world.do((clientManager, desktopManager) => {
                const grid = desktopManager.getCurrentDesktop().grid;
                const firstColumn = grid.getFirstColumn();
                if (firstColumn === null) {
                    return;
                }
                grid.desktop.scrollToColumn(firstColumn);
            });
        }

        public "grid-scroll-end"() {
            this.world.do((clientManager, desktopManager) => {
                const grid = desktopManager.getCurrentDesktop().grid;
                const lastColumn = grid.getLastColumn();
                if (lastColumn === null) {
                    return;
                }
                grid.desktop.scrollToColumn(lastColumn);
            });
        }

        public "grid-scroll-focused"() {
            this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                grid.desktop.scrollCenterRange(column);
            })
        }

        public "grid-scroll-left-column"() {
            this.world.do((clientManager, desktopManager) => {
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
        }

        public "grid-scroll-right-column"() {
            this.world.do((clientManager, desktopManager) => {
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
        }

        public "screen-switch"() {
            this.world.do((clientManager, desktopManager) => {
                desktopManager.selectScreen(Workspace.activeScreen);
            });
        }

        private gridScroll(amount: number) {
            this.world.do((clientManager, desktopManager) => {
                const grid = desktopManager.getCurrentDesktop().grid;
                grid.desktop.adjustScroll(amount, false);
            });
        }
    }
}
