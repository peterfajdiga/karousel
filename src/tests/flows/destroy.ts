tests.register("Destroy", 5, () => {
    const config = getDefaultConfig();
    const { qtMock, workspaceMock, world } = init(config);

    const [client0, client1, client2] = workspaceMock.createClientsWithWidths(600, 600, 600);
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.hasClient(client0));
        Assert.assert(clientManager.hasClient(client1));
        Assert.assert(clientManager.hasClient(client2));
    });
    workspaceMock.activeWindow = client1;
    Assert.notFullyVisible(client0.getActualFrameGeometry());
    Assert.fullyVisible(client1.getActualFrameGeometry());
    Assert.notFullyVisible(client2.getActualFrameGeometry());

    // client0 is expected to move onto the screen (left edge)
    const expectedFrame0 = client1.getActualFrameGeometry().clone();
    expectedFrame0.x = 0;

    // client1 is expected to stay put
    const expectedFrame1 = client1.getActualFrameGeometry().clone();

    // client2 is expected to move onto the screen (right edge)
    const expectedFrame2 = client2.getActualFrameGeometry().clone();
    expectedFrame2.x = screen.width - expectedFrame2.width;

    world.destroy();
    Assert.equalRects(client0.getActualFrameGeometry(), expectedFrame0);
    Assert.equalRects(client1.getActualFrameGeometry(), expectedFrame1);
    Assert.equalRects(client2.getActualFrameGeometry(), expectedFrame2);
});
