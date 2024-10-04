tests.register("Preset Widths default", 1, () => {
    const { qtMock, workspaceMock } = initMocks();
    const config = getDefaultConfig();
    const world = new World(config);

    const maxWidth = screenWidth - config.gapsOuterLeft - config.gapsOuterRight;
    const halfWidth = maxWidth/2 - config.gapsInnerHorizontal/2;

    const kwinClient = new MockKwinClient(
        1,
        "app1",
        "Application 1",
        new MockQmlRect(10, 20, 300, 200),
    );

    function getRect(columnWidth: number) {
        return new MockQmlRect(
            (screenWidth - columnWidth) / 2,
            config.gapsOuterTop,
            columnWidth,
            screenHeight - config.gapsOuterTop - config.gapsOuterBottom,
        );
    }

    workspaceMock.createWindow(kwinClient);
    Assert.equalRects(kwinClient.frameGeometry, getRect(300));

    qtMock.fireShortcut("karousel-cycle-preset-widths");
    Assert.equalRects(kwinClient.frameGeometry, getRect(maxWidth));

    qtMock.fireShortcut("karousel-cycle-preset-widths");
    Assert.equalRects(kwinClient.frameGeometry, getRect(halfWidth));

    qtMock.fireShortcut("karousel-cycle-preset-widths");
    Assert.equalRects(kwinClient.frameGeometry, getRect(maxWidth));
});

tests.register("Preset Widths custom", 1, () => {
    const { qtMock, workspaceMock } = initMocks();
    const config = getDefaultConfig();
    config.presetWidths = "500px, 250px, 100px, 50%";
    const world = new World(config);

    const maxWidth = screenWidth - config.gapsOuterLeft - config.gapsOuterRight;
    const halfWidth = maxWidth/2 - config.gapsInnerHorizontal/2;

    const kwinClient = new MockKwinClient(
        1,
        "app1",
        "Application 1",
        new MockQmlRect(10, 20, 300, 200),
    );

    function getRect(columnWidth: number) {
        return new MockQmlRect(
            (screenWidth - columnWidth) / 2,
            config.gapsOuterTop,
            columnWidth,
            screenHeight - config.gapsOuterTop - config.gapsOuterBottom,
        );
    }

    workspaceMock.createWindow(kwinClient);
    Assert.equalRects(kwinClient.frameGeometry, getRect(300));

    qtMock.fireShortcut("karousel-cycle-preset-widths");
    Assert.equalRects(kwinClient.frameGeometry, getRect(250));

    qtMock.fireShortcut("karousel-cycle-preset-widths");
    Assert.equalRects(kwinClient.frameGeometry, getRect(100));

    qtMock.fireShortcut("karousel-cycle-preset-widths");
    Assert.equalRects(kwinClient.frameGeometry, getRect(500));

    qtMock.fireShortcut("karousel-cycle-preset-widths");
    Assert.equalRects(kwinClient.frameGeometry, getRect(halfWidth));

    qtMock.fireShortcut("karousel-cycle-preset-widths");
    Assert.equalRects(kwinClient.frameGeometry, getRect(250));
});

tests.register("Preset Widths fill screen uniform", 1, () => {
    for (let nColumns = 1; nColumns < 10; nColumns++) {
        const { qtMock, workspaceMock } = initMocks();
        const config = getDefaultConfig();
        config.presetWidths = String(1 / nColumns);
        const world = new World(config);

        let firstClient, lastClient;
        for (let i = 0; i < nColumns; i++) {
            const kwinClient = new MockKwinClient(
                i,
                "app" + i,
                "Application " + 1,
                new MockQmlRect(10, 20, 300, 200),
            );
            if (i === 0) {
                firstClient = kwinClient;
            }
            if (i === nColumns-1) {
                lastClient = kwinClient;
            }
            workspaceMock.createWindow(kwinClient);
            qtMock.fireShortcut("karousel-cycle-preset-widths");
        }

        const left = config.gapsOuterLeft;
        const right = screenWidth - config.gapsOuterRight;
        const maxLeftoverPx = nColumns - 1;
        const eps = Math.ceil(maxLeftoverPx / 2);
        Assert.between(firstClient!.frameGeometry.left, left, left+eps, { message: `nColumns: ${nColumns}` });
        Assert.between(lastClient!.frameGeometry.right, right-eps, right, { message: `nColumns: ${nColumns}` });
    }
});

tests.register("Preset Widths fill screen non-uniform", 1, () => {
    const { qtMock, workspaceMock } = initMocks();
    const config = getDefaultConfig();
    config.presetWidths = String("50%, 25%");
    const world = new World(config);

    const clientThin1 = new MockKwinClient(
        1,
        "app1",
        "Application 1",
        new MockQmlRect(10, 20, 300, 200),
    );
    workspaceMock.createWindow(clientThin1);
    qtMock.fireShortcut("karousel-cycle-preset-widths");

    const clientThin2 = new MockKwinClient(
        2,
        "app2",
        "Application 2",
        new MockQmlRect(10, 20, 300, 200),
    );
    workspaceMock.createWindow(clientThin2);
    qtMock.fireShortcut("karousel-cycle-preset-widths");

    const clientWide = new MockKwinClient(
        10,
        "app10",
        "Application 10",
        new MockQmlRect(10, 20, 410, 200),
    );
    workspaceMock.createWindow(clientWide);
    qtMock.fireShortcut("karousel-cycle-preset-widths");

    const maxWidth = screenWidth - config.gapsOuterLeft - config.gapsOuterRight;
    const halfWidth = maxWidth/2 - config.gapsInnerHorizontal/2;
    const quarterWidth = halfWidth/2 - config.gapsInnerHorizontal/2;
    const height = screenHeight - config.gapsOuterTop - config.gapsOuterBottom;
    const left1 = config.gapsOuterLeft;
    const left2 = left1 + config.gapsInnerHorizontal + quarterWidth;
    const left3 = left2 + config.gapsInnerHorizontal + quarterWidth;

    Assert.rect(clientThin1.frameGeometry, left1, config.gapsOuterTop, quarterWidth, height);
    Assert.rect(clientThin2.frameGeometry, left2, config.gapsOuterTop, quarterWidth, height);
    Assert.rect(clientWide.frameGeometry, left3, config.gapsOuterTop, halfWidth, height);
    Assert.equal(clientWide.frameGeometry.right, screenWidth - config.gapsOuterRight);
});
