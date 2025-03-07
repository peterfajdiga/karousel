tests.register("Maximization", 100, () => {
    const config = getDefaultConfig();
    const { qtMock, workspaceMock, world } = init(config);

    const [kwinClient] = workspaceMock.createClientsWithWidths(300);
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.hasClient(kwinClient));
    });

    const columnLeftX = screen.width/2 - 300/2;
    const columnTopY = tilingArea.top;
    const columnHeight = tilingArea.height;
    Assert.rect(kwinClient.frameGeometry, columnLeftX, columnTopY, 300, columnHeight);

    kwinClient.fullScreen = true;
    Assert.equalRects(kwinClient.frameGeometry, screen);

    kwinClient.fullScreen = false;
    Assert.rect(kwinClient.frameGeometry, columnLeftX, columnTopY, 300, columnHeight);

    kwinClient.setMaximize(true, true);
    Assert.equalRects(kwinClient.frameGeometry, screen);

    kwinClient.setMaximize(true, false);
    Assert.rect(kwinClient.frameGeometry, columnLeftX, 0, 300, screen.height);

    kwinClient.setMaximize(false, false);
    Assert.rect(kwinClient.frameGeometry, columnLeftX, columnTopY, 300, columnHeight);
});

tests.register("Maximize with transient", 100, () => {
    const config = getDefaultConfig();
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
    Assert.equalRects(parent.frameGeometry, screen);

    workspaceMock.createWindows(child);
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.hasClient(child));
    });
    Assert.rect(child.frameGeometry, 14, 24, 50, 50);
    Assert.equalRects(parent.frameGeometry, screen);
});

tests.register("Re-maximize disabled", 100, () => {
    const config = getDefaultConfig();
    config.reMaximize = false;
    const { qtMock, workspaceMock, world } = init(config);

    const [client1, client2] = workspaceMock.createClientsWithWidths(300, 400);
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.hasClient(client1));
        Assert.assert(clientManager.hasClient(client2));
    });

    const columnsWidth = 300 + 400 + config.gapsInnerHorizontal;
    const column1LeftX = screen.width/2 - columnsWidth/2;
    const column2LeftX = column1LeftX + 300 + config.gapsInnerHorizontal;
    const columnTopY = tilingArea.top;
    const columnHeight = tilingArea.height;
    Assert.rect(client1.frameGeometry, column1LeftX, columnTopY, 300, columnHeight);
    Assert.rect(client2.frameGeometry, column2LeftX, columnTopY, 400, columnHeight);

    runOneOf(
        () => client2.fullScreen = true,
        () => client2.setMaximize(true, true),
    );
    Assert.rect(client1.frameGeometry, column1LeftX, columnTopY, 300, columnHeight);
    Assert.equalRects(client2.frameGeometry, screen);

    runOneOf(
        () => workspaceMock.activeWindow = client1,
        () => qtMock.fireShortcut("karousel-focus-1"),
        () => qtMock.fireShortcut("karousel-focus-left"),
        () => qtMock.fireShortcut("karousel-focus-start"),
    );
    Assert.rect(client1.frameGeometry, column1LeftX, columnTopY, 300, columnHeight);
    Assert.rect(client2.frameGeometry, column2LeftX, columnTopY, 400, columnHeight);

    runOneOf(
        () => workspaceMock.activeWindow = client2,
        () => qtMock.fireShortcut("karousel-focus-2"),
        () => qtMock.fireShortcut("karousel-focus-right"),
        () => qtMock.fireShortcut("karousel-focus-end"),
    );
    Assert.rect(client1.frameGeometry, column1LeftX, columnTopY, 300, columnHeight);
    Assert.rect(client2.frameGeometry, column2LeftX, columnTopY, 400, columnHeight);
});

