namespace Actions {
    export class NumActions {
        constructor(private readonly world: World) {}

        public getNumAction(name: string) {
            switch (name) {
                case "focus-": return (columnIndex: number) => {
                    this.world.do((clientManager, desktopManager) => {
                        const grid = desktopManager.getCurrentDesktop().grid;
                        const targetColumn = grid.getColumnAtIndex(columnIndex);
                        if (targetColumn === null) {
                            return;
                        }
                        targetColumn.focus();
                    });
                };

                case "window-move-to-column-": return (columnIndex: number) => {
                    this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                        const targetColumn = grid.getColumnAtIndex(columnIndex);
                        if (targetColumn === null) {
                            return;
                        }
                        window.moveToColumn(targetColumn);
                        grid.desktop.autoAdjustScroll();
                    });
                };

                case "column-move-to-column-": return (columnIndex: number) => {
                    this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, grid) => {
                        const targetColumn = grid.getColumnAtIndex(columnIndex);
                        if (targetColumn === null || targetColumn === column) {
                            return;
                        }
                        if (targetColumn.isToTheRightOf(column)) {
                            grid.moveColumn(column, targetColumn);
                        } else {
                            grid.moveColumn(column, grid.getPrevColumn(targetColumn));
                        }
                    });
                };

                case "column-move-to-desktop-": return (desktopIndex: number) => {
                    this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, oldGrid) => {
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

                case "tail-move-to-desktop-": return (desktopIndex: number) => {
                    this.world.doIfTiledFocused(true, (clientManager, desktopManager, window, column, oldGrid) => {
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

                default: throw new Error("unknown num action: " + name);
            }
        }
    }
}
