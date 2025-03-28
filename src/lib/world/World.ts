class World {
    private readonly desktopManager: DesktopManager;
    private readonly clientManager: ClientManager;
    private readonly pinManager: PinManager;
    private readonly workspaceSignalManager: SignalManager;
    private readonly shortcutActions: ShortcutAction[];
    private readonly screenResizedDelayer: Delayer;

    constructor(config: Config) {
        this.workspaceSignalManager = initWorkspaceSignalHandlers(this);

        let presetWidths = {
            next: (currentWidth: number, minWidth: number, maxWidth: number) => currentWidth,
            prev: (currentWidth: number, minWidth: number, maxWidth: number) => currentWidth,
            getWidths: (minWidth: number, maxWidth: number): number[] => [],
        };
        try {
            presetWidths = new PresetWidths(config.presetWidths, config.gapsInnerHorizontal);
        } catch (error: any) {
            notificationInvalidPresetWidths.sendEvent();
            log("failed to parse presetWidths:", error);
        }

        this.shortcutActions = registerKeyBindings(this, {
            manualScrollStep: config.manualScrollStep,
            presetWidths: presetWidths,
            columnResizer: config.scrollingCentered ? new RawResizer(presetWidths) : new ContextualResizer(presetWidths),
        });

        this.screenResizedDelayer = new Delayer(1000, () => {
            // this delay ensures that docks are taken into account by `Workspace.clientArea`
            for (const desktop of this.desktopManager.getAllDesktops()) {
                desktop.onLayoutChanged();
            }
            this.update();
        });

        this.pinManager = new PinManager();

        const layoutConfig = {
            gapsInnerHorizontal: config.gapsInnerHorizontal,
            gapsInnerVertical: config.gapsInnerVertical,
            stackOffsetX: config.stackOffsetX,
            stackOffsetY: config.stackOffsetY,
            offScreenOpacity: config.offScreenOpacity / 100.0,
            stackColumnsByDefault: config.stackColumnsByDefault,
            resizeNeighborColumn: config.resizeNeighborColumn,
            reMaximize: config.reMaximize,
            skipSwitcher: config.skipSwitcher,
            tiledKeepBelow: config.tiledKeepBelow,
            maximizedKeepAbove: config.floatingKeepAbove,
            untileOnDrag: config.untileOnDrag,
        };

        this.desktopManager = new DesktopManager(
            this.pinManager,
            {
                marginTop: config.gapsOuterTop,
                marginBottom: config.gapsOuterBottom,
                marginLeft: config.gapsOuterLeft,
                marginRight: config.gapsOuterRight,
                scroller: World.createScroller(config),
                clamper: config.scrollingLazy ? new EdgeClamper() : new CenterClamper(),
                naturalScrolling: config.naturalScrolling,
            },
            layoutConfig,
            Workspace.currentActivity,
            Workspace.currentDesktop,
        );
        this.clientManager = new ClientManager(config, this, this.desktopManager, this.pinManager);
        this.addExistingClients();
        this.update();
    }

    private static createScroller(config: Config) {
        if (config.scrollingLazy) {
            return new LazyScroller();
        } else if (config.scrollingCentered) {
            return new CenteredScroller();
        } else if (config.scrollingGrouped) {
            return new GroupedScroller();
        } else {
            log("No scrolling mode selected, using default");
            return new LazyScroller();
        }
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

    public doGesture(progress: number) {
        this.desktopManager.getCurrentDesktop().gestureScroll(progress);
    }

    public finishGesture() {
        this.desktopManager.getCurrentDesktop().finishGesture();
    }

    public do(f: (clientManager: ClientManager, desktopManager: DesktopManager) => void) {
        f(this.clientManager, this.desktopManager);
        this.update();
    }

    public doIfTiled(
        kwinClient: KwinClient,
        f: (clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) => void,
    ) {
        const window = this.clientManager.findTiledWindow(kwinClient);
        if (window === null) {
            return;
        }
        const column = window.column;
        const grid = column.grid;
        f(this.clientManager, this.desktopManager, window, column, grid);
        this.update();
    }

    public doIfTiledFocused(
        f: (clientManager: ClientManager, desktopManager: DesktopManager, window: Window, column: Column, grid: Grid) => void,
    ) {
        if (Workspace.activeWindow === null) {
            return;
        }
        this.doIfTiled(Workspace.activeWindow, f);
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
