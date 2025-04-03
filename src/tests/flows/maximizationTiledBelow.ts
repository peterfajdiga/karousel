tests.register("Maximization (tiled below)", 100, () => {
    const config = getDefaultConfig();
    config.tiledKeepBelow = true;
    config.floatingKeepAbove = false;
    const { qtMock, workspaceMock, world } = init(config);

    const [kwinClient] = workspaceMock.createClientsWithWidths(300);
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.hasClient(kwinClient));
    });

    const columnLeftX = tilingArea.left + tilingArea.width/2 - 300/2;
    const columnTopY = tilingArea.top;
    const columnHeight = tilingArea.height;
    Assert.assert(!kwinClient.fullScreen);
    Assert.assert(kwinClient.keepBelow);
    Assert.assert(!kwinClient.keepAbove);
    Assert.rect(kwinClient.frameGeometry, columnLeftX, columnTopY, 300, columnHeight);

    kwinClient.fullScreen = true;
    Assert.assert(kwinClient.fullScreen);
    Assert.assert(!kwinClient.keepBelow);
    Assert.assert(!kwinClient.keepAbove);
    Assert.equalRects(kwinClient.frameGeometry, screen);

    kwinClient.fullScreen = false;
    Assert.assert(!kwinClient.fullScreen);
    Assert.assert(kwinClient.keepBelow);
    Assert.assert(!kwinClient.keepAbove);
    Assert.rect(kwinClient.frameGeometry, columnLeftX, columnTopY, 300, columnHeight);

    kwinClient.setMaximize(true, true);
    Assert.assert(!kwinClient.fullScreen);
    Assert.assert(!kwinClient.keepBelow);
    Assert.assert(!kwinClient.keepAbove);
    Assert.equalRects(kwinClient.frameGeometry, screen);

    kwinClient.setMaximize(true, false);
    Assert.assert(!kwinClient.fullScreen);
    Assert.assert(!kwinClient.keepBelow);
    Assert.assert(!kwinClient.keepAbove);
    Assert.rect(kwinClient.frameGeometry, columnLeftX, 0, 300, screen.height);

    kwinClient.setMaximize(false, false);
    Assert.assert(!kwinClient.fullScreen);
    Assert.assert(kwinClient.keepBelow);
    Assert.assert(!kwinClient.keepAbove);
    Assert.rect(kwinClient.frameGeometry, columnLeftX, columnTopY, 300, columnHeight);
});

tests.register("Maximize with transient (tiled below)", 100, () => {
    const config = getDefaultConfig();
    config.tiledKeepBelow = true;
    config.floatingKeepAbove = false;
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
    Assert.assert(!parent.keepBelow);
    Assert.assert(!parent.keepAbove);
    Assert.equalRects(parent.frameGeometry, screen);

    workspaceMock.createWindows(child);
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.hasClient(child));
    });
    Assert.assert(!child.fullScreen);
    Assert.assert(!child.keepBelow);
    Assert.assert(!child.keepAbove);
    Assert.rect(child.frameGeometry, 14, 24, 50, 50);
    Assert.assert(!parent.keepBelow);
    Assert.assert(!parent.keepAbove);
    Assert.equalRects(parent.frameGeometry, screen);
});

