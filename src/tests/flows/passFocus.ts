tests.register("Pass focus", 1, () => {
    const config = getDefaultConfig();
    const { qtMock, workspaceMock, world } = init(config);

    const [client0, client1, client2, client3, client4] = workspaceMock.createClients(5);
    workspaceMock.activeWindow = client3;

    workspaceMock.removeWindow(client3);
    Assert.equal(workspaceMock.activeWindow, client2);

    qtMock.fireShortcut("karousel-column-move-to-desktop-2");
    Assert.equal(workspaceMock.activeWindow, client1);
});
