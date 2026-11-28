function initWorkspaceSignalHandlers(world: World, focusPasser: FocusPassing.Passer) {
    const manager = new SignalManager();

    manager.connect(Workspace.windowAdded, (kwinClient: KwinClient) => {
        world.do((clientManager, desktopManager) => {
            clientManager.addClient(kwinClient);
        });
    });

    function onWindowActivated(kwinClient: KwinClient|null) {
        if (kwinClient === null) {
            focusPasser.activate();
        } else {
            focusPasser.clearIfDifferent(kwinClient);
            world.do((clientManager, desktopManager) => {
                clientManager.onClientFocused(kwinClient);
            });
        }
    }

    const removedActivatedSignalGroup = new SignalGrouping.Group([
        new SignalGrouping.Handler(
            [Workspace.windowRemoved, Workspace.windowActivated] as const,
            (windowRemovedArgs, windowActivatedArgs) => {
                const removedClient = windowRemovedArgs[0];
                const activatedClient = windowActivatedArgs[0];
                world.do((clientManager, desktopManager) => {
                    if (!clientManager.willPassFocusOnRemove(removedClient)) {
                        // Karousel won't pass focus, so the window activated by KWin must be respected
                        onWindowActivated(activatedClient);
                    }
                    clientManager.removeClient(removedClient, FocusPassing.Type.Immediate);
                });
            },
        ),
        new SignalGrouping.Handler(
            [Workspace.windowRemoved],
            (windowRemovedArgs) => {
                const kwinClient = windowRemovedArgs[0];
                world.do((clientManager, desktopManager) => {
                    clientManager.removeClient(kwinClient, FocusPassing.Type.Immediate);
                });
            },
        ),
        new SignalGrouping.Handler(
            [Workspace.windowActivated],
            (windowActivatedArgs) => onWindowActivated(windowActivatedArgs[0]),
        ),
    ]);
    world.registerDoListener(() => removedActivatedSignalGroup.interrupt());
    removedActivatedSignalGroup.connect(manager);

    manager.connect(Workspace.currentDesktopChanged, () => {
        world.do(() => {}); // re-arrange desktop
    });

    manager.connect(Workspace.currentActivityChanged, () => {
        world.do(() => {}); // re-arrange desktop
    });

    manager.connect(Workspace.screensChanged, () => {
        world.do((clientManager, desktopManager) => {
            desktopManager.selectScreen(Workspace.activeScreen);
        });
    });

    manager.connect(Workspace.activitiesChanged, () => {
        world.do((clientManager, desktopManager) => {
            desktopManager.updateActivities();
        });
    });

    manager.connect(Workspace.desktopsChanged, () => {
        world.do((clientManager, desktopManager) => {
            desktopManager.updateDesktops();
        });
    });

    manager.connect(Workspace.virtualScreenSizeChanged, () => {
        world.onScreenResized();
    });

    return manager;
}
