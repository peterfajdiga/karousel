class World {
    public readonly untileOnDrag: boolean;
    private readonly desktopManager: DesktopManager;
    public readonly clientManager: ClientManager;
    private readonly pinManager: PinManager;
    private readonly workspaceSignalManager: SignalManager;
    private readonly shortcutActions: ShortcutAction[];
    private readonly screenResizedDelayer: Delayer;

    constructor(config: Config) {
        this.untileOnDrag = config.untileOnDrag;
        this.workspaceSignalManager = initWorkspaceSignalHandlers(this);
        this.shortcutActions = registerKeyBindings(this, {
            manualScrollStep: config.manualScrollStep,
            manualResizeStep: config.manualResizeStep,
            columnResizer: config.scrollingCentered ? new RawResizer() : new ContextualResizer(),
        });

        this.screenResizedDelayer = new Delayer(1000, () => {
            // this delay ensures that docks are taken into account by `Workspace.clientArea`
            const desktopManager = this.desktopManager; // workaround for bug in Qt5's JS engine
            for (const desktop of desktopManager.getAllDesktops()) {
                desktop.onLayoutChanged();
            }
            this.update();
        });

        this.pinManager = new PinManager();

        const layoutConfig = {
            gapsInnerHorizontal: config.gapsInnerHorizontal,
            gapsInnerVertical: config.gapsInnerVertical,
            offScreenOpacity: config.offScreenOpacity / 100.0,
            stackColumnsByDefault: config.stackColumnsByDefault,
            resizeNeighborColumn: config.resizeNeighborColumn,
            reMaximize: config.reMaximize,
            skipSwitcher: config.skipSwitcher,
            tiledKeepBelow: config.tiledKeepBelow,
            maximizedKeepAbove: config.floatingKeepAbove,
        };

        this.desktopManager = new DesktopManager(
            this.pinManager,
            {
                marginTop: config.gapsOuterTop,
                marginBottom: config.gapsOuterBottom,
                marginLeft: config.gapsOuterLeft,
                marginRight: config.gapsOuterRight,
                scroller: config.scrollingLazy ? new LazyScroller() :
                    config.scrollingCentered ? new CenteredScroller() :
                    config.scrollingGrouped ? new GroupedScroller() :
                    console.assert(false),
                clamper: config.scrollingLazy ? new EdgeClamper() : new CenterClamper(),
            },
            layoutConfig,
            Workspace.currentActivity,
            Workspace.currentDesktop,
        );
        this.clientManager = new ClientManager(config, this, this.desktopManager, this.pinManager);
        this.addExistingClients();
        this.update();
    }

    private addExistingClients() {
        const kwinClients = Workspace.windows;
        for (let i = 0; i < kwinClients.length; i++) {
            const kwinClient = kwinClients[i];
            this.clientManager.addClient(kwinClient);
        }
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
        this.doIfTiled(Workspace.activeWindow, followTransient, f);
    }

    public destroy() {
        this.workspaceSignalManager.destroy();
        for (const shortcutAction of this.shortcutActions) {
            shortcutAction.destroy();
        }
        this.clientManager.destroy();
        this.desktopManager.destroy();
    }

    public onScreenResized() {
        this.screenResizedDelayer.run();
    }
}
