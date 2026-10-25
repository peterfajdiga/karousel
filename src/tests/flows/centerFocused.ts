tests.register("Center focused", 5, () => {
    const config = getDefaultConfig();
    const { qtMock, workspaceMock, world } = init(config);

    const [client0, client1, client2] = workspaceMock.createClientsWithWidths(300, 152, 300);
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.hasClient(client0));
        Assert.assert(clientManager.hasClient(client1));
        Assert.assert(clientManager.hasClient(client2));
    });
    Assert.assert(workspaceMock.activeWindow === client2);
    Assert.columnsFillTilingArea([client0, client1, client2]);

    // center client2
    qtMock.fireShortcut("karousel-grid-scroll-focused");
    Assert.centered(config, tilingArea, client2);
    Assert.fullyVisible(client1.getActualFrameGeometry());
    Assert.fullyVisible(client2.getActualFrameGeometry());

    // undo center client2
    qtMock.fireShortcut("karousel-grid-scroll-focused");
    Assert.columnsFillTilingArea([client0, client1, client2]);

    // center client2
    qtMock.fireShortcut("karousel-grid-scroll-focused");
    Assert.centered(config, tilingArea, client2);
    Assert.fullyVisible(client1.getActualFrameGeometry());
    Assert.fullyVisible(client2.getActualFrameGeometry());

    // focus client1 (no scrolling should occur)
    qtMock.fireShortcut("karousel-focus-left");
    Assert.centered(config, tilingArea, client2, { message: "No scrolling should have occured" });
    Assert.fullyVisible(client1.getActualFrameGeometry());
    Assert.fullyVisible(client2.getActualFrameGeometry());

    // center client1
    qtMock.fireShortcut("karousel-grid-scroll-focused");
    Assert.columnsFillTilingArea([client0, client1, client2]);

    // undo center client1 (no scrolling should occur, because all clients are already visible and centered)
    qtMock.fireShortcut("karousel-grid-scroll-focused");
    Assert.columnsFillTilingArea([client0, client1, client2]);
});

tests.register("Center remaining windows on close", 10, () => {
    const config = getDefaultConfig();
    const { workspaceMock } = init(config);

    const [client0, client1] = workspaceMock.createClientsWithWidths(200, 200);
    Assert.grid(config, tilingArea, 200, [[client0], [client1]], true);

    workspaceMock.removeWindow(client1);
    Assert.centered(config, tilingArea, client0);
});
