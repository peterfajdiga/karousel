tests.register("Focus and move windows", 1, () => {
    const { qtMock, workspaceMock } = initMocks();
    const config = getDefaultConfig();
    const world = new World(config);

    const client1 = new MockKwinClient(
        1,
        "app1",
        "Application 1",
        new MockQmlRect(10, 10, 100, 200),
    );

    const client2 = new MockKwinClient(
        2,
        "app2",
        "Application 2",
        new MockQmlRect(20, 20, 100, 200),
    );

    const client3 = new MockKwinClient(
        3,
        "app3",
        "Application 3",
        new MockQmlRect(40, 40, 100, 200),
    );

    workspaceMock.createWindow(client1);
    workspaceMock.createWindow(client2);
    workspaceMock.createWindow(client3);
    world.do((clientManager, desktopManager) => {
        assert(clientManager.hasClient(client1));
        assert(clientManager.hasClient(client2));
        assert(clientManager.hasClient(client3));
    });
    assert(workspaceMock.activeWindow === client3);

    const columnHeight = screenHeight - config.gapsOuterTop - config.gapsOuterBottom;
    function getRectInGrid(column: number, window: number, nColumns: number, nWindows: number) {
        const columnsWidth = nColumns * 100 + (nColumns-1) * config.gapsInnerHorizontal;
        const windowHeight = (columnHeight - config.gapsInnerVertical * (nWindows-1)) / nWindows;
        return new MockQmlRect(
            column * (100 + config.gapsInnerHorizontal) + (screenWidth-columnsWidth) / 2,
            config.gapsOuterTop + (windowHeight + config.gapsInnerVertical) * window,
            100,
            (columnHeight - config.gapsInnerVertical * (nWindows-1)) / nWindows,
        );
    }

    function assertFocus(shortcutName: string, expectedFocus: KwinClient) {
        qtMock.fireShortcut(shortcutName);
        assert(workspaceMock.activeWindow === expectedFocus, `wrong activeWindow: ${workspaceMock.activeWindow?.pid}`, 1);
    };

    assertRectEqual(client1.frameGeometry, getRectInGrid(0, 0, 3, 1));
    assertRectEqual(client2.frameGeometry, getRectInGrid(1, 0, 3, 1));
    assertRectEqual(client3.frameGeometry, getRectInGrid(2, 0, 3, 1));

    qtMock.fireShortcut("karousel-window-move-left");
    assertRectEqual(client1.frameGeometry, getRectInGrid(0, 0, 2, 1));
    assertRectEqual(client2.frameGeometry, getRectInGrid(1, 0, 2, 2));
    assertRectEqual(client3.frameGeometry, getRectInGrid(1, 1, 2, 2));

    qtMock.fireShortcut("karousel-window-move-left");
    assertRectEqual(client1.frameGeometry, getRectInGrid(0, 0, 3, 1));
    assertRectEqual(client3.frameGeometry, getRectInGrid(1, 0, 3, 1));
    assertRectEqual(client2.frameGeometry, getRectInGrid(2, 0, 3, 1));

    qtMock.fireShortcut("karousel-window-move-left");
    assertRectEqual(client1.frameGeometry, getRectInGrid(0, 0, 2, 2));
    assertRectEqual(client3.frameGeometry, getRectInGrid(0, 1, 2, 2));
    assertRectEqual(client2.frameGeometry, getRectInGrid(1, 0, 2, 1));

    qtMock.fireShortcut("karousel-window-move-left");
    assertRectEqual(client3.frameGeometry, getRectInGrid(0, 0, 3, 1));
    assertRectEqual(client1.frameGeometry, getRectInGrid(1, 0, 3, 1));
    assertRectEqual(client2.frameGeometry, getRectInGrid(2, 0, 3, 1));

    assertFocus("karousel-focus-3", client2);
    qtMock.fireShortcut("karousel-window-move-start");
    assertRectEqual(client2.frameGeometry, getRectInGrid(0, 0, 3, 1));
    assertRectEqual(client3.frameGeometry, getRectInGrid(1, 0, 3, 1));
    assertRectEqual(client1.frameGeometry, getRectInGrid(2, 0, 3, 1));

    qtMock.fireShortcut("karousel-window-move-to-column-3");
    assertRectEqual(client3.frameGeometry, getRectInGrid(0, 0, 2, 1));
    assertRectEqual(client1.frameGeometry, getRectInGrid(1, 0, 2, 2));
    assertRectEqual(client2.frameGeometry, getRectInGrid(1, 1, 2, 2));

    qtMock.fireShortcut("karousel-column-move-left");
    assertRectEqual(client1.frameGeometry, getRectInGrid(0, 0, 2, 2));
    assertRectEqual(client2.frameGeometry, getRectInGrid(0, 1, 2, 2));
    assertRectEqual(client3.frameGeometry, getRectInGrid(1, 0, 2, 1));

    qtMock.fireShortcut("karousel-column-move-end");
    assertRectEqual(client3.frameGeometry, getRectInGrid(0, 0, 2, 1));
    assertRectEqual(client1.frameGeometry, getRectInGrid(1, 0, 2, 2));
    assertRectEqual(client2.frameGeometry, getRectInGrid(1, 1, 2, 2));

    qtMock.fireShortcut("karousel-column-move-to-column-1");
    assertRectEqual(client1.frameGeometry, getRectInGrid(0, 0, 2, 2));
    assertRectEqual(client2.frameGeometry, getRectInGrid(0, 1, 2, 2));
    assertRectEqual(client3.frameGeometry, getRectInGrid(1, 0, 2, 1));

    qtMock.fireShortcut("karousel-column-move-right");
    assertRectEqual(client3.frameGeometry, getRectInGrid(0, 0, 2, 1));
    assertRectEqual(client1.frameGeometry, getRectInGrid(1, 0, 2, 2));
    assertRectEqual(client2.frameGeometry, getRectInGrid(1, 1, 2, 2));

    const col1Win1 = client3;
    const col2Win1 = client1;
    const col2Win2 = client2;

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
