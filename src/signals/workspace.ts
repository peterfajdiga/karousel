function initWorkspaceSignalHandlers(world: World) {
    const manager = new SignalManager();

    manager.connect(workspace.desktopPresenceChanged, (client: AbstractClient, oldDesktop: number) => {
        world.doIfTiled(client.windowId, (window, column, grid) => {
            // all desktops case handled in the client signal handler, because the workspace signal isn't fired for some reason

            const newDesktop = client.desktop;
            const oldGrid = world.getGrid(oldDesktop);
            const newGrid = world.getGrid(newDesktop);

            const newColumn = new Column(newGrid, newGrid.getLastColumn());
            window.moveToColumn(newColumn);
            oldGrid.arrange();
            newGrid.arrange();
        });
    });

    manager.connect(workspace.currentDesktopChanged, (desktop: number, client: AbstractClient) => {
        console.log("workspace currentDesktopChanged", desktop, client);
    });

    manager.connect(workspace.clientAdded, (client: AbstractClient) => {
        const id = client.windowId;
        console.assert(!world.hasClient(id));
        if (shouldTile(client)) {
            world.addClient(id, client);
        }
    });

    manager.connect(workspace.clientRemoved, (client: AbstractClient) => {
        const id = client.windowId;
        if (world.hasClient(id)) {
            world.removeClient(id);
        }
        world.minimizedTiled.delete(id);
    });

    manager.connect(workspace.clientManaging, (client: X11Client) => {
        console.log("workspace clientManaging", client);
    });

    manager.connect(workspace.clientMinimized, (client: AbstractClient) => {
        const id = client.windowId;
        if (world.hasClient(id)) {
            world.removeClient(id);
            world.minimizedTiled.add(id);
        }
    });

    manager.connect(workspace.clientUnminimized, (client: AbstractClient) => {
        const id = client.windowId;
        console.assert(!world.hasClient(id));
        if (world.minimizedTiled.has(id)) {
            world.minimizedTiled.delete(id);
            world.addClient(id, client);
        }
    });

    manager.connect(workspace.clientRestored, (client: X11Client) => {
        console.log("workspace clientRestored", client);
    });

    manager.connect(workspace.clientMaximizeSet, (client: AbstractClient, horizontal: boolean, vertical: boolean) => {
        world.doIfTiled(client.windowId, (window, column, grid) => {
            const maximized = horizontal || vertical;
            window.skipArrange = maximized;
            client.keepBelow = !maximized;
        });
    });

    manager.connect(workspace.killWindowCalled, (client: X11Client) => {
        console.log("workspace killWindowCalled", client);
    });

    manager.connect(workspace.clientActivated, (client: AbstractClient) => {
        if (client === null) {
            return;
        }
        world.doIfTiled(client.windowId, (window, column, grid) => {
            grid.scrollToColumn(column);
            grid.arrange();
        });
    });

    manager.connect(workspace.clientFullScreenSet, (client: X11Client, fullScreen: boolean, user: boolean) => {
        world.doIfTiled(client.windowId, (window, column, grid) => {
            window.skipArrange = fullScreen;
            client.keepBelow = !fullScreen;
        });
    });

    manager.connect(workspace.clientSetKeepAbove, (client: X11Client, keepAbove: boolean) => {
        console.log("workspace clientSetKeepAbove", client, keepAbove);
    });

    manager.connect(workspace.numberDesktopsChanged, (oldNumberOfDesktops: number) => {
        console.log("workspace numberDesktopsChanged", oldNumberOfDesktops);
    });

    manager.connect(workspace.desktopLayoutChanged, () => {
        console.log("workspace desktopLayoutChanged");
    });

    manager.connect(workspace.clientDemandsAttentionChanged, (client: AbstractClient, set: boolean) => {
        console.log("workspace clientDemandsAttentionChanged", client, set);
    });

    manager.connect(workspace.numberScreensChanged, (count: number) => {
        console.log("workspace numberScreensChanged", count);
    });

    manager.connect(workspace.currentActivityChanged, (id: string) => {
        console.log("workspace currentActivityChanged", id);
    });

    manager.connect(workspace.activitiesChanged, (id: string) => {
        console.log("workspace activitiesChanged", id);
    });

    manager.connect(workspace.activityAdded, (id: string) => {
        console.log("workspace activityAdded", id);
    });

    manager.connect(workspace.activityRemoved, (id: string) => {
        console.log("workspace activityRemoved", id);
    });

    manager.connect(workspace.virtualScreenSizeChanged, () => {
        world.onScreenResized();
    });

    return manager;
}
