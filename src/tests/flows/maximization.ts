tests.register("Maximization", 100, () => {
    const { qtMock, workspaceMock } = initMocks();
    const config = getDefaultConfig();
    const world = new World(config);

    const kwinClient = new MockKwinClient(
        1,
        "app1",
        "Application 1",
        new MockQmlRect(10, 20, 300, 200),
    );

    workspaceMock.createWindow(kwinClient);
    world.do((clientManager, desktopManager) => {
        Assert.truth(clientManager.hasClient(kwinClient));
    });

    const columnLeftX = screenWidth/2 - 300/2;
    const columnTopY = config.gapsOuterTop;
    const columnHeight = screenHeight - config.gapsOuterTop - config.gapsOuterBottom;
    Assert.rect(kwinClient.frameGeometry, columnLeftX, columnTopY, 300, columnHeight);

    kwinClient.fullScreen = true;
    Assert.rect(kwinClient.frameGeometry, 0, 0, screenWidth, screenHeight);

    kwinClient.fullScreen = false;
    Assert.rect(kwinClient.frameGeometry, columnLeftX, columnTopY, 300, columnHeight);

    kwinClient.setMaximize(true, true);
    Assert.rect(kwinClient.frameGeometry, 0, 0, screenWidth, screenHeight);

    kwinClient.setMaximize(true, false);
    Assert.rect(kwinClient.frameGeometry, columnLeftX, 0, 300, screenHeight);

    kwinClient.setMaximize(false, false);
    Assert.rect(kwinClient.frameGeometry, columnLeftX, columnTopY, 300, columnHeight);
});

tests.register("Maximize with transient", 100, () => {
    const { qtMock, workspaceMock } = initMocks();
    const config = getDefaultConfig();
    const world = new World(config);

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
        Assert.truth(clientManager.hasClient(parent));
    });

    runOneOf(
        () => parent.fullScreen = true,
        () => parent.setMaximize(true, true),
    );
    Assert.rect(parent.frameGeometry, 0, 0, screenWidth, screenHeight);

    workspaceMock.createWindow(child);
    world.do((clientManager, desktopManager) => {
        Assert.truth(clientManager.hasClient(child));
    });
    Assert.rect(child.frameGeometry, 14, 24, 50, 50);
    Assert.rect(parent.frameGeometry, 0, 0, screenWidth, screenHeight);
});

tests.register("Re-maximize disabled", 100, () => {
    const { qtMock, workspaceMock } = initMocks();
    const config = getDefaultConfig();
    config.reMaximize = false;
    const world = new World(config);

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
        Assert.truth(clientManager.hasClient(client1));
        Assert.truth(clientManager.hasClient(client2));
    });

    const columnsWidth = 300 + 400 + config.gapsInnerHorizontal;
    const column1LeftX = screenWidth/2 - columnsWidth/2;
    const column2LeftX = column1LeftX + 300 + config.gapsInnerHorizontal;
    const columnTopY = config.gapsOuterTop;
    const columnHeight = screenHeight - config.gapsOuterTop - config.gapsOuterBottom;
    Assert.rect(client1.frameGeometry, column1LeftX, columnTopY, 300, columnHeight);
    Assert.rect(client2.frameGeometry, column2LeftX, columnTopY, 400, columnHeight);

    runOneOf(
        () => client2.fullScreen = true,
        () => client2.setMaximize(true, true),
    );
    Assert.rect(client1.frameGeometry, column1LeftX, columnTopY, 300, columnHeight);
    Assert.rect(client2.frameGeometry, 0, 0, screenWidth, screenHeight);

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
    const { qtMock, workspaceMock } = initMocks();
    const config = getDefaultConfig();
    config.reMaximize = true;
    const world = new World(config);

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
        Assert.truth(clientManager.hasClient(client1));
        Assert.truth(clientManager.hasClient(client2));
    });

    const columnsWidth = 300 + 400 + config.gapsInnerHorizontal;
    const column1LeftX = screenWidth/2 - columnsWidth/2;
    const column2LeftX = column1LeftX + 300 + config.gapsInnerHorizontal;
    const columnTopY = config.gapsOuterTop;
    const columnHeight = screenHeight - config.gapsOuterTop - config.gapsOuterBottom;
    Assert.rect(client1.frameGeometry, column1LeftX, columnTopY, 300, columnHeight);
    Assert.rect(client2.frameGeometry, column2LeftX, columnTopY, 400, columnHeight);

    runOneOf(
        () => client2.fullScreen = true,
        () => client2.setMaximize(true, true),
    );
    Assert.rect(client1.frameGeometry, column1LeftX, columnTopY, 300, columnHeight);
    Assert.rect(client2.frameGeometry, 0, 0, screenWidth, screenHeight);

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
    Assert.rect(client2.frameGeometry, 0, 0, screenWidth, screenHeight);
});
