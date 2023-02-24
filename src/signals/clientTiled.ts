function initClientTiledSignalHandlers(world: World, window: Window) {
    const client = window.client;
    const kwinClient = client.kwinClient;
    const manager = new SignalManager();

    manager.connect(kwinClient.desktopChanged, () => {
        if (kwinClient.desktop === -1) {
            // windows on all desktops are not supported
            world.removeClient(kwinClient, false);
        }
    });

    let lastResize = false;
    manager.connect(kwinClient.moveResizedChanged, () => {
        if (kwinClient.move) {
            world.removeClient(kwinClient, false);
            return;
        }

        const grid = window.column.grid;
        const resize = kwinClient.resize;
        if (!lastResize && resize) {
            grid.onUserResizeStarted();
        }
        if (lastResize && !resize) {
            grid.onUserResizeFinished();
        }
        lastResize = resize;
    });

    manager.connect(kwinClient.frameGeometryChanged, (kwinClient: TopLevel, oldGeometry: QRect) => {
        console.assert(!kwinClient.move, "moved clients are removed in kwinClient.moveResizedChanged");
        const grid = window.column.grid;
        if (kwinClient.resize) {
            window.onUserResize(oldGeometry);
            grid.arrange();
        } else {
            const maximized = rectEqual(kwinClient.frameGeometry, grid.clientArea);
            if (!client.isManipulatingGeometry() && !kwinClient.fullScreen && !maximized) {
                window.onProgrammaticResize(oldGeometry);
                grid.arrange();
            }
        }
    });

    return manager;
}
