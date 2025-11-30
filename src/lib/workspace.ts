function initWorkspaceSignalHandlers(world: World, focusPasser: FocusPassing.Passer) {
    const manager = new SignalManager();

    manager.connect(Workspace.windowAdded, (kwinClient: KwinClient) => {
        world.do((clientManager, desktopManager) => {
            clientManager.addClient(kwinClient);
        });
    });

    new SignalGrouping.Group([
        new SignalGrouping.Handler(
            [Workspace.windowRemoved, Workspace.windowActivated] as const,
            (windowRemovedArgs, windowActivatedArgs) => {
                const kwinClient = windowRemovedArgs[0];
                world.do((clientManager, desktopManager) => {
                    clientManager.removeClient(kwinClient, FocusPassing.Type.Immediate);
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
            (windowActivatedArgs) => {
                const kwinClient = windowActivatedArgs[0];
                if (kwinClient === null) {
                    focusPasser.activate();
                } else {
                    focusPasser.clearIfDifferent(kwinClient);
                    world.do((clientManager, desktopManager) => {
                        clientManager.onClientFocused(kwinClient);
                    });
                }
            },
        ),
    ]).connect(manager);

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
