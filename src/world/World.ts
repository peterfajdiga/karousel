class World {
    public readonly untileOnDrag: boolean;
    private readonly desktopManager: DesktopManager;
    public readonly clientManager: ClientManager;
    private readonly pinManager: PinManager;
    private readonly workspaceSignalManager: SignalManager;
    private readonly screenResizedDelayer: Delayer;

    constructor(config: Config) {
        this.untileOnDrag = config.untileOnDrag;
        this.workspaceSignalManager = initWorkspaceSignalHandlers(this);

        this.screenResizedDelayer = new Delayer(1000, () => {
            // this delay ensures that docks get taken into account by `workspace.clientArea`
            const desktopManager = this.desktopManager; // workaround for bug in Qt5's JS engine
            for (const desktop of desktopManager.desktops()) {
                desktop.onLayoutChanged();
            }
            this.update();
        });

        this.pinManager = new PinManager();

        this.desktopManager = new DesktopManager(
            this.pinManager,
            {
                marginTop: config.gapsOuterTop,
                marginBottom: config.gapsOuterBottom,
                marginLeft: config.gapsOuterLeft,
                marginRight: config.gapsOuterRight,
                overscroll: config.overscroll,
                scroller: config.scrollingLazy ? new ScrollerLazy() :
                    config.scrollingCentered ? new ScrollerCentered() :
                    console.assert(false),
            },
            {
                gapsInnerHorizontal: config.gapsInnerHorizontal,
                gapsInnerVertical: config.gapsInnerVertical,
                stackColumnsByDefault: config.stackColumnsByDefault,
                resizeNeighborColumn: config.resizeNeighborColumn,
                reMaximize: config.reMaximize,
                skipSwitcher: config.skipSwitcher,
                tiledKeepBelow: config.tiledKeepBelow,
                maximizedKeepAbove: config.floatingKeepAbove,
            },
            workspace.currentActivity,
        );
        this.clientManager = new ClientManager(config, this, this.desktopManager, this.pinManager);
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
        this.desktopManager.update();
    }

    private update() {
        this.desktopManager.getCurrentDesktop().arrange();
    }

    public do(f: (clientManager: ClientManager, desktopManager: DesktopManager) => void) {
        f(this.clientManager, this.desktopManager);
        this.update();
    }

    public doIfTiled(
        kwinClient: KwinClient,
        followTransient: boolean,
        f: (clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) => void,
    ) {
        const window = this.clientManager.findTiledWindow(kwinClient, followTransient);
        if (window === null) {
            return;
        }
        const column = window.column;
        const grid = column.grid;
        f(this.clientManager, this.desktopManager, window, column, grid);
        this.update();
    }

    public doIfTiledFocused(
        followTransient: boolean,
        f: (clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) => void,
    ) {
        this.doIfTiled(workspace.activeClient, followTransient, f);
    }

    public destroy() {
        this.workspaceSignalManager.destroy();
        this.clientManager.destroy();
        this.desktopManager.destroy();
    }

    public onScreenResized() {
        this.screenResizedDelayer.run();
    }
}
