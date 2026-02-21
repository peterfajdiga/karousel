class World {
    private readonly desktopManager: DesktopManager;
    private readonly clientManager: ClientManager;
    private readonly pinManager: PinManager;
    private readonly workspaceSignalManager: SignalManager;
    private readonly shortcutActions: ShortcutAction[];
    private readonly screenResizedDelayer: Delayer;
    private readonly cursorFollowsFocus: boolean;

    constructor(config: Config) {
        const focusPasser = new FocusPassing.Passer();
        this.workspaceSignalManager = initWorkspaceSignalHandlers(this, focusPasser);
        this.cursorFollowsFocus = config.cursorFollowsFocus;

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
                gestureScroll: config.gestureScroll,
                gestureScrollInvert: config.gestureScrollInvert,
                gestureScrollStep: config.gestureScrollStep,
            },
            layoutConfig,
            focusPasser,
            new DesktopFilter(config.tiledDesktops),
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
        for (const kwinClient of Workspace.windows) {
            this.clientManager.addClient(kwinClient);
        }
    }

    private update() {
        const currentDesktop = this.desktopManager.getCurrentDesktop();
        if (currentDesktop !== undefined) {
            currentDesktop.arrange();
            this.moveCursorToFocus();
        }
    }

    private moveCursorToFocus() {
        if (this.cursorFollowsFocus && Workspace.activeWindow !== null) {
            // Only move cursor for tiled windows
            const tiledWindow = this.clientManager.findTiledWindow(Workspace.activeWindow);
            if (tiledWindow === null) {
                return;
            }
            const cursorAlreadyInFocus = rectContainsPoint(roundQtRect(Workspace.activeWindow.frameGeometry), Workspace.cursorPos);
            if (cursorAlreadyInFocus) {
                return;
            }
            moveCursorToFocus.call();
        }
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

    public gestureScroll(amount: number) {
        this.do((clientManager, desktopManager) => {
            const currentDesktop = desktopManager.getCurrentDesktop();
            if (currentDesktop !== undefined) {
                currentDesktop.gestureScroll(amount);
            }
        });
    }

    public gestureScrollFinish() {
        this.do((clientManager, desktopManager) => {
            const focusedWindow = Workspace.activeWindow === null ? null : clientManager.findTiledWindow(Workspace.activeWindow);
            const currentDesktop = desktopManager.getCurrentDesktop();
            if (currentDesktop !== undefined) {
                console.assert(focusedWindow === null || focusedWindow.column.grid.desktop === currentDesktop);
                currentDesktop.gestureScrollFinish(focusedWindow);
            }
        });
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
