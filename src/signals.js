const workspaceSignalHandlers = {
    desktopPresenceChanged: (client, oldDesktop) => {
        doIfTiled(client.windowId, window => {
            // all desktops case handled in the client signal handler, because the workspace signal isn't fired for some reason

            const newDesktop = client.desktop;
            const oldGrid = world.getGrid(oldDesktop);
            const newGrid = world.getGrid(newDesktop);

            window.column.removeWindow(window);
            oldGrid.arrange();

            const column = new Column();
            newGrid.addColumn(column);
            column.addWindow(window);
            newGrid.arrange();
        });
    },

    currentDesktopChanged: (desktop, client) => {
        console.log("workspace currentDesktopChanged", desktop, client);
    },

    clientAdded: (client) => {
        const id = client.windowId;
        console.assert(!world.clientMap.has(id));
        if (shouldTile(client)) {
            world.addClient(id, client);
        }
    },

    clientRemoved: (client) => {
        const id = client.windowId;
        if (world.clientMap.has(id)) {
            world.removeClient(id);
        }
    },

    clientManaging: (client) => {
        console.log("workspace clientManaging", client);
    },

    clientMinimized: (client) => {
        const id = client.windowId;
        if (world.clientMap.has(id)) {
            world.removeClient(id);
            world.minimizedTiled.add(id);
        }
    },

    clientUnminimized: (client) => {
        const id = client.windowId;
        console.assert(!world.clientMap.has(id));
        if (world.minimizedTiled.has(id)) {
            world.minimizedTiled.delete(id);
            world.addClient(id, client);
        }
    },

    clientRestored: (client) => {
        console.log("workspace clientRestored", client);
    },

    clientMaximizeSet: (client, horizontal, vertical) => {
        doIfTiled(client.windowId, window => {
            const maximized = horizontal || vertical;
            window.skipArrange = maximized;
            client.keepBelow = !maximized;
        });
    },

    killWindowCalled: (client) => {
        console.log("workspace killWindowCalled", client);
    },

    clientActivated: client => {
        if (client === null) {
            return;
        }
        doIfTiled(client.windowId, window => {
            const column = window.column;
            if (this.grid === null) {
                return;
            }
            const grid = column.grid;
            grid.scrollToColumn(column);
            grid.arrange();
        });
    },

    clientFullScreenSet: (client, fullScreen, user) => {
        doIfTiled(client.windowId, window => {
            window.skipArrange = fullScreen;
            client.keepBelow = !fullScreen;
        });
    },

    clientSetKeepAbove: (client, keepAbove) => {
        console.log("workspace clientSetKeepAbove", client, keepAbove);
    },

    numberDesktopsChanged: (oldNumberOfDesktops) => {
        console.log("workspace numberDesktopsChanged", oldNumberOfDesktops);
    },

    desktopLayoutChanged: () => {
        console.log("workspace desktopLayoutChanged");
    },

    clientDemandsAttentionChanged: (client, set) => {
        console.log("workspace clientDemandsAttentionChanged", client, set);
    },

    numberScreensChanged: (count) => {
        console.log("workspace numberScreensChanged", count);
    },

    screenResized: (screen) => {
        console.log("workspace screenResized", screen);
    },

    currentActivityChanged: (id) => {
        console.log("workspace currentActivityChanged", id);
    },

    activitiesChanged: (id) => {
        console.log("workspace activitiesChanged", id);
    },

    activityAdded: (id) => {
        console.log("workspace activityAdded", id);
    },

    activityRemoved: (id) => {
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
