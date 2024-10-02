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

    function testLayout(shortcutName: string, grid: KwinClient[][]) {
        qtMock.fireShortcut(shortcutName);
        const screen = new MockQmlRect(0, 0, screenWidth, screenHeight);
        assertGrid(config, screen, grid, 1);
    }

    function testFocus(shortcutName: string, expectedFocus: KwinClient) {
        qtMock.fireShortcut(shortcutName);
        assert(workspaceMock.activeWindow === expectedFocus, `wrong activeWindow: ${workspaceMock.activeWindow?.pid}`, 1);
    };

    testLayout("karousel-column-move-right",       [ [client1], [client2], [client3] ]);

    testLayout("karousel-window-move-left",        [ [client1],    [client2,client3] ]);
    testLayout("karousel-window-move-left",        [ [client1], [client3], [client2] ]);
    testLayout("karousel-window-move-left",        [ [client1,client3],    [client2] ]);
    testFocus("karousel-focus-right", client2);
    testLayout("karousel-window-move-left",        [    [client1,client3,client2]    ]);
    testLayout("karousel-window-move-left",        [ [client2],    [client1,client3] ]);
    testLayout("karousel-window-move-left",        [ [client2],    [client1,client3] ]);
    testFocus("karousel-focus-2", client3);
    testFocus("karousel-focus-up", client1);
    testLayout("karousel-column-move-left",        [ [client1,client3],    [client2] ]);
    testLayout("karousel-window-move-right",       [ [client3], [client1], [client2] ]);

    testFocus("karousel-focus-3", client2);
    testLayout("karousel-window-move-start",       [ [client2], [client3], [client1] ]);
    testLayout("karousel-window-move-to-column-3", [ [client3],    [client1,client2] ]);
    testLayout("karousel-column-move-left",        [ [client1,client2],    [client3] ]);
    testLayout("karousel-column-move-end",         [ [client3],    [client1,client2] ]);
    testLayout("karousel-column-move-to-column-1", [ [client1,client2],    [client3] ]);
    testLayout("karousel-column-move-right",       [ [client3],    [client1,client2] ]);

    testLayout("karousel-window-move-previous",    [ [client3],    [client2,client1] ]);
    testLayout("karousel-window-move-previous",    [ [client3], [client2], [client1] ]);
    testLayout("karousel-window-move-previous",    [ [client3,client2],    [client1] ]);
    testLayout("karousel-window-move-previous",    [ [client2,client3],    [client1] ]);
    testLayout("karousel-window-move-previous",    [ [client2], [client3], [client1] ]);
    testLayout("karousel-window-move-previous",    [ [client2], [client3], [client1] ]);
    testLayout("karousel-window-move-next",        [ [client2,client3],    [client1] ]);
    testLayout("karousel-window-move-next",        [ [client3,client2],    [client1] ]);
    testLayout("karousel-window-move-next",        [ [client3], [client2], [client1] ]);
    testLayout("karousel-window-move-next",        [ [client3],    [client2,client1] ]);
    testLayout("karousel-window-move-next",        [ [client3],    [client1,client2] ]);
    testLayout("karousel-window-move-next",        [ [client3], [client1], [client2] ]);
    testLayout("karousel-window-move-next",        [ [client3], [client1], [client2] ]);
    testLayout("karousel-window-move-left",        [ [client3],    [client1,client2] ]);

    const col1Win1 = client3;
    const col2Win1 = client1;
    const col2Win2 = client2;

    testFocus("karousel-focus-up", col2Win1);
    testFocus("karousel-focus-up", col2Win1);
    testFocus("karousel-focus-down", col2Win2);
    testFocus("karousel-focus-left", col1Win1);
    testFocus("karousel-focus-left", col1Win1);
    testFocus("karousel-focus-right", col2Win2);
    testFocus("karousel-focus-right", col2Win2);

    testFocus("karousel-focus-2", col2Win2);
    testFocus("karousel-focus-1", col1Win1);
    testFocus("karousel-focus-2", col2Win2);
    testFocus("karousel-focus-start", col1Win1);
    testFocus("karousel-focus-end", col2Win2);

    testFocus("karousel-focus-up", col2Win1);
    testFocus("karousel-focus-left", col1Win1);
    testFocus("karousel-focus-right", col2Win1);
    testFocus("karousel-focus-2", col2Win1);
    testFocus("karousel-focus-1", col1Win1);
    testFocus("karousel-focus-2", col2Win1);
    testFocus("karousel-focus-start", col1Win1);
    testFocus("karousel-focus-end", col2Win1);

    testFocus("karousel-focus-down", col2Win2);
    testFocus("karousel-focus-start", col1Win1);
    testFocus("karousel-focus-next", col2Win1);
    testFocus("karousel-focus-next", col2Win2);
    testFocus("karousel-focus-next", col2Win2);
    testFocus("karousel-focus-previous", col2Win1);
    testFocus("karousel-focus-previous", col1Win1);
    testFocus("karousel-focus-previous", col1Win1);
});
