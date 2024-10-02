tests.register("Pin", 20, () => {
    const { qtMock, workspaceMock } = initMocks();
    const config = getDefaultConfig();
    const world = new World(config);

    const screenFull = new MockQmlRect(0, 0, screenWidth, screenHeight);
    const screenHalfLeft = new MockQmlRect(0, 0, screenWidth/2, screenHeight);
    const screenHalfRight = new MockQmlRect(screenWidth/2, 0, screenWidth/2, screenHeight);

    const tiled1 = new MockKwinClient(
        1,
        "app1",
        "Application 1",
        new MockQmlRect(10, 20, 100, 200),
    );

    const tiled2 = new MockKwinClient(
        2,
        "app2",
        "Application 2",
        new MockQmlRect(10, 20, 100, 200),
    );

    const pinned = new MockKwinClient(
        3,
        "browser",
        "Documentation - Browser",
        new MockQmlRect(10, 20, 100, 200),
    );

    workspaceMock.createWindow(pinned);
    workspaceMock.createWindow(tiled1);
    workspaceMock.createWindow(tiled2);
    assertGrid(config, screenFull, [ [pinned], [tiled1], [tiled2] ]);

    pinned.pin(screenHalfLeft);
    assertRectEqual(pinned.frameGeometry, screenHalfLeft);
    assertGrid(config, screenHalfRight, [ [tiled1], [tiled2] ]);

    pinned.pin(screenHalfRight);
    assertRectEqual(pinned.frameGeometry, screenHalfRight);
    assertGrid(config, screenHalfLeft, [ [tiled1], [tiled2] ]);

    pinned.unpin();
    assertRectEqual(pinned.frameGeometry, screenHalfRight);
    assertGrid(config, screenFull, [ [tiled1], [tiled2] ]);

    pinned.pin(screenHalfRight);
    assertRectEqual(pinned.frameGeometry, screenHalfRight);
    assertGrid(config, screenHalfLeft, [ [tiled1], [tiled2] ]);

    pinned.minimized = true;
    assertGrid(config, screenFull, [ [tiled1], [tiled2] ]);

    pinned.minimized = false;
    assertRectEqual(pinned.frameGeometry, screenHalfRight);
    assertGrid(config, screenHalfLeft, [ [tiled1], [tiled2] ]);

    workspaceMock.activeWindow = pinned;
    qtMock.fireShortcut("karousel-window-toggle-floating");
    assert(pinned.tile === null);
    pinned.frameGeometry = new MockQmlRect(10, 20, 100, 200); // This is needed because the window's preferredWidth can change when pinning, because frameGeometryChanged can fire before tileChanged. TODO: Ensure pinned window keeps its preferredWidth.
    assertGrid(config, screenFull, [ [tiled1], [tiled2], [pinned] ]);
});
