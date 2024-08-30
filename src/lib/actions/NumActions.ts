namespace Actions {
    export class NumActions {
        constructor(private readonly world: World) {}

        public "focus-"(columnIndex: number) {
            this.world.do((clientManager, desktopManager) => {
                const grid = desktopManager.getCurrentDesktop().grid;
                const targetColumn = grid.getColumnAtIndex(columnIndex);
                if (targetColumn === null) {
                    return;
                }
                targetColumn.focus();
            });
        };

        public "window-move-to-column-"(columnIndex: number) {
            this.world.doIfTiledFocused((clientManager, desktopManager, window, column, grid) => {
                const targetColumn = grid.getColumnAtIndex(columnIndex);
                if (targetColumn === null) {
                    return;
                }
                window.moveToColumn(targetColumn);
                grid.desktop.autoAdjustScroll();
            });
        };

        public "column-move-to-column-"(columnIndex: number) {
            this.world.doIfTiledFocused((clientManager, desktopManager, window, column, grid) => {
                const targetColumn = grid.getColumnAtIndex(columnIndex);
                if (targetColumn === null || targetColumn === column) {
                    return;
                }
                if (targetColumn.isToTheRightOf(column)) {
                    grid.moveColumn(column, targetColumn);
                } else {
                    grid.moveColumn(column, grid.getLeftColumn(targetColumn));
                }
            });
        };

        public "column-move-to-desktop-"(desktopIndex: number) {
            this.world.doIfTiledFocused((clientManager, desktopManager, window, column, oldGrid) => {
                const kwinDesktop = Workspace.desktops[desktopIndex];
                if (kwinDesktop === undefined) {
                    return;
                }
                const newGrid = desktopManager.getDesktopInCurrentActivity(kwinDesktop).grid;
                if (newGrid === null || newGrid === oldGrid) {
                    return;
                }
                column.moveToGrid(newGrid, newGrid.getLastColumn());
            });
        };

        public "tail-move-to-desktop-"(desktopIndex: number) {
            this.world.doIfTiledFocused((clientManager, desktopManager, window, column, oldGrid) => {
                const kwinDesktop = Workspace.desktops[desktopIndex];
                if (kwinDesktop === undefined) {
                    return;
                }
                const newGrid = desktopManager.getDesktopInCurrentActivity(kwinDesktop).grid;
                if (newGrid === null || newGrid === oldGrid) {
                    return;
                }
                oldGrid.evacuateTail(newGrid, column);
            });
        };
    }
}
