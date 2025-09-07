tests.register("Move and follow window to desktop", 20, () => {
    // This tests the Kwin shortcuts for moving windows to adjacent desktops.

    const config = getDefaultConfig();
    const { qtMock, workspaceMock, world } = init(config);

    const [client0, client1] = workspaceMock.createClients(2);
    client1.moveAndFollowToDesktop(workspaceMock.desktops[1], workspaceMock);
    Assert.equal(workspaceMock.activeWindow, client1);
});
