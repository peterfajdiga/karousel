function initWorkspaceSignalHandlers(world: World) {
    const manager = new SignalManager();

    manager.connect(Workspace.clientAdded, (kwinClient: KwinClient) => {
        if (Clients.canTileEver(kwinClient)) {
            // never open new tileable clients on all desktops or activities
            if (kwinClient.desktop <= 0) {
                kwinClient.desktop = Workspace.currentDesktop;
            }
            if (kwinClient.activities.length !== 1) {
                kwinClient.activities = [Workspace.currentActivity];
            }
        }
        world.do((clientManager, desktopManager) => {
            clientManager.addClient(kwinClient)
        });
    });

    manager.connect(Workspace.clientRemoved, (kwinClient: KwinClient) => {
        world.do((clientManager, desktopManager) => {
            clientManager.removeClient(kwinClient, true);
        });
    });

    manager.connect(Workspace.clientMinimized, (kwinClient: KwinClient) => {
        world.do((clientManager, desktopManager) => {
            clientManager.minimizeClient(kwinClient);
        });
    });

    manager.connect(Workspace.clientUnminimized, (kwinClient: KwinClient) => {
        world.do((clientManager, desktopManager) => {
            clientManager.unminimizeClient(kwinClient);
        });
    });

    manager.connect(Workspace.clientMaximizeSet, (kwinClient: KwinClient, horizontally: boolean, vertically: boolean) => {
        if ((horizontally || vertically) && kwinClient.tile !== null) {
            kwinClient.tile = null;
        }
        world.doIfTiled(kwinClient, false, (clientManager, desktopManager, window, column, grid) => {
            window.onMaximizedChanged(horizontally, vertically);
        });
    });

    manager.connect(Workspace.clientActivated, (kwinClient: KwinClient) => {
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

    manager.connect(Workspace.numberDesktopsChanged, () => {
        world.updateDesktops();
    });

    manager.connect(Workspace.virtualScreenSizeChanged, () => {
        world.onScreenResized();
    });

    return manager;
}
