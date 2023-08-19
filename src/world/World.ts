class World {
    public readonly untileOnDrag: boolean;
    private readonly scrollViewManager: ScrollViewManager;
    public readonly clientManager: ClientManager;
    private readonly workspaceSignalManager: SignalManager;
    private readonly screenResizedDelayer: Delayer;

    constructor(config: Config) {
        this.untileOnDrag = config.untileOnDrag;
        this.workspaceSignalManager = initWorkspaceSignalHandlers(this);

        this.screenResizedDelayer = new Delayer(1000, () => {
            // this delay ensures that docks get taken into account by `workspace.clientArea`
            const gridManager = this.scrollViewManager; // workaround for bug in Qt5's JS engine
            for (const scrollView of gridManager.scrollViews()) {
                scrollView.onLayoutChanged();
            }
            this.update();
        });

        this.scrollViewManager = new ScrollViewManager(
            {
                marginTop: config.gapsOuterTop,
                marginBottom: config.gapsOuterBottom,
                marginLeft: config.gapsOuterLeft,
                marginRight: config.gapsOuterRight,
                overscroll: config.overscroll,
            },
            config,
            workspace.currentActivity,
        );
        this.clientManager = new ClientManager(config, this, this.scrollViewManager);
        this.addExistingClients();
        this.update();
    }

    private addExistingClients() {
        const kwinClients = workspace.clientList();
        for (let i = 0; i < kwinClients.length; i++) {
            const kwinClient = kwinClients[i];
            this.clientManager.addClient(kwinClient);
        }
    }

    public updateDesktops() {
        this.scrollViewManager.update();
    }

    public update() {
        this.scrollViewManager.getCurrent().arrange();
    }

    public do(f: (clientManager: ClientManager, svm: ScrollViewManager) => void) {
        f(this.clientManager, this.scrollViewManager);
        this.update();
    }

    public doIfTiled(
        kwinClient: AbstractClient,
        followTransient: boolean,
        f: (clientManager: ClientManager, svm: ScrollViewManager, window: Window, column: Column, grid: Grid) => void,
    ) {
        const window = this.clientManager.findTiledWindow(kwinClient, followTransient);
        if (window === null) {
            return;
        }
        const column = window.column;
        const grid = column.grid;
        f(this.clientManager, this.scrollViewManager, window, column, grid);
        this.update();
    }

    public doIfTiledFocused(
        followTransient: boolean,
        f: (clientManager: ClientManager, svm: ScrollViewManager, window: Window, column: Column, grid: Grid) => void,
    ) {
        this.doIfTiled(workspace.activeClient, followTransient, f);
    }

    public destroy() {
        this.workspaceSignalManager.destroy();
        this.clientManager.destroy();
        this.scrollViewManager.destroy();
    }

    public onScreenResized() {
        this.screenResizedDelayer.run();
    }
}
