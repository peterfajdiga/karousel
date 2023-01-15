const workspaceSignalHandlers = {
    desktopPresenceChanged: (client: AbstractClient, oldDesktop: number) => {
        doIfTiled(client.windowId, (window, column, grid) => {
            // all desktops case handled in the client signal handler, because the workspace signal isn't fired for some reason

            const newDesktop = client.desktop;
            const oldGrid = world.getGrid(oldDesktop);
            const newGrid = world.getGrid(newDesktop);

            column.removeWindow(window);
            oldGrid.arrange();

            const newColumn = new Column();
            newGrid.addColumn(newColumn);
            newColumn.addWindow(window);
            newGrid.arrange();
        });
    },

    currentDesktopChanged: (desktop: number, client: AbstractClient) => {
        console.log("workspace currentDesktopChanged", desktop, client);
    },

    clientAdded: (client: AbstractClient) => {
        const id = client.windowId;
        console.assert(!world.clientMap.has(id));
        if (shouldTile(client)) {
            world.addClient(id, client);
        }
    },

    clientRemoved: (client: AbstractClient) => {
        const id = client.windowId;
        if (world.clientMap.has(id)) {
            world.removeClient(id);
        }
    },

    clientManaging: (client: X11Client) => {
        console.log("workspace clientManaging", client);
    },

    clientMinimized: (client: AbstractClient) => {
        const id = client.windowId;
        if (world.clientMap.has(id)) {
            world.removeClient(id);
            world.minimizedTiled.add(id);
        }
    },

    clientUnminimized: (client: AbstractClient) => {
        const id = client.windowId;
        console.assert(!world.clientMap.has(id));
        if (world.minimizedTiled.has(id)) {
            world.minimizedTiled.delete(id);
            world.addClient(id, client);
        }
    },

    clientRestored: (client: X11Client) => {
        console.log("workspace clientRestored", client);
    },

    clientMaximizeSet: (client: AbstractClient, horizontal: boolean, vertical: boolean) => {
        doIfTiled(client.windowId, (window, column, grid) => {
            const maximized = horizontal || vertical;
            window.skipArrange = maximized;
            client.keepBelow = !maximized;
        });
    },

    killWindowCalled: (client: X11Client) => {
        console.log("workspace killWindowCalled", client);
    },

    clientActivated: (client: AbstractClient) => {
        if (client === null) {
            return;
        }
        doIfTiled(client.windowId, (window, column, grid) => {
            grid.scrollToColumn(column);
            grid.arrange();
        });
    },

    clientFullScreenSet: (client: X11Client, fullScreen: boolean, user: boolean) => {
        doIfTiled(client.windowId, (window, column, grid) => {
            window.skipArrange = fullScreen;
            client.keepBelow = !fullScreen;
        });
    },

    clientSetKeepAbove: (client: X11Client, keepAbove: boolean) => {
        console.log("workspace clientSetKeepAbove", client, keepAbove);
    },

    numberDesktopsChanged: (oldNumberOfDesktops: number) => {
        console.log("workspace numberDesktopsChanged", oldNumberOfDesktops);
    },

    desktopLayoutChanged: () => {
        console.log("workspace desktopLayoutChanged");
    },

    clientDemandsAttentionChanged: (client: AbstractClient, set: boolean) => {
        console.log("workspace clientDemandsAttentionChanged", client, set);
    },

    numberScreensChanged: (count: number) => {
        console.log("workspace numberScreensChanged", count);
    },

    screenResized: (screen: number) => {
        console.log("workspace screenResized", screen);
    },

    currentActivityChanged: (id: string) => {
        console.log("workspace currentActivityChanged", id);
    },

    activitiesChanged: (id: string) => {
        console.log("workspace activitiesChanged", id);
    },

    activityAdded: (id: string) => {
        console.log("workspace activityAdded", id);
    },

    activityRemoved: (id: string) => {
        console.log("workspace activityRemoved", id);
    },

    virtualScreenSizeChanged: () => {
        console.log("workspace virtualScreenSizeChanged");
    },

    virtualScreenGeometryChanged: () => {
        console.log("workspace virtualScreenGeometryChanged");
    },
};

