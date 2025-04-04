{
    function registerTests(
        suffix: string,
        getConfig: () => Config,
        shouldKeepBelow: (tiled: boolean) => boolean,
        shouldKeepAbove: (tiled: boolean) => boolean,
    ) {
        tests.register("Maximization " + suffix, 100, () => {
            const config = getConfig();
            const { qtMock, workspaceMock, world } = init(config);

            const [kwinClient] = workspaceMock.createClientsWithWidths(300);
            world.do((clientManager, desktopManager) => {
                Assert.assert(clientManager.hasClient(kwinClient));
            });

            const columnLeftX = tilingArea.left + tilingArea.width/2 - 300/2;
            const columnTopY = tilingArea.top;
            const columnHeight = tilingArea.height;
            Assert.assert(!kwinClient.fullScreen);
            Assert.equal(kwinClient.keepBelow, shouldKeepBelow(true));
            Assert.equal(kwinClient.keepAbove, shouldKeepAbove(true));
            Assert.rect(kwinClient.frameGeometry, columnLeftX, columnTopY, 300, columnHeight);

            kwinClient.fullScreen = true;
            Assert.assert(kwinClient.fullScreen);
            Assert.equal(kwinClient.keepBelow, shouldKeepBelow(false));
            Assert.equal(kwinClient.keepAbove, shouldKeepAbove(false));
            Assert.equalRects(kwinClient.frameGeometry, screen);

            kwinClient.fullScreen = false;
            Assert.assert(!kwinClient.fullScreen);
            Assert.equal(kwinClient.keepBelow, shouldKeepBelow(true));
            Assert.equal(kwinClient.keepAbove, shouldKeepAbove(true));
            Assert.rect(kwinClient.frameGeometry, columnLeftX, columnTopY, 300, columnHeight);

            kwinClient.setMaximize(true, true);
            Assert.assert(!kwinClient.fullScreen);
            Assert.equal(kwinClient.keepBelow, shouldKeepBelow(false));
            Assert.equal(kwinClient.keepAbove, shouldKeepAbove(false));
            Assert.equalRects(kwinClient.frameGeometry, screen);

            kwinClient.setMaximize(true, false);
            Assert.assert(!kwinClient.fullScreen);
            Assert.equal(kwinClient.keepBelow, shouldKeepBelow(false));
            Assert.equal(kwinClient.keepAbove, shouldKeepAbove(false));
            Assert.rect(kwinClient.frameGeometry, columnLeftX, 0, 300, screen.height);

            kwinClient.setMaximize(false, false);
            Assert.assert(!kwinClient.fullScreen);
            Assert.equal(kwinClient.keepBelow, shouldKeepBelow(true));
            Assert.equal(kwinClient.keepAbove, shouldKeepAbove(true));
            Assert.rect(kwinClient.frameGeometry, columnLeftX, columnTopY, 300, columnHeight);
        });

        tests.register("Maximize with transient " + suffix, 100, () => {
            const config = getConfig();
            const { qtMock, workspaceMock, world } = init(config);

            const parent = new MockKwinClient(new MockQmlRect(10, 20, 300, 200));
            const child = new MockKwinClient(new MockQmlRect(14, 24, 50, 50), parent);

            workspaceMock.createWindows(parent);
            world.do((clientManager, desktopManager) => {
                Assert.assert(clientManager.hasClient(parent));
            });

            runOneOf(
                () => parent.fullScreen = true,
                () => parent.setMaximize(true, true),
            );
            Assert.equal(parent.keepBelow, shouldKeepBelow(false));
            Assert.equal(parent.keepAbove, shouldKeepAbove(false));
            Assert.equalRects(parent.frameGeometry, screen);

            workspaceMock.createWindows(child);
            world.do((clientManager, desktopManager) => {
                Assert.assert(clientManager.hasClient(child));
            });
            Assert.assert(!child.fullScreen);
            Assert.equal(child.keepBelow, shouldKeepBelow(false));
            Assert.equal(child.keepAbove, shouldKeepAbove(false));
            Assert.rect(child.frameGeometry, 14, 24, 50, 50);
            Assert.equal(parent.keepBelow, shouldKeepBelow(false));
            Assert.equal(parent.keepAbove, shouldKeepAbove(false));
            Assert.equalRects(parent.frameGeometry, screen);
        });

        {
            function assertWindowed(config: Config, clients: KwinClient[]) {
                Assert.assert(!clients[0].fullScreen);
                Assert.equal(clients[0].keepBelow, shouldKeepBelow(true));
                Assert.equal(clients[0].keepAbove, shouldKeepAbove(true));
                Assert.assert(!clients[1].fullScreen);
                Assert.equal(clients[1].keepBelow, shouldKeepBelow(true));
                Assert.equal(clients[1].keepAbove, shouldKeepAbove(true));
                Assert.assert(!clients[2].fullScreen);
                Assert.equal(clients[2].keepBelow, shouldKeepBelow(true));
                Assert.equal(clients[2].keepAbove, shouldKeepAbove(true));
                Assert.grid(config, tilingArea, [300, 400], [[clients[0]], [clients[1], clients[2]]], true);
            }

            function assertFullScreenOrMaximized(clients: KwinClient[]) {
                Assert.assert(!clients[0].fullScreen);
                Assert.equal(clients[0].keepBelow, shouldKeepBelow(true));
                Assert.equal(clients[0].keepAbove, shouldKeepAbove(true));
                Assert.assert(!clients[1].fullScreen);
                Assert.equal(clients[1].keepBelow, shouldKeepBelow(true));
                Assert.equal(clients[1].keepAbove, shouldKeepAbove(true));
                Assert.equal(clients[2].keepBelow, shouldKeepBelow(false));
                Assert.equal(clients[2].keepAbove, shouldKeepAbove(false));
                Assert.equalRects(clients[2].frameGeometry, screen);
            }

            tests.register("Re-maximize disabled " + suffix, 100, () => {
                const config = getConfig();
                config.reMaximize = false;
                const { qtMock, workspaceMock, world } = init(config);

                const clients = workspaceMock.createClientsWithWidths(300, 400, 400);
                qtMock.fireShortcut("karousel-window-move-left");

                assertWindowed(config, clients);

                runOneOf(
                    () => clients[2].fullScreen = true,
                    () => clients[2].setMaximize(true, true),
                );
                assertFullScreenOrMaximized(clients);

                runOneOf(
                    () => workspaceMock.activeWindow = clients[0],
                    () => qtMock.fireShortcut("karousel-focus-1"),
                    () => qtMock.fireShortcut("karousel-focus-left"),
                    () => qtMock.fireShortcut("karousel-focus-start"),
                );
                assertWindowed(config, clients);

                runOneOf(
                    () => workspaceMock.activeWindow = clients[2],
                    () => qtMock.fireShortcut("karousel-focus-2"),
                    () => qtMock.fireShortcut("karousel-focus-right"),
                    () => qtMock.fireShortcut("karousel-focus-end"),
                );
                assertWindowed(config, clients);
            });

            tests.register("Re-maximize enabled " + suffix, 100, () => {
                const config = getConfig();
                config.reMaximize = true;
                const { qtMock, workspaceMock, world } = init(config);

                const clients = workspaceMock.createClientsWithWidths(300, 400, 400);
                qtMock.fireShortcut("karousel-window-move-left");

                assertWindowed(config, clients);

                runOneOf(
                    () => clients[2].fullScreen = true,
                    () => clients[2].setMaximize(true, true),
                );
                assertFullScreenOrMaximized(clients);

                runOneOf(
                    () => workspaceMock.activeWindow = clients[0],
                    () => qtMock.fireShortcut("karousel-focus-1"),
                    () => qtMock.fireShortcut("karousel-focus-left"),
                    () => qtMock.fireShortcut("karousel-focus-start"),
                );
                assertWindowed(config, clients);

                runOneOf(
                    () => workspaceMock.activeWindow = clients[2],
                    () => qtMock.fireShortcut("karousel-focus-2"),
                    () => qtMock.fireShortcut("karousel-focus-right"),
                    () => qtMock.fireShortcut("karousel-focus-end"),
                );
                assertFullScreenOrMaximized(clients);
            });
        }

        tests.register("Start full-screen " + suffix, 100, () => {
            const config = getConfig();
            config.reMaximize = true;
            const { qtMock, workspaceMock, world } = init(config);

            const [windowedClient] = workspaceMock.createClientsWithWidths(300);
            const fullScreenClient = new MockKwinClient(new MockQmlRect(0, 0, 400, 200));
            fullScreenClient.resourceClass = "full-screen-app";
            fullScreenClient.fullScreen = true;
            workspaceMock.createWindows(fullScreenClient);

            world.do((clientManager, desktopManager) => {
                Assert.assert(clientManager.hasClient(windowedClient));
                Assert.assert(clientManager.hasClient(fullScreenClient));
            });

            Assert.assert(!windowedClient.fullScreen);
            Assert.equal(windowedClient.keepBelow, shouldKeepBelow(true));
            Assert.equal(windowedClient.keepAbove, shouldKeepAbove(true));
            Assert.centered(config, tilingArea, windowedClient);
            Assert.assert(fullScreenClient.fullScreen);
            Assert.equal(fullScreenClient.keepBelow, shouldKeepBelow(false));
            Assert.equal(fullScreenClient.keepAbove, shouldKeepAbove(false));
            Assert.equalRects(fullScreenClient.frameGeometry, screen);
            Assert.equal(Workspace.activeWindow, fullScreenClient);

            {
                qtMock.fireShortcut("karousel-focus-left");
                const opts = { message: "fullScreenClient is not in the grid, so we can't move focus directionally" };
                Assert.assert(!windowedClient.fullScreen);
                Assert.equal(windowedClient.keepBelow, shouldKeepBelow(true));
                Assert.equal(windowedClient.keepAbove, shouldKeepAbove(true));
                Assert.centered(config, tilingArea, windowedClient);
                Assert.assert(fullScreenClient.fullScreen);
                Assert.equal(fullScreenClient.keepBelow, shouldKeepBelow(false));
                Assert.equal(fullScreenClient.keepAbove, shouldKeepAbove(false));
                Assert.equalRects(fullScreenClient.frameGeometry, screen);
                Assert.equal(Workspace.activeWindow, fullScreenClient, opts);
            }

            {
                qtMock.fireShortcut("karousel-focus-1");
                const opts = { message: "fullScreenClient is not in grid, so it should stay full-screen" };
                Assert.assert(!windowedClient.fullScreen);
                Assert.equal(windowedClient.keepBelow, shouldKeepBelow(true));
                Assert.equal(windowedClient.keepAbove, shouldKeepAbove(true));
                Assert.centered(config, tilingArea, windowedClient);
                Assert.assert(fullScreenClient.fullScreen);
                Assert.equal(fullScreenClient.keepBelow, shouldKeepBelow(false));
                Assert.equal(fullScreenClient.keepAbove, shouldKeepAbove(false));
                Assert.equalRects(fullScreenClient.frameGeometry, screen);
                Assert.equal(Workspace.activeWindow, windowedClient);
            }
        });

        tests.register("Start full-screen (force tiling) " + suffix, 100, () => {
            const config = getConfig();
            config.reMaximize = true;
            config.windowRules = '[{ "class": "full-screen-app", "tile": true }]';
            const { qtMock, workspaceMock, world } = init(config);

            const column1Width = 300;
            const [windowedClient] = workspaceMock.createClientsWithWidths(column1Width);
            const fullScreenClient = new MockKwinClient(new MockQmlRect(0, 0, 400, 200));
            fullScreenClient.resourceClass = "full-screen-app";
            fullScreenClient.fullScreen = true;
            workspaceMock.createWindows(fullScreenClient);

            world.do((clientManager, desktopManager) => {
                Assert.assert(clientManager.hasClient(windowedClient));
                Assert.assert(clientManager.hasClient(fullScreenClient));
            });
            Assert.assert(!windowedClient.fullScreen);
            Assert.equal(windowedClient.keepBelow, shouldKeepBelow(true));
            Assert.equal(windowedClient.keepAbove, shouldKeepAbove(true));
            Assert.grid(config, tilingArea, [column1Width], [[windowedClient]], false);
            Assert.assert(fullScreenClient.fullScreen);
            Assert.equal(fullScreenClient.keepBelow, shouldKeepBelow(false));
            Assert.equal(fullScreenClient.keepAbove, shouldKeepAbove(false));
            Assert.equalRects(fullScreenClient.frameGeometry, screen);
            Assert.equal(Workspace.activeWindow, fullScreenClient);

            let expectedColumn2Width = 0;
            let expectedActiveWindow;
            runOneOf(
                () => {
                    fullScreenClient.fullScreen = false;
                    expectedColumn2Width = 400;
                    expectedActiveWindow = fullScreenClient;
                },
                () => {
                    qtMock.fireShortcut("karousel-focus-left");
                    expectedColumn2Width = tilingArea.width;
                    expectedActiveWindow = windowedClient;
                },
            );

            const opts = { message: "fullScreenClient should be restored from full-screen mode to tiled mode" };
            Assert.assert(!windowedClient.fullScreen);
            Assert.equal(windowedClient.keepBelow, shouldKeepBelow(true));
            Assert.equal(windowedClient.keepAbove, shouldKeepAbove(true));
            Assert.assert(!fullScreenClient.fullScreen);
            Assert.equal(fullScreenClient.keepBelow, shouldKeepBelow(true));
            Assert.equal(fullScreenClient.keepAbove, shouldKeepAbove(true));
            Assert.grid(config, tilingArea, [column1Width, expectedColumn2Width], [[windowedClient], [fullScreenClient]], false, [], opts);
            Assert.equal(Workspace.activeWindow, expectedActiveWindow);
        });
    }

    function getConfig(floatingKeepAbove: boolean) {
        const config = getDefaultConfig();
        config.tiledKeepBelow = !floatingKeepAbove;
        config.floatingKeepAbove = floatingKeepAbove;
        return config;
    }

    registerTests(
        "(tiled below)",
        getConfig.partial(false),
        tiled => tiled,
        tiled => false,
    );

    registerTests(
        "(floating above)",
        getConfig.partial(true),
        tiled => false,
        tiled => !tiled,
    );
}
