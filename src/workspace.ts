function initWorkspaceSignalHandlers(world: World) {
    const manager = new SignalManager();

    manager.connect(workspace.clientAdded, (kwinClient: AbstractClient) => {
        if (Clients.canTileEver(kwinClient)) {
            // never open new tileable clients on all desktops or activities
            if (kwinClient.desktop <= 0) {
                kwinClient.desktop = workspace.currentDesktop;
            }
            if (kwinClient.activities.length !== 1) {
                kwinClient.activities = [workspace.currentActivity];
            }
        }
        world.do((clientManager, svm) => {
            clientManager.addClient(kwinClient)
        });
    });

    manager.connect(workspace.clientRemoved, (kwinClient: AbstractClient) => {
        world.do((clientManager, svm) => {
            clientManager.removeClient(kwinClient, true);
        });
    });

    manager.connect(workspace.clientMinimized, (kwinClient: AbstractClient) => {
        world.do((clientManager, svm) => {
            clientManager.minimizeClient(kwinClient);
        });
    });

    manager.connect(workspace.clientUnminimized, (kwinClient: AbstractClient) => {
        world.do((clientManager, svm) => {
            clientManager.unminimizeClient(kwinClient);
        });
    });

    manager.connect(workspace.clientMaximizeSet, (kwinClient: AbstractClient, horizontally: boolean, vertically: boolean) => {
        world.doIfTiled(kwinClient, false, (world, svm, window, column, grid) => {
            window.onMaximizedChanged(horizontally, vertically);
        });
    });

    manager.connect(workspace.clientActivated, (kwinClient: AbstractClient) => {
        if (kwinClient === null) {
            return;
        }
        world.do((clientManager, svm) => {
            clientManager.onClientFocused(kwinClient);
        });
    });

    manager.connect(workspace.clientFullScreenSet, (kwinClient: X11Client, fullScreen: boolean, user: boolean) => {
        world.doIfTiled(kwinClient, false, (clientManager, svm, window, column, grid) => {
            window.onFullScreenChanged(fullScreen);
        });
    });

    manager.connect(workspace.numberDesktopsChanged, (oldNumberOfDesktops: number) => {
        world.updateDesktops();
    });

    manager.connect(workspace.virtualScreenSizeChanged, () => {
        world.onScreenResized();
    });

    return manager;
}
