function initClientSignalHandlers(world: World, window: Window) {
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
        const column = window.column;
        const grid = column.grid;
        const newGeometry = kwinClient.frameGeometry;

        if (kwinClient.resize) {
            const widthDelta = newGeometry.width - oldGeometry.width;
            const heightDelta = newGeometry.height - oldGeometry.height;
            if (widthDelta !== 0) {
                column.adjustWidth(widthDelta, true);
                if (newGeometry.x !== oldGeometry.x) {
                    grid.adjustScroll(widthDelta, true);
                }
            }
            if (heightDelta !== 0) {
                column.adjustWindowHeight(window, heightDelta, newGeometry.y !== oldGeometry.y);
            }
            if (widthDelta !== 0 || heightDelta !== 0) {
                grid.arrange();
            }
            return;
        }

        if (kwinClient.move) {
            return;
        }

        if (!client.isManipulatingGeometry()) {
            column.setWidth(newGeometry.width, true);
            grid.arrange();
        }
    });

    return manager;
}
