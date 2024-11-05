tests.register("tiledKeepBelow", 10, () => {
    const config = getDefaultConfig();
    config.tiledKeepBelow = true;
    config.floatingKeepAbove = false;
    const { qtMock, workspaceMock, world } = init(config);

    const pinGeometry = new MockQmlRect(0, 0, 200, screen.height);

    const [client] = workspaceMock.createClients(1);
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.findTiledWindow(client) !== null);
    });
    Assert.assert(client.keepBelow);
    Assert.assert(!client.keepAbove);

    qtMock.fireShortcut("karousel-window-toggle-floating");
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.findTiledWindow(client) === null);
    });
    Assert.assert(!client.keepBelow);
    Assert.assert(!client.keepAbove);

    client.pin(pinGeometry);
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.findTiledWindow(client) === null);
    });
    Assert.assert(!client.keepBelow);
    Assert.assert(!client.keepAbove);

    client.unpin();
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.findTiledWindow(client) === null);
    });
    Assert.assert(!client.keepBelow);
    Assert.assert(!client.keepAbove);

    qtMock.fireShortcut("karousel-window-toggle-floating");
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.findTiledWindow(client) !== null);
    });
    Assert.assert(client.keepBelow);
    Assert.assert(!client.keepAbove);

    client.pin(pinGeometry);
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.findTiledWindow(client) === null);
    });
    Assert.assert(!client.keepBelow);
    Assert.assert(!client.keepAbove);

    qtMock.fireShortcut("karousel-window-toggle-floating");
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.findTiledWindow(client) !== null);
    });
    Assert.assert(client.keepBelow);
    Assert.assert(!client.keepAbove);
});

tests.register("floatingKeepAbove", 10, () => {
    const config = getDefaultConfig();
    config.tiledKeepBelow = false;
    config.floatingKeepAbove = true;
    const { qtMock, workspaceMock, world } = init(config);

    const pinGeometry = new MockQmlRect(0, 0, 200, screen.height);

    const [client] = workspaceMock.createClients(1);
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.findTiledWindow(client) !== null);
    });
    Assert.assert(!client.keepBelow);
    Assert.assert(!client.keepAbove);

    qtMock.fireShortcut("karousel-window-toggle-floating");
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.findTiledWindow(client) === null);
    });
    Assert.assert(!client.keepBelow);
    Assert.assert(client.keepAbove);

    client.pin(pinGeometry);
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.findTiledWindow(client) === null);
    });
    Assert.assert(!client.keepBelow);
    Assert.assert(client.keepAbove);

    client.unpin();
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.findTiledWindow(client) === null);
    });
    Assert.assert(!client.keepBelow);
    Assert.assert(client.keepAbove);

    qtMock.fireShortcut("karousel-window-toggle-floating");
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.findTiledWindow(client) !== null);
    });
    Assert.assert(!client.keepBelow);
    Assert.assert(!client.keepAbove);

    client.pin(pinGeometry);
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.findTiledWindow(client) === null);
    });
    Assert.assert(!client.keepBelow);
    Assert.assert(client.keepAbove);

    qtMock.fireShortcut("karousel-window-toggle-floating");
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.findTiledWindow(client) !== null);
    });
    Assert.assert(!client.keepBelow);
    Assert.assert(!client.keepAbove);
});
