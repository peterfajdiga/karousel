tests.register("Maximization", 100, () => {
    const config = getDefaultConfig();
    const { qtMock, workspaceMock, world } = init(config);

    const kwinClient = new MockKwinClient(
        1,
        "app1",
        "Application 1",
        new MockQmlRect(10, 20, 300, 200),
    );

    workspaceMock.createWindow(kwinClient);
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

    const parent = new MockKwinClient(
        1,
        "app1",
        "Application 1",
        new MockQmlRect(10, 20, 300, 200),
    );

    const child = new MockKwinClient(
        2,
        "app1",
        "Application 1 - Dialog",
        new MockQmlRect(14, 24, 50, 50),
        parent,
    );

    workspaceMock.createWindow(parent);
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.hasClient(parent));
    });

    runOneOf(
        () => parent.fullScreen = true,
        () => parent.setMaximize(true, true),
    );
    Assert.equalRects(parent.frameGeometry, screen);

    workspaceMock.createWindow(child);
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

    const client1 = new MockKwinClient(
        1,
        "app1",
        "Application 1",
        new MockQmlRect(10, 20, 300, 200),
    );

    const client2 = new MockKwinClient(
        2,
        "app2",
        "Application 2",
        new MockQmlRect(14, 24, 400, 400),
    );

    workspaceMock.createWindow(client1);
    workspaceMock.createWindow(client2);
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

    const client1 = new MockKwinClient(
        1,
        "app1",
        "Application 1",
        new MockQmlRect(10, 20, 300, 200),
    );

    const client2 = new MockKwinClient(
        2,
        "app2",
        "Application 2",
        new MockQmlRect(14, 24, 400, 400),
    );

    workspaceMock.createWindow(client1);
    workspaceMock.createWindow(client2);
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
