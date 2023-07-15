class ClientStateTiled {
    readonly window: Window;
    private readonly signalManager: SignalManager;

    constructor(world: World, client: ClientWrapper) {
        client.prepareForTiling();

        const grid = world.getClientGrid(client.kwinClient);
        const column = new Column(grid, grid.getLastFocusedColumn() ?? grid.getLastColumn());
        const window = new Window(client, column);
        grid.container.arrange();

        this.window = window;
        this.signalManager = ClientStateTiled.initSignalManager(world, window);
    }

    destroy(passFocus: boolean) {
        this.signalManager.destroy();

        const window = this.window;
        const grid = window.column.grid;
        const clientWrapper = window.client;
        window.destroy(passFocus);
        grid.container.arrange();

        clientWrapper.prepareForFloating(grid.container.clientArea);
    }

    static initSignalManager(world: World, window: Window) {
        const client = window.client;
        const kwinClient = client.kwinClient;
        const manager = new SignalManager();

        manager.connect(kwinClient.desktopChanged, () => {
            if (kwinClient.desktop === -1) {
                // windows on all desktops are not supported
                world.untileClient(kwinClient);
                return;
            }
            ClientStateTiled.moveWindowToCorrectGrid(world, window);
        });

        manager.connect(kwinClient.activitiesChanged, (kwinClient: AbstractClient) => {
            if (kwinClient.activities.length !== 1) {
                // windows on multiple activities are not supported
                world.untileClient(kwinClient);
                return;
            }
            ClientStateTiled.moveWindowToCorrectGrid(world, window);
        })

        let lastResize = false;
        manager.connect(kwinClient.moveResizedChanged, () => {
            if (world.untileOnDrag && kwinClient.move) {
                world.untileClient(kwinClient);
                return;
            }

            const grid = window.column.grid;
            const resize = kwinClient.resize;
            if (!lastResize && resize) {
                grid.onUserResizeStarted();
            }
            if (lastResize && !resize) {
                grid.onUserResizeFinished();
            }
            lastResize = resize;
        });

        let cursorChangedAfterResizeStart = false;
        manager.connect(kwinClient.moveResizeCursorChanged, () => {
            cursorChangedAfterResizeStart = true;
        });
        manager.connect(kwinClient.clientStartUserMovedResized, () => {
            cursorChangedAfterResizeStart = false;
        });

        manager.connect(kwinClient.frameGeometryChanged, (kwinClient: TopLevel, oldGeometry: QRect) => {
            const scrollView = window.column.grid.container;
            if (kwinClient.resize) {
                window.onUserResize(oldGeometry, !cursorChangedAfterResizeStart);
                scrollView.arrange();
            } else {
                const maximized = rectEqual(kwinClient.frameGeometry, scrollView.clientArea);
                if (!client.isManipulatingGeometry() && !kwinClient.fullScreen && !maximized) {
                    window.onProgrammaticResize(oldGeometry);
                    scrollView.arrange();
                }
            }
        });

        return manager;
    }

    static moveWindowToCorrectGrid(world: World, window: Window) {
        const kwinClient = window.client.kwinClient;

        const oldGrid = window.column.grid;
        const newGrid = world.getClientGrid(kwinClient);
        if (oldGrid === newGrid) {
            // window already on the correct grid
            return;
        }

        const newColumn = new Column(newGrid, newGrid.getLastFocusedColumn() ?? newGrid.getLastColumn());
        window.moveToColumn(newColumn);
        oldGrid.container.arrange();
        newGrid.container.arrange();
    }
}
