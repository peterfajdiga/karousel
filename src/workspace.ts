function initWorkspaceSignalHandlers(world: World) {
    const manager = new SignalManager();

    manager.connect(workspace.clientAdded, (kwinClient: KwinClient) => {
        if (Clients.canTileEver(kwinClient)) {
            // never open new tileable clients on all desktops or activities
            if (kwinClient.desktop <= 0) {
                kwinClient.desktop = workspace.currentDesktop;
            }
            if (kwinClient.activities.length !== 1) {
                kwinClient.activities = [workspace.currentActivity];
            }
        }
        world.do((clientManager, desktopManager) => {
            clientManager.addClient(kwinClient)
        });
    });

    manager.connect(workspace.clientRemoved, (kwinClient: KwinClient) => {
        world.do((clientManager, desktopManager) => {
            clientManager.removeClient(kwinClient, true);
        });
    });

    manager.connect(workspace.clientMinimized, (kwinClient: KwinClient) => {
        world.do((clientManager, desktopManager) => {
            clientManager.minimizeClient(kwinClient);
        });
    });

    manager.connect(workspace.clientUnminimized, (kwinClient: KwinClient) => {
        world.do((clientManager, desktopManager) => {
            clientManager.unminimizeClient(kwinClient);
        });
    });

    manager.connect(workspace.clientMaximizeSet, (kwinClient: KwinClient, horizontally: boolean, vertically: boolean) => {
        if ((horizontally || vertically) && kwinClient.tile !== null) {
            kwinClient.tile = null;
        }
        world.doIfTiled(kwinClient, false, (clientManager, desktopManager, window, column, grid) => {
            window.onMaximizedChanged(horizontally, vertically);
        });
    });

    manager.connect(workspace.clientActivated, (kwinClient: KwinClient) => {
        if (kwinClient === null) {
            return;
        }
        world.do((clientManager, desktopManager) => {
            clientManager.onClientFocused(kwinClient);
        });
    });

    manager.connect(workspace.currentDesktopChanged, () => {
        world.do(() => {}); // re-arrange desktop
    });

    manager.connect(workspace.currentActivityChanged, () => {
        world.do(() => {}); // re-arrange desktop
    });

    manager.connect(workspace.numberDesktopsChanged, (oldNumberOfVirtualDesktops: number) => {
        world.updateDesktops();
    });

    manager.connect(workspace.virtualScreenSizeChanged, () => {
        world.onScreenResized();
    });

    return manager;
}
