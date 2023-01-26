function initClientSignalHandlers(world: World, window: Window) {
    const client = window.client;
    const manager = new SignalManager();

    manager.connect(client.desktopChanged, () => {
        if (window.client.desktop === -1) {
            // windows on all desktops are not supported
            world.removeClient(window.client, false);
        }
    });

    let lastResize = false;
    manager.connect(client.moveResizedChanged, () => {
        const client = window.client;
        if (client.move) {
            world.removeClient(client, false);
            return;
        }

        const grid = window.column.grid;
        const resize = client.resize;
        if (!lastResize && resize) {
            grid.onUserResizeStarted();
        }
        if (lastResize && !resize) {
            grid.onUserResizeFinished();
        }
        lastResize = resize;
    });

    manager.connect(client.frameGeometryChanged, (client: TopLevel, oldGeometry: QRect) => {
        if (client.resize) {
            const newGeometry = client.frameGeometry;
            const column = window.column;
            const grid = column.grid;

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
        }
    });

    return manager;
}
