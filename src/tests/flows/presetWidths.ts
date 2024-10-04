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
    assertRectEqual(kwinClient.frameGeometry, getRect(300));

    qtMock.fireShortcut("karousel-cycle-preset-widths");
    assertRectEqual(kwinClient.frameGeometry, getRect(maxWidth));

    qtMock.fireShortcut("karousel-cycle-preset-widths");
    assertRectEqual(kwinClient.frameGeometry, getRect(halfWidth));

    qtMock.fireShortcut("karousel-cycle-preset-widths");
    assertRectEqual(kwinClient.frameGeometry, getRect(maxWidth));
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
    assertRectEqual(kwinClient.frameGeometry, getRect(300));

    qtMock.fireShortcut("karousel-cycle-preset-widths");
    assertRectEqual(kwinClient.frameGeometry, getRect(250));

    qtMock.fireShortcut("karousel-cycle-preset-widths");
    assertRectEqual(kwinClient.frameGeometry, getRect(100));

    qtMock.fireShortcut("karousel-cycle-preset-widths");
    assertRectEqual(kwinClient.frameGeometry, getRect(500));

    qtMock.fireShortcut("karousel-cycle-preset-widths");
    assertRectEqual(kwinClient.frameGeometry, getRect(halfWidth));

    qtMock.fireShortcut("karousel-cycle-preset-widths");
    assertRectEqual(kwinClient.frameGeometry, getRect(250));
});
