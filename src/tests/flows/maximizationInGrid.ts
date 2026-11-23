{
    function getConfig(floatingKeepAbove: boolean) {
        const config = getDefaultConfig();
        config.tiledKeepBelow = !floatingKeepAbove;
        config.floatingKeepAbove = floatingKeepAbove;
        config.tileFullScreen = true;
        config.tileMaximized = true;
        return config;
    }

    function assertNeighbors(config: Config, left: MockKwinClient, middle: MockKwinClient, right: MockKwinClient) {
        const middleFrame = middle.getActualFrameGeometry();
        Assert.equal(rectRight(left.getActualFrameGeometry()) + config.gapsInnerHorizontal, middleFrame.x, { skip: 1 });
        Assert.equal(rectRight(middleFrame) + config.gapsInnerHorizontal, right.getActualFrameGeometry().x, { skip: 1 });
    }

    function registerTests(suffix: string, floatingKeepAbove: boolean) {
        tests.register("Full-screen in grid " + suffix, 100, () => {
            const config = getConfig(floatingKeepAbove);
            const { qtMock, workspaceMock, world } = init(config);

            const [left, middle, right] = workspaceMock.createClientsWithWidths(300, 300, 300);
            workspaceMock.activeWindow = middle;

            middle.fullScreen = true;
            Assert.assert(middle.fullScreen);
            Assert.equalRects(middle.getActualFrameGeometry(), screen);
            Assert.equal(middle.keepBelow, false, { message: "focused full-screen window must cover panels" });
            Assert.equal(middle.keepAbove, false);
            assertNeighbors(config, left, middle, right);
            world.do((clientManager, desktopManager) => {
                Assert.tiledClient(clientManager, middle);
            });

            runOneOf(
                () => { workspaceMock.activeWindow = left; },
                () => { qtMock.fireShortcut("karousel-focus-left"); },
                () => { qtMock.fireShortcut("karousel-focus-1"); },
            );
            Assert.equal(Workspace.activeWindow, left);
            Assert.assert(middle.fullScreen, { message: "full-screen window should stay full-screen when unfocused" });
            Assert.equal(middle.keepBelow, !floatingKeepAbove);
            Assert.equal(middle.keepAbove, false);
            Assert.fullyVisible(left.getActualFrameGeometry());
            Assert.equal(middle.getActualFrameGeometry().width, screen.width);
            Assert.equal(middle.getActualFrameGeometry().height, screen.height);
            assertNeighbors(config, left, middle, right);

            runOneOf(
                () => { workspaceMock.activeWindow = middle; },
                () => { qtMock.fireShortcut("karousel-focus-right"); },
                () => { qtMock.fireShortcut("karousel-focus-2"); },
            );
            Assert.equal(Workspace.activeWindow, middle);
            Assert.equalRects(middle.getActualFrameGeometry(), screen);
            Assert.equal(middle.keepBelow, false);

            qtMock.fireShortcut("karousel-focus-right");
            Assert.equal(Workspace.activeWindow, right);
            Assert.assert(middle.fullScreen);
            Assert.fullyVisible(right.getActualFrameGeometry());
            assertNeighbors(config, left, middle, right);

            qtMock.fireShortcut("karousel-focus-left");
            middle.fullScreen = false;
            Assert.assert(!middle.fullScreen);
            Assert.equal(middle.keepBelow, !floatingKeepAbove);
            Assert.grid(config, tilingArea, 300, [[left], [middle], [right]], false);
        });

        tests.register("Full-screen in grid gets own column " + suffix, 100, () => {
            const config = getConfig(floatingKeepAbove);
            const { qtMock, workspaceMock, world } = init(config);

            const clients = workspaceMock.createClientsWithWidths(300, 300, 300);
            qtMock.fireShortcut("karousel-window-move-left");
            Assert.grid(config, tilingArea, 300, [[clients[0]], [clients[1], clients[2]]], true);

            runOneOf(
                () => { clients[2].fullScreen = true; },
                () => { clients[2].setMaximize(true, true); },
            );
            Assert.equalRects(clients[2].getActualFrameGeometry(), screen);
            Assert.rect(clients[1].getActualFrameGeometry(), clients[1].getActualFrameGeometry().x, tilingArea.y, 300, tilingArea.height);
            Assert.equal(rectRight(clients[1].getActualFrameGeometry()) + config.gapsInnerHorizontal, clients[2].getActualFrameGeometry().x);
        });

        tests.register("Maximized in grid " + suffix, 100, () => {
            const config = getConfig(floatingKeepAbove);
            const { qtMock, workspaceMock, world } = init(config);

            const [left, middle, right] = workspaceMock.createClientsWithWidths(300, 300, 300);
            workspaceMock.activeWindow = middle;

            middle.setMaximize(true, true);
            Assert.equalRects(middle.getActualFrameGeometry(), screen);
            Assert.equal(middle.keepBelow, !floatingKeepAbove, { message: "maximized window in grid should be layered like any tiled window" });
            Assert.equal(middle.keepAbove, false);
            assertNeighbors(config, left, middle, right);

            qtMock.fireShortcut("karousel-focus-left");
            Assert.equal(Workspace.activeWindow, left);
            Assert.fullyVisible(left.getActualFrameGeometry());
            Assert.equal(middle.getActualFrameGeometry().width, screen.width, { message: "maximized window should stay maximized when unfocused" });
            assertNeighbors(config, left, middle, right);

            qtMock.fireShortcut("karousel-focus-right");
            Assert.equalRects(middle.getActualFrameGeometry(), screen);

            middle.setMaximize(false, true);
            Assert.rect(middle.getActualFrameGeometry(), screen.x, tilingArea.y, screen.width, tilingArea.height);

            middle.setMaximize(true, false);
            Assert.rect(middle.getActualFrameGeometry(), middle.getActualFrameGeometry().x, screen.y, 300, screen.height);
            Assert.fullyVisible(middle.getActualFrameGeometry());

            middle.setMaximize(false, false);
            Assert.equal(middle.keepBelow, !floatingKeepAbove);
            Assert.grid(config, tilingArea, 300, [[left], [middle], [right]], false);
        });

        tests.register("Start full-screen in grid " + suffix, 100, () => {
            const config = getConfig(floatingKeepAbove);
            const { qtMock, workspaceMock, world } = init(config);

            const [windowedClient] = workspaceMock.createClientsWithWidths(300);
            const fullScreenClient = new MockKwinClient(new MockQmlRect(0, 0, 400, 200));
            fullScreenClient.fullScreen = true;
            workspaceMock.createWindows(fullScreenClient);

            world.do((clientManager, desktopManager) => {
                Assert.tiledClient(clientManager, windowedClient);
                Assert.tiledClient(clientManager, fullScreenClient);
            });
            Assert.equal(Workspace.activeWindow, fullScreenClient);
            Assert.equalRects(fullScreenClient.getActualFrameGeometry(), screen);
            Assert.equal(fullScreenClient.keepBelow, false);
            Assert.equal(fullScreenClient.keepAbove, false);

            qtMock.fireShortcut("karousel-focus-left");
            Assert.equal(Workspace.activeWindow, windowedClient);
            Assert.assert(fullScreenClient.fullScreen);
            Assert.equal(fullScreenClient.keepBelow, !floatingKeepAbove);
            Assert.fullyVisible(windowedClient.getActualFrameGeometry());
            Assert.equal(rectRight(windowedClient.getActualFrameGeometry()) + config.gapsInnerHorizontal, fullScreenClient.getActualFrameGeometry().x);
        });
    }

    registerTests("(tiled below)", false);
    registerTests("(floating above)", true);
}