tests.register("Re-maximize disabled (tiled below)", 100, () => {
    const config = getDefaultConfig();
    config.tiledKeepBelow = true;
    config.floatingKeepAbove = false;
    config.reMaximize = false;
    const { qtMock, workspaceMock, world } = init(config);

    const [client1, client2] = workspaceMock.createClientsWithWidths(300, 400);
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.hasClient(client1));
        Assert.assert(clientManager.hasClient(client2));
    });

    Assert.assert(!client1.fullScreen);
    Assert.assert(client1.keepBelow);
    Assert.assert(!client1.keepAbove);
    Assert.assert(!client2.fullScreen);
    Assert.assert(client2.keepBelow);
    Assert.assert(!client2.keepAbove);
    Assert.grid(config, tilingArea, [300, 400], [[client1], [client2]], true);

    runOneOf(
        () => client2.fullScreen = true,
        () => client2.setMaximize(true, true),
    );
    Assert.assert(!client1.fullScreen);
    Assert.assert(client1.keepBelow);
    Assert.assert(!client1.keepAbove);
    Assert.grid(config, tilingArea, [300], [[client1]], false);
    Assert.assert(!client2.keepBelow);
    Assert.assert(!client2.keepAbove);
    Assert.equalRects(client2.frameGeometry, screen);

    runOneOf(
        () => workspaceMock.activeWindow = client1,
        () => qtMock.fireShortcut("karousel-focus-1"),
        () => qtMock.fireShortcut("karousel-focus-left"),
        () => qtMock.fireShortcut("karousel-focus-start"),
    );
    Assert.assert(!client1.fullScreen);
    Assert.assert(client1.keepBelow);
    Assert.assert(!client1.keepAbove);
    Assert.assert(!client2.fullScreen);
    Assert.assert(client2.keepBelow);
    Assert.assert(!client2.keepAbove);
    Assert.grid(config, tilingArea, [300, 400], [[client1], [client2]], true);

    runOneOf(
        () => workspaceMock.activeWindow = client2,
        () => qtMock.fireShortcut("karousel-focus-2"),
        () => qtMock.fireShortcut("karousel-focus-right"),
        () => qtMock.fireShortcut("karousel-focus-end"),
    );
    Assert.assert(!client1.fullScreen);
    Assert.assert(client1.keepBelow);
    Assert.assert(!client1.keepAbove);
    Assert.assert(!client2.fullScreen);
    Assert.assert(client2.keepBelow);
    Assert.assert(!client2.keepAbove);
    Assert.grid(config, tilingArea, [300, 400], [[client1], [client2]], true);
});

tests.register("Re-maximize enabled (tiled below)", 100, () => {
    const config = getDefaultConfig();
    config.tiledKeepBelow = true;
    config.floatingKeepAbove = false;
    config.reMaximize = true;
    const { qtMock, workspaceMock, world } = init(config);

    const [client1, client2] = workspaceMock.createClientsWithWidths(300, 400);
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.hasClient(client1));
        Assert.assert(clientManager.hasClient(client2));
    });

    Assert.assert(!client1.fullScreen);
    Assert.assert(client1.keepBelow);
    Assert.assert(!client1.keepAbove);
    Assert.assert(!client2.fullScreen);
    Assert.assert(client2.keepBelow);
    Assert.assert(!client2.keepAbove);
    Assert.grid(config, tilingArea, [300, 400], [[client1], [client2]], true);

    runOneOf(
        () => client2.fullScreen = true,
        () => client2.setMaximize(true, true),
    );
    Assert.assert(!client1.fullScreen);
    Assert.assert(client1.keepBelow);
    Assert.assert(!client1.keepAbove);
    Assert.grid(config, tilingArea, [300], [[client1]], false);
    Assert.assert(!client2.keepBelow);
    Assert.assert(!client2.keepAbove);
    Assert.equalRects(client2.frameGeometry, screen);

    runOneOf(
        () => workspaceMock.activeWindow = client1,
        () => qtMock.fireShortcut("karousel-focus-1"),
        () => qtMock.fireShortcut("karousel-focus-left"),
        () => qtMock.fireShortcut("karousel-focus-start"),
    );
    Assert.assert(!client1.fullScreen);
    Assert.assert(client1.keepBelow);
    Assert.assert(!client1.keepAbove);
    Assert.assert(!client2.fullScreen);
    Assert.assert(client2.keepBelow);
    Assert.assert(!client2.keepAbove);
    Assert.grid(config, tilingArea, [300, 400], [[client1], [client2]], true);

    runOneOf(
        () => workspaceMock.activeWindow = client2,
        () => qtMock.fireShortcut("karousel-focus-2"),
        () => qtMock.fireShortcut("karousel-focus-right"),
        () => qtMock.fireShortcut("karousel-focus-end"),
    );
    Assert.assert(!client1.fullScreen);
    Assert.assert(client1.keepBelow);
    Assert.assert(!client1.keepAbove);
    Assert.grid(config, tilingArea, [300], [[client1]], false);
    Assert.assert(!client2.keepBelow);
    Assert.assert(!client2.keepAbove);
    Assert.equalRects(client2.frameGeometry, screen);
});

