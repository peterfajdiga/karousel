function initWorkspaceSignalHandlers(world: World) {
    const manager = new SignalManager();

    manager.connect(Workspace.windowAdded, (kwinClient: KwinClient) => {
        if (Clients.canTileEver(kwinClient)) {
            // never open new tileable clients on all desktops or activities
            // TODO: use makeTileable?
            if (kwinClient.desktops.length !== 1) {
                kwinClient.desktops = [Workspace.currentDesktop];
            }
            if (kwinClient.activities.length !== 1) {
                kwinClient.activities = [Workspace.currentActivity];
            }
        }
        world.do((clientManager, desktopManager) => {
            clientManager.addClient(kwinClient)
        });
    });

    manager.connect(Workspace.windowRemoved, (kwinClient: KwinClient) => {
        world.do((clientManager, desktopManager) => {
            clientManager.removeClient(kwinClient, true);
        });
    });

    manager.connect(Workspace.windowActivated, (kwinClient: KwinClient) => {
        if (kwinClient === null) {
            return;
        }
        world.do((clientManager, desktopManager) => {
            clientManager.onClientFocused(kwinClient);
        });
    });

    manager.connect(Workspace.currentDesktopChanged, () => {
        world.do(() => {}); // re-arrange desktop
    });

    manager.connect(Workspace.currentActivityChanged, () => {
        world.do(() => {}); // re-arrange desktop
    });

    manager.connect(Workspace.desktopsChanged, () => {
        // TODO: Remove desktops from DesktopManager
    });

    manager.connect(Workspace.activitiesChanged, () => {
        // TODO: Remove desktops from DesktopManager
    });

    manager.connect(Workspace.virtualScreenSizeChanged, () => {
        world.onScreenResized();
    });

    return manager;
}
