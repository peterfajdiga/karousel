namespace Actions {
    export class NumActions {
        constructor() {}

        public "focus-"(columnIndex: number, clientManager: ClientManager, desktopManager: DesktopManager) {
            const grid = desktopManager.getCurrentDesktop().grid;
            const targetColumn = grid.getColumnAtIndex(columnIndex);
            if (targetColumn === null) {
                return;
            }
            targetColumn.focus();
        };

        public "window-move-to-column-"(columnIndex: number, clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
            const targetColumn = grid.getColumnAtIndex(columnIndex);
            if (targetColumn === null) {
                return;
            }
            window.moveToColumn(targetColumn);
            grid.desktop.autoAdjustScroll();
        };

        public "column-move-to-column-"(columnIndex: number, clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) {
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

        public "column-move-to-desktop-"(desktopIndex: number, clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, oldGrid: Grid) {
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

        public "tail-move-to-desktop-"(desktopIndex: number, clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, oldGrid: Grid) {
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
}
