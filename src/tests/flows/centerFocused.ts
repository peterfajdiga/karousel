tests.register("Center focused", 1, () => {
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
    Assert.centered(config, screen, client2);
    Assert.fullyVisible(client1.frameGeometry);
    Assert.fullyVisible(client2.frameGeometry);

    // undo center client2
    qtMock.fireShortcut("karousel-grid-scroll-focused");
    Assert.columnsFillTilingArea([client0, client1, client2]);

    // center client2
    qtMock.fireShortcut("karousel-grid-scroll-focused");
    Assert.centered(config, screen, client2);
    Assert.fullyVisible(client1.frameGeometry);
    Assert.fullyVisible(client2.frameGeometry);

    // focus client1 (no scrolling should occur)
    qtMock.fireShortcut("karousel-focus-left");
    Assert.centered(config, screen, client2, { message: "No scrolling should have occured" });
    Assert.fullyVisible(client1.frameGeometry);
    Assert.fullyVisible(client2.frameGeometry);

    // center client1
    qtMock.fireShortcut("karousel-grid-scroll-focused");
    Assert.columnsFillTilingArea([client0, client1, client2]);

    // undo center client1 (no scrolling should occur, because all clients are already visible and centered)
    qtMock.fireShortcut("karousel-grid-scroll-focused");
    Assert.columnsFillTilingArea([client0, client1, client2]);
});