function connectToWorkspaceSignals() {
    workspace.desktopPresenceChanged.connect(workspaceSignalHandlers.desktopPresenceChanged);
    workspace.currentDesktopChanged.connect(workspaceSignalHandlers.currentDesktopChanged);
    workspace.clientAdded.connect(workspaceSignalHandlers.clientAdded);
    workspace.clientRemoved.connect(workspaceSignalHandlers.clientRemoved);
    workspace.clientManaging.connect(workspaceSignalHandlers.clientManaging);
    workspace.clientMinimized.connect(workspaceSignalHandlers.clientMinimized);
    workspace.clientUnminimized.connect(workspaceSignalHandlers.clientUnminimized);
    workspace.clientRestored.connect(workspaceSignalHandlers.clientRestored);
    workspace.clientMaximizeSet.connect(workspaceSignalHandlers.clientMaximizeSet);
    workspace.killWindowCalled.connect(workspaceSignalHandlers.killWindowCalled);
    workspace.clientActivated.connect(workspaceSignalHandlers.clientActivated);
    workspace.clientFullScreenSet.connect(workspaceSignalHandlers.clientFullScreenSet);
    workspace.clientSetKeepAbove.connect(workspaceSignalHandlers.clientSetKeepAbove);
    workspace.numberDesktopsChanged.connect(workspaceSignalHandlers.numberDesktopsChanged);
    workspace.desktopLayoutChanged.connect(workspaceSignalHandlers.desktopLayoutChanged);
    workspace.clientDemandsAttentionChanged.connect(workspaceSignalHandlers.clientDemandsAttentionChanged);
    workspace.numberScreensChanged.connect(workspaceSignalHandlers.numberScreensChanged);
    workspace.screenResized.connect(workspaceSignalHandlers.screenResized);
    workspace.currentActivityChanged.connect(workspaceSignalHandlers.currentActivityChanged);
    workspace.activitiesChanged.connect(workspaceSignalHandlers.activitiesChanged);
    workspace.activityAdded.connect(workspaceSignalHandlers.activityAdded);
    workspace.activityRemoved.connect(workspaceSignalHandlers.activityRemoved);
    workspace.virtualScreenSizeChanged.connect(workspaceSignalHandlers.virtualScreenSizeChanged);
    workspace.virtualScreenGeometryChanged.connect(workspaceSignalHandlers.virtualScreenGeometryChanged);
}

function disconnectFromWorkspaceSignals() {
    workspace.desktopPresenceChanged.disconnect(workspaceSignalHandlers.desktopPresenceChanged);
    workspace.currentDesktopChanged.disconnect(workspaceSignalHandlers.currentDesktopChanged);
    workspace.clientAdded.disconnect(workspaceSignalHandlers.clientAdded);
    workspace.clientRemoved.disconnect(workspaceSignalHandlers.clientRemoved);
    workspace.clientManaging.disconnect(workspaceSignalHandlers.clientManaging);
    workspace.clientMinimized.disconnect(workspaceSignalHandlers.clientMinimized);
    workspace.clientUnminimized.disconnect(workspaceSignalHandlers.clientUnminimized);
    workspace.clientRestored.disconnect(workspaceSignalHandlers.clientRestored);
    workspace.clientMaximizeSet.disconnect(workspaceSignalHandlers.clientMaximizeSet);
    workspace.killWindowCalled.disconnect(workspaceSignalHandlers.killWindowCalled);
    workspace.clientActivated.disconnect(workspaceSignalHandlers.clientActivated);
    workspace.clientFullScreenSet.disconnect(workspaceSignalHandlers.clientFullScreenSet);
    workspace.clientSetKeepAbove.disconnect(workspaceSignalHandlers.clientSetKeepAbove);
    workspace.numberDesktopsChanged.disconnect(workspaceSignalHandlers.numberDesktopsChanged);
    workspace.desktopLayoutChanged.disconnect(workspaceSignalHandlers.desktopLayoutChanged);
    workspace.clientDemandsAttentionChanged.disconnect(workspaceSignalHandlers.clientDemandsAttentionChanged);
    workspace.numberScreensChanged.disconnect(workspaceSignalHandlers.numberScreensChanged);
    workspace.screenResized.disconnect(workspaceSignalHandlers.screenResized);
    workspace.currentActivityChanged.disconnect(workspaceSignalHandlers.currentActivityChanged);
    workspace.activitiesChanged.disconnect(workspaceSignalHandlers.activitiesChanged);
    workspace.activityAdded.disconnect(workspaceSignalHandlers.activityAdded);
    workspace.activityRemoved.disconnect(workspaceSignalHandlers.activityRemoved);
    workspace.virtualScreenSizeChanged.disconnect(workspaceSignalHandlers.virtualScreenSizeChanged);
    workspace.virtualScreenGeometryChanged.disconnect(workspaceSignalHandlers.virtualScreenGeometryChanged);
}
