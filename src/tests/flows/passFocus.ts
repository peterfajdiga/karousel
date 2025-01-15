tests.register("Pass focus", 10, () => {
    const config = getDefaultConfig();
    const { qtMock, workspaceMock, world } = init(config);

    const [client0, client1, client2, client3, client4] = workspaceMock.createClients(5);
    workspaceMock.activeWindow = client3;

    workspaceMock.removeWindow(client3);
    Assert.equal(workspaceMock.activeWindow, client2);

    qtMock.fireShortcut("karousel-column-move-to-desktop-2");
    Assert.equal(workspaceMock.activeWindow, client1);

    client1.desktops = [workspaceMock.desktops[1]];
    Assert.equal(workspaceMock.activeWindow, client0);
});
