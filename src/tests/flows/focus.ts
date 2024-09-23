tests.register("Move focus", 1, () => {
    const { qtMock, workspaceMock } = initMocks();
    const config = getDefaultConfig();
    const world = new World(config);

    const col1Win1 = new MockKwinClient(
        1,
        "app1",
        "Application 1",
        new MockQmlRect(10, 10, 100, 200),
    );

    const col2Win1 = new MockKwinClient(
        2,
        "app2",
        "Application 2",
        new MockQmlRect(20, 20, 100, 200),
    );

    const col2Win2 = new MockKwinClient(
        3,
        "app3",
        "Application 3",
        new MockQmlRect(40, 40, 100, 200),
    );

    workspaceMock.createWindow(col1Win1);
    workspaceMock.createWindow(col2Win1);
    workspaceMock.createWindow(col2Win2);
    world.do((clientManager, desktopManager) => {
        assert(clientManager.hasClient(col1Win1));
        assert(clientManager.hasClient(col2Win1));
        assert(clientManager.hasClient(col2Win2));
    });
    assert(workspaceMock.activeWindow === col2Win2);

    qtMock.fireShortcut("karousel-window-move-left");
    const columnsWidth = 2 * 100 + config.gapsInnerHorizontal;
    const column1LeftX = screenWidth/2 - columnsWidth/2;
    const column2LeftX = column1LeftX + 100 + config.gapsInnerHorizontal;
    const columnHeight = screenHeight - config.gapsOuterTop - config.gapsOuterBottom;
    const windowHeight = (columnHeight - config.gapsInnerVertical)/2;
    const window1TopY = config.gapsOuterTop;
    const window2TopY = window1TopY + windowHeight + config.gapsInnerVertical;
    assertRect(col1Win1.frameGeometry, column1LeftX, window1TopY, 100, columnHeight);
    assertRect(col2Win1.frameGeometry, column2LeftX, window1TopY, 100, windowHeight);
    assertRect(col2Win2.frameGeometry, column2LeftX, window2TopY, 100, windowHeight);

    function assertFocus(shortcutName: string, expectedFocus: KwinClient) {
        qtMock.fireShortcut(shortcutName);
        assert(workspaceMock.activeWindow === expectedFocus, `wrong activeWindow: ${workspaceMock.activeWindow?.pid}`, 1);
    };

    assertFocus("karousel-focus-up", col2Win1);
    assertFocus("karousel-focus-up", col2Win1);
    assertFocus("karousel-focus-down", col2Win2);
    assertFocus("karousel-focus-left", col1Win1);
    assertFocus("karousel-focus-left", col1Win1);
    assertFocus("karousel-focus-right", col2Win2);
    assertFocus("karousel-focus-right", col2Win2);

    assertFocus("karousel-focus-2", col2Win2);
    assertFocus("karousel-focus-1", col1Win1);
    assertFocus("karousel-focus-2", col2Win2);
    assertFocus("karousel-focus-start", col1Win1);
    assertFocus("karousel-focus-end", col2Win2);

    assertFocus("karousel-focus-up", col2Win1);
    assertFocus("karousel-focus-left", col1Win1);
    assertFocus("karousel-focus-right", col2Win1);
    assertFocus("karousel-focus-2", col2Win1);
    assertFocus("karousel-focus-1", col1Win1);
    assertFocus("karousel-focus-2", col2Win1);
    assertFocus("karousel-focus-start", col1Win1);
    assertFocus("karousel-focus-end", col2Win1);
});
