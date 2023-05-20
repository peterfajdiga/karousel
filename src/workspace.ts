function initWorkspaceSignalHandlers(world: World) {
    const manager = new SignalManager();

    manager.connect(workspace.clientAdded, (kwinClient: AbstractClient) => {
        console.assert(!world.hasClient(kwinClient));
        world.addClient(kwinClient);
    });

    manager.connect(workspace.clientRemoved, (kwinClient: AbstractClient) => {
        console.assert(world.hasClient(kwinClient));
        world.removeClient(kwinClient, true);
    });

    manager.connect(workspace.clientMinimized, (kwinClient: AbstractClient) => {
        world.minimizeClient(kwinClient);
    });

    manager.connect(workspace.clientUnminimized, (kwinClient: AbstractClient) => {
        world.unminimizeClient(kwinClient);
    });

    manager.connect(workspace.clientMaximizeSet, (kwinClient: AbstractClient, horizontally: boolean, vertically: boolean) => {
        world.doIfTiled(kwinClient, (window, column, grid) => {
            window.onMaximizedChanged(horizontally, vertically);
            grid.arrange();
        });
    });

    manager.connect(workspace.clientActivated, (kwinClient: AbstractClient) => {
        if (kwinClient === null) {
            return;
        }
        world.onClientFocused(kwinClient);
        world.doIfTiled(kwinClient, (window, column, grid) => {
            window.onFocused();
            grid.arrange();
        });
    });

    manager.connect(workspace.clientFullScreenSet, (kwinClient: X11Client, fullScreen: boolean, user: boolean) => {
        world.doIfTiled(kwinClient, (window, column, grid) => {
            window.onFullScreenChanged(fullScreen);
            grid.arrange();
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