tests.register("Start full-screen (tiled below)", 100, () => {
    const config = getDefaultConfig();
    config.tiledKeepBelow = true;
    config.floatingKeepAbove = false;
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
    Assert.assert(windowedClient.keepBelow);
    Assert.assert(!windowedClient.keepAbove);
    Assert.centered(config, tilingArea, windowedClient);
    Assert.assert(fullScreenClient.fullScreen);
    Assert.assert(!fullScreenClient.keepBelow);
    Assert.assert(!fullScreenClient.keepAbove);
    Assert.equalRects(fullScreenClient.frameGeometry, screen);
    Assert.equal(Workspace.activeWindow, fullScreenClient);

    {
        qtMock.fireShortcut("karousel-focus-left");
        const opts = { message: "fullScreenClient is not in the grid, so we can't move focus directionally" };
        Assert.assert(!windowedClient.fullScreen);
        Assert.assert(windowedClient.keepBelow);
        Assert.assert(!windowedClient.keepAbove);
        Assert.centered(config, tilingArea, windowedClient);
        Assert.assert(fullScreenClient.fullScreen);
        Assert.assert(!fullScreenClient.keepBelow);
        Assert.assert(!fullScreenClient.keepAbove);
        Assert.equalRects(fullScreenClient.frameGeometry, screen);
        Assert.equal(Workspace.activeWindow, fullScreenClient, opts);
    }

    {
        qtMock.fireShortcut("karousel-focus-1");
        const opts = { message: "fullScreenClient is not in grid, so it should stay full-screen" };
        Assert.assert(!windowedClient.fullScreen);
        Assert.assert(windowedClient.keepBelow);
        Assert.assert(!windowedClient.keepAbove);
        Assert.centered(config, tilingArea, windowedClient);
        Assert.assert(fullScreenClient.fullScreen);
        Assert.assert(!fullScreenClient.keepBelow);
        Assert.assert(!fullScreenClient.keepAbove);
        Assert.equalRects(fullScreenClient.frameGeometry, screen);
        Assert.equal(Workspace.activeWindow, windowedClient);
    }
});

tests.register("Start full-screen (force tiling) (tiled below)", 100, () => {
    const config = getDefaultConfig();
    config.tiledKeepBelow = true;
    config.floatingKeepAbove = false;
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
    Assert.assert(windowedClient.keepBelow);
    Assert.assert(!windowedClient.keepAbove);
    Assert.grid(config, tilingArea, [column1Width], [[windowedClient]], false);
    Assert.assert(fullScreenClient.fullScreen);
    Assert.assert(!fullScreenClient.keepBelow);
    Assert.assert(!fullScreenClient.keepAbove);
    Assert.equalRects(fullScreenClient.frameGeometry, screen);
    Assert.equal(Workspace.activeWindow, fullScreenClient);

    const column2Width = tilingArea.width;
    qtMock.fireShortcut("karousel-focus-left");
    const opts = { message: "fullScreenClient should be restored from full-screen mode to tiled mode" };
    Assert.assert(!windowedClient.fullScreen);
    Assert.assert(windowedClient.keepBelow);
    Assert.assert(!windowedClient.keepAbove);
    Assert.assert(!fullScreenClient.fullScreen);
    Assert.assert(fullScreenClient.keepBelow);
    Assert.assert(!fullScreenClient.keepAbove);
    Assert.grid(config, tilingArea, [column1Width, column2Width], [[windowedClient], [fullScreenClient]], false, [], opts);
    Assert.equal(Workspace.activeWindow, windowedClient);
});
