function initWorkspaceSignalHandlers(world: World, focusPasser: FocusPassing.Passer) {
    const manager = new SignalManager();

    manager.connect(Workspace.windowAdded, (kwinClient: KwinClient) => {
        world.do((clientManager, desktopManager) => {
            clientManager.addClient(kwinClient);
        });
    });

    manager.connect(Workspace.windowRemoved, (kwinClient: KwinClient) => {
        world.do((clientManager, desktopManager) => {
            clientManager.removeClient(kwinClient, FocusPassing.Type.Immediate);
        });
    });

    manager.connect(Workspace.windowActivated, (kwinClient: KwinClient|null) => {
        if (kwinClient === null) {
            focusPasser.activate();
        } else {
            focusPasser.clearIfDifferent(kwinClient);
            world.do((clientManager, desktopManager) => {
                clientManager.onClientFocused(kwinClient);
            });
        }
    });

    manager.connect(Workspace.currentDesktopChanged, () => {
        world.do(() => {}); // re-arrange desktop
    });

    manager.connect(Workspace.currentActivityChanged, () => {
        world.do(() => {}); // re-arrange desktop
    });

    manager.connect(Workspace.screensChanged, () => {
        world.do((clientManager, desktopManager) => {
            // initialize new monitors
            const screenCount = (Workspace as any).screens ? (Workspace as any).screens.length : 1;
            for (let i = 0; i < screenCount; i++) {
                desktopManager.getDesktopForScreen(i, Workspace.currentActivity, Workspace.currentDesktop);
            }
        });
    });

    manager.connect(Workspace.activitiesChanged, () => {
        world.do((clientManager, desktopManager) => {
            desktopManager.updateActivities();
        });
    });

    manager.connect(Workspace.desktopsChanged, () => {
        world.do((clientManager, desktopManager) => {
            desktopManager.updateDesktops();
        });
    });

    manager.connect(Workspace.virtualScreenSizeChanged, () => {
        world.onScreenResized();
    });

    return manager;
}
