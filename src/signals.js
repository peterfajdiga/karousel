const workspaceSignalHandlers = {
    desktopPresenceChanged: (client, oldDesktop) => {
        print("workspace desktopPresenceChanged", client, oldDesktop);
    },

    currentDesktopChanged: (desktop, client) => {
        print("workspace currentDesktopChanged", desktop, client);
    },

    clientAdded: (client) => {
        const id = client.windowId;
        assert(!world.clientMap.has(id));
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
        print("workspace clientManaging", client);
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
        assert(!world.clientMap.has(id));
        if (world.minimizedTiled.has(id)) {
            world.minimizedTiled.delete(id);
            world.addClient(id, client);
        }
    },

    clientRestored: (client) => {
        print("workspace clientRestored", client);
    },

    clientMaximizeSet: (client, horizontal, vertical) => {
        doIfTiled(client.windowId, window => {
            const maximized = horizontal || vertical;
            window.skipArrange = maximized;
            client.keepBelow = !maximized;
        });
    },

    killWindowCalled: (client) => {
        print("workspace killWindowCalled", client);
    },

    clientActivated: (client) => {
        print("workspace clientActivated", client);
    },

    clientFullScreenSet: (client, fullScreen, user) => {
        doIfTiled(client.windowId, window => {
            window.skipArrange = fullScreen;
            client.keepBelow = !fullScreen;
        });
    },

    clientSetKeepAbove: (client, keepAbove) => {
        print("workspace clientSetKeepAbove", client, keepAbove);
    },

    numberDesktopsChanged: (oldNumberOfDesktops) => {
        print("workspace numberDesktopsChanged", oldNumberOfDesktops);
    },

    desktopLayoutChanged: () => {
        print("workspace desktopLayoutChanged");
    },

    clientDemandsAttentionChanged: (client, set) => {
        print("workspace clientDemandsAttentionChanged", client, set);
    },

    numberScreensChanged: (count) => {
        print("workspace numberScreensChanged", count);
    },

    screenResized: (screen) => {
        print("workspace screenResized", screen);
    },

    currentActivityChanged: (id) => {
        print("workspace currentActivityChanged", id);
    },

    activitiesChanged: (id) => {
        print("workspace activitiesChanged", id);
    },

    activityAdded: (id) => {
        print("workspace activityAdded", id);
    },

    activityRemoved: (id) => {
        print("workspace activityRemoved", id);
    },

    virtualScreenSizeChanged: () => {
        print("workspace virtualScreenSizeChanged");
    },

    virtualScreenGeometryChanged: () => {
        print("workspace virtualScreenGeometryChanged");
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