tests.register("Re-maximize enabled", 100, () => {
    const config = getDefaultConfig();
    config.reMaximize = true;
    const { qtMock, workspaceMock, world } = init(config);

    const [client1, client2] = workspaceMock.createClientsWithWidths(300, 400);
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.hasClient(client1));
        Assert.assert(clientManager.hasClient(client2));
    });

    const columnsWidth = 300 + 400 + config.gapsInnerHorizontal;
    const column1LeftX = screen.width/2 - columnsWidth/2;
    const column2LeftX = column1LeftX + 300 + config.gapsInnerHorizontal;
    const columnTopY = tilingArea.top;
    const columnHeight = tilingArea.height;
    Assert.rect(client1.frameGeometry, column1LeftX, columnTopY, 300, columnHeight);
    Assert.rect(client2.frameGeometry, column2LeftX, columnTopY, 400, columnHeight);

    runOneOf(
        () => client2.fullScreen = true,
        () => client2.setMaximize(true, true),
    );
    Assert.rect(client1.frameGeometry, column1LeftX, columnTopY, 300, columnHeight);
    Assert.equalRects(client2.frameGeometry, screen);

    runOneOf(
        () => workspaceMock.activeWindow = client1,
        () => qtMock.fireShortcut("karousel-focus-1"),
        () => qtMock.fireShortcut("karousel-focus-left"),
        () => qtMock.fireShortcut("karousel-focus-start"),
    );
    Assert.rect(client1.frameGeometry, column1LeftX, columnTopY, 300, columnHeight);
    Assert.rect(client2.frameGeometry, column2LeftX, columnTopY, 400, columnHeight);

    runOneOf(
        () => workspaceMock.activeWindow = client2,
        () => qtMock.fireShortcut("karousel-focus-2"),
        () => qtMock.fireShortcut("karousel-focus-right"),
        () => qtMock.fireShortcut("karousel-focus-end"),
    );
    Assert.rect(client1.frameGeometry, column1LeftX, columnTopY, 300, columnHeight);
    Assert.equalRects(client2.frameGeometry, screen);
});

tests.register("Start full-screen", 100, () => {
    const config = getDefaultConfig();
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

    Assert.centered(config, screen, windowedClient);
    Assert.equalRects(fullScreenClient.frameGeometry, screen);
    Assert.equal(Workspace.activeWindow, fullScreenClient);

    {
        qtMock.fireShortcut("karousel-focus-left");
        const opts = { message: "fullScreenClient is not in the grid, so we can't move focus directionally" };
        Assert.centered(config, screen, windowedClient, opts);
        Assert.equalRects(fullScreenClient.frameGeometry, screen, opts);
        Assert.equal(Workspace.activeWindow, fullScreenClient, opts);
    }

    {
        qtMock.fireShortcut("karousel-focus-1");
        const opts = { message: "fullScreenClient is not in grid, so it should stay full-screen" };
        Assert.centered(config, screen, windowedClient, opts);
        Assert.equalRects(fullScreenClient.frameGeometry, screen, opts);
        Assert.equal(Workspace.activeWindow, windowedClient);
    }
});

tests.register("Start full-screen (force tiling)", 100, () => {
    const config = getDefaultConfig();
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
    Assert.equalRects(fullScreenClient.frameGeometry, screen);
    Assert.equal(Workspace.activeWindow, fullScreenClient);

    const column2Width = tilingArea.width;
    const column1LeftX = tilingArea.left;
    const column2LeftX = column1LeftX + column1Width + gapH;
    const columnTopY = tilingArea.top;
    const columnHeight = tilingArea.height;
    qtMock.fireShortcut("karousel-focus-left");
    const opts = { message: "fullScreenClient should be restored from full-screen mode to tiled mode" };
    Assert.rect(windowedClient.frameGeometry, column1LeftX, columnTopY, column1Width, columnHeight, opts);
    Assert.rect(fullScreenClient.frameGeometry, column2LeftX, columnTopY, column2Width, columnHeight, opts);
    Assert.equal(Workspace.activeWindow, windowedClient);
});
