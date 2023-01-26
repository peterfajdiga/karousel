function initWorkspaceSignalHandlers(world: World) {
    const manager = new SignalManager();

    manager.connect(workspace.desktopPresenceChanged, (client: AbstractClient, oldDesktop: number) => {
        world.doIfTiled(client, (window, column, oldGrid) => {
            // all desktops case handled in the client signal handler, because the workspace signal isn't fired for some reason

            const newDesktop = client.desktop;
            const newGrid = world.getGrid(newDesktop);
            if (newGrid === null) {
                throw new Error("grid does not exist");
            }
            if (oldGrid === newGrid) {
                // window already on the correct grid
                return;
            }

            const newColumn = new Column(newGrid, newGrid.getLastFocusedColumn() ?? newGrid.getLastColumn());
            window.moveToColumn(newColumn);
            oldGrid.arrange();
            newGrid.arrange();
        });
    });

    manager.connect(workspace.currentDesktopChanged, (desktop: number, client: AbstractClient) => {
        console.log("workspace currentDesktopChanged", desktop, client);
    });

    manager.connect(workspace.clientAdded, (client: AbstractClient) => {
        console.assert(!world.hasClient(client));
        if (client.dock) {
            // TODO: also detect when a dock is moved
            world.onScreenResized();
            return;
        }
        if (shouldTile(client)) {
            world.addClient(client);
        }
    });

    manager.connect(workspace.clientRemoved, (client: AbstractClient) => {
        if (client.dock) {
            world.onScreenResized();
            return;
        }
        if (world.hasClient(client)) {
            world.removeClient(client, true);
        }
        world.minimizedTiled.delete(client);
    });

    manager.connect(workspace.clientManaging, (client: X11Client) => {
        console.log("workspace clientManaging", client);
    });

    manager.connect(workspace.clientMinimized, (client: AbstractClient) => {
        if (world.hasClient(client)) {
            world.removeClient(client, true);
            world.minimizedTiled.add(client);
        }
    });

    manager.connect(workspace.clientUnminimized, (client: AbstractClient) => {
        console.assert(!world.hasClient(client));
        if (world.minimizedTiled.has(client)) {
            world.minimizedTiled.delete(client);
            world.addClient(client);
        }
    });

    manager.connect(workspace.clientRestored, (client: X11Client) => {
        console.log("workspace clientRestored", client);
    });

    manager.connect(workspace.clientMaximizeSet, (client: AbstractClient, horizontally: boolean, vertically: boolean) => {
        world.doIfTiled(client, (window, column, grid) => {
            window.onMaximizedChanged(horizontally, vertically);
            grid.arrange();
        });
    });

    manager.connect(workspace.killWindowCalled, (client: X11Client) => {
        console.log("workspace killWindowCalled", client);
    });

    manager.connect(workspace.clientActivated, (client: AbstractClient) => {
        if (client === null) {
            return;
        }
        world.onClientFocused(client);
        world.doIfTiled(client, (window, column, grid) => {
            window.onFocused();
            grid.arrange();
        });
    });

    manager.connect(workspace.clientFullScreenSet, (client: X11Client, fullScreen: boolean, user: boolean) => {
        world.doIfTiled(client, (window, column, grid) => {
            window.onFullScreenChanged(fullScreen);
            grid.arrange();
        });
    });

    manager.connect(workspace.clientSetKeepAbove, (client: X11Client, keepAbove: boolean) => {
        console.log("workspace clientSetKeepAbove", client, keepAbove);
    });

    manager.connect(workspace.numberDesktopsChanged, (oldNumberOfDesktops: number) => {
        world.updateDesktops();
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
