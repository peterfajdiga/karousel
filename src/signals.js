const workspaceSignalHandlers = {
    desktopPresenceChanged: (client, desktop) => {
        print("desktopPresenceChanged", client, desktop);
    },
    
    currentDesktopChanged: (desktop, client) => {
        print("currentDesktopChanged", desktop, client);
    },
    
    clientAdded: (client) => {
        print("clientAdded", client);
    },
    
    clientRemoved: (client) => {
        const id = client.windowId;
        if (world.clientMap.has(id)) {
            world.removeClient(id);
        }
    },
    
    clientManaging: (client) => {
        print("clientManaging", client);
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
        print("clientRestored", client);
    },
    
    clientMaximizeSet: (client, h, v) => {
        print("clientMaximizeSet", client, h, v);
    },
    
    killWindowCalled: (client) => {
        print("killWindowCalled", client);
    },
    
    clientActivated: (client) => {
        print("clientActivated", client);
    },
    
    clientFullScreenSet: (client, fullScreen, user) => {
        print("clientFullScreenSet", client, fullScreen, user);
    },
    
    clientSetKeepAbove: (client, keepAbove) => {
        print("clientSetKeepAbove", client, keepAbove);
    },
    
    numberDesktopsChanged: (oldNumberOfDesktops) => {
        print("numberDesktopsChanged", oldNumberOfDesktops);
    },
    
    desktopLayoutChanged: () => {
        print("desktopLayoutChanged");
    },
    
    clientDemandsAttentionChanged: (client, set) => {
        print("clientDemandsAttentionChanged", client, set);
    },
    
    numberScreensChanged: (count) => {
        print("numberScreensChanged", count);
    },
    
    screenResized: (screen) => {
        print("screenResized", screen);
    },
    
    currentActivityChanged: (id) => {
        print("currentActivityChanged", id);
    },
    
    activitiesChanged: (id) => {
        print("activitiesChanged", id);
    },
    
    activityAdded: (id) => {
        print("activityAdded", id);
    },
    
    activityRemoved: (id) => {
        print("activityRemoved", id);
    },
    
    virtualScreenSizeChanged: () => {
        print("virtualScreenSizeChanged");
    },
    
    virtualScreenGeometryChanged: () => {
        print("virtualScreenGeometryChanged");
    },
}

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
