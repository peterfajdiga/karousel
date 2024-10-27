tests.register("LazyScroller", 20, () => {
    const config = getDefaultConfig();
    config.scrollingLazy = true;
    config.scrollingCentered = false;
    config.scrollingGrouped = false;
    const { qtMock, workspaceMock, world } = init(config);

    const [client1] = workspaceMock.createClientsWithWidths(300);
    Assert.grid(config, screen, 300, [[client1]], true);

    const [client2] = workspaceMock.createClientsWithWidths(300);
    Assert.grid(config, screen, 300, [[client1], [client2]], true);

    const [client3] = workspaceMock.createClientsWithWidths(300);
    Assert.grid(config, screen, 300, [[client1], [client2], [client3]], false);
    Assert.equal(client3.frameGeometry.right, tilingArea.right);

    runOneOf(
        () => workspaceMock.activeWindow = client2,
        () => qtMock.fireShortcut("karousel-focus-2"),
        () => qtMock.fireShortcut("karousel-focus-left"),
    );
    Assert.grid(config, screen, 300, [[client1], [client2], [client3]], false);
    Assert.equal(client3.frameGeometry.right, tilingArea.right);

    runOneOf(
        () => workspaceMock.activeWindow = client1,
        () => qtMock.fireShortcut("karousel-focus-1"),
        () => qtMock.fireShortcut("karousel-focus-left"),
        () => qtMock.fireShortcut("karousel-focus-start"),
    );
    workspaceMock.activeWindow = client1;
    Assert.grid(config, screen, 300, [[client1], [client2], [client3]], false);
    Assert.equal(client1.frameGeometry.left, tilingArea.left);
});
