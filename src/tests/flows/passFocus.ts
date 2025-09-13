tests.register("Pass focus", 100, () => {
    const config = getDefaultConfig();
    const { qtMock, workspaceMock, world } = init(config);

    const [client0, client1a, client1b, client1c, client4, client5, client6] = workspaceMock.createClients(7);
    workspaceMock.activeWindow = client1b;
    qtMock.fireShortcut("karousel-window-move-left");
    workspaceMock.activeWindow = client1c;
    qtMock.fireShortcut("karousel-window-move-left");
    workspaceMock.activeWindow = client1b;
    workspaceMock.activeWindow = client5;

    function removeWindow(client: MockKwinClient) {
        runOneOf(
            () => workspaceMock.removeWindow(client),
            () => client.desktops = [workspaceMock.desktops[1]],
        );
    }

    removeWindow(client5);
    Assert.equal(workspaceMock.activeWindow, client4);

    qtMock.fireShortcut("karousel-column-move-to-desktop-2");
    Assert.equal(workspaceMock.activeWindow, client1b);

    removeWindow(client1b);
    Assert.equal(workspaceMock.activeWindow, client1a);

    removeWindow(client1a);
    Assert.equal(workspaceMock.activeWindow, client1c);

    removeWindow(client1c);
    Assert.equal(workspaceMock.activeWindow, client0);

    removeWindow(client0);
    Assert.equal(workspaceMock.activeWindow, client6);

    removeWindow(client6);
    Assert.equal(workspaceMock.activeWindow, null);
});
