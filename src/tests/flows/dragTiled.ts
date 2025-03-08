tests.register("Drag tiled window, untile", 20, () => {
    const config = getDefaultConfig();
    config.untileOnDrag = true;
    const { qtMock, workspaceMock, world } = init(config);
    const clientManager = getClientManager(world);

    const [client0, client1] = workspaceMock.createClients(2);
    Assert.tiledClient(clientManager, client0);
    Assert.tiledClient(clientManager, client1);
    Assert.grid(config, tilingArea, 100, [[client0], [client1]], true);

    workspaceMock.moveWindow(client0, new MockQmlPoint(10, 10));
    Assert.notTiledClient(clientManager, client0);
    Assert.tiledClient(clientManager, client1);
    Assert.grid(config, tilingArea, 100, [[client1]], true);
});

tests.register("Drag tiled window, keep tiled", 20, () => {
    const config = getDefaultConfig();
    config.untileOnDrag = false;
    const { qtMock, workspaceMock, world } = init(config);
    const clientManager = getClientManager(world);

    const [client0, client1] = workspaceMock.createClients(2);
    Assert.tiledClient(clientManager, client0);
    Assert.tiledClient(clientManager, client1);
    Assert.grid(config, tilingArea, 100, [[client0], [client1]], true);

    const move = new MockQmlPoint(10, 10);
    workspaceMock.moveWindow(client0, move, move, move, move, move, move, move, move, move); // many moves in order to trigger externalFrameGeometryChangedRateLimiter
    Assert.tiledClient(clientManager, client0);
    Assert.tiledClient(clientManager, client1);
    Assert.grid(config, tilingArea, 100, [[client0], [client1]], true);
});
