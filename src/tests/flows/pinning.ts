tests.register("Pin", 20, () => {
    const config = getDefaultConfig();
    const { qtMock, workspaceMock, world } = init(config);

    const screenHalfLeft = new MockQmlRect(0, 0, screen.width/2, screen.height);
    const screenHalfRight = new MockQmlRect(screen.width/2, 0, screen.width/2, screen.height);

    const [pinned, tiled1, tiled2] = workspaceMock.createClients(3);
    Assert.grid(config, screen, 100, [ [pinned], [tiled1], [tiled2] ], true);

    pinned.pin(screenHalfLeft);
    Assert.equalRects(pinned.frameGeometry, screenHalfLeft);
    Assert.grid(config, screenHalfRight, 100, [ [tiled1], [tiled2] ], true);

    pinned.pin(screenHalfRight);
    Assert.equalRects(pinned.frameGeometry, screenHalfRight);
    Assert.grid(config, screenHalfLeft, 100, [ [tiled1], [tiled2] ], true);

    pinned.unpin();
    Assert.equalRects(pinned.frameGeometry, screenHalfRight);
    Assert.grid(config, screen, 100, [ [tiled1], [tiled2] ], true);

    pinned.pin(screenHalfRight);
    Assert.equalRects(pinned.frameGeometry, screenHalfRight);
    Assert.grid(config, screenHalfLeft, 100, [ [tiled1], [tiled2] ], true);

    pinned.minimized = true;
    Assert.grid(config, screen, 100, [ [tiled1], [tiled2] ], true);

    pinned.minimized = false;
    Assert.equalRects(pinned.frameGeometry, screenHalfRight);
    Assert.grid(config, screenHalfLeft, 100, [ [tiled1], [tiled2] ], true);

    workspaceMock.activeWindow = pinned;
    qtMock.fireShortcut("karousel-window-toggle-floating");
    Assert.assert(pinned.tile === null);
    pinned.frameGeometry = new MockQmlRect(10, 20, 100, 200); // This is needed because the window's preferredWidth can change when pinning, because frameGeometryChanged can fire before tileChanged. TODO: Ensure pinned window keeps its preferredWidth.
    Assert.grid(config, screen, 100, [ [tiled1], [tiled2], [pinned] ], true);
});
