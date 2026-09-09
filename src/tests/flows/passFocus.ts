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
});

tests.register("Pass focus (no gaps, full-width windows)", 100, () => {
    // Regression test for https://github.com/peterfajdiga/karousel/issues/136:
    // With no gaps and margins, the neighbors of a full-width window lie entirely off-screen,
    // so KWin activates the desktop window when the full-width window gets closed.
    const config = getDefaultConfig();
    config.gapsOuterTop = 0;
    config.gapsOuterBottom = 0;
    config.gapsOuterLeft = 0;
    config.gapsOuterRight = 0;
    config.gapsInnerHorizontal = 0;
    config.gapsInnerVertical = 0;
    const { workspaceMock } = init(config);

    const [client0, client1, client2] = workspaceMock.createClientsWithWidths(screen.width, screen.width, screen.width);
    workspaceMock.activeWindow = client1;
    Assert.equal(workspaceMock.activeWindow, client1);

    workspaceMock.removeWindow(client1);
    Assert.equal(workspaceMock.activeWindow, client0);

    workspaceMock.removeWindow(client0);
    Assert.equal(workspaceMock.activeWindow, client2);

    workspaceMock.removeWindow(client2);
    Assert.equal(workspaceMock.activeWindow, desktopWindow);
});

tests.register("Pass focus on minimize (no gaps, full-width windows)", 100, () => {
    const config = getDefaultConfig();
    config.gapsOuterTop = 0;
    config.gapsOuterBottom = 0;
    config.gapsOuterLeft = 0;
    config.gapsOuterRight = 0;
    config.gapsInnerHorizontal = 0;
    config.gapsInnerVertical = 0;
    const { workspaceMock } = init(config);

    const [client0, client1, client2] = workspaceMock.createClientsWithWidths(screen.width, screen.width, screen.width);
    workspaceMock.activeWindow = client1;

    client1.minimized = true;
    Assert.equal(workspaceMock.activeWindow, client0);

    client0.minimized = true;
    Assert.equal(workspaceMock.activeWindow, client2);

    client2.minimized = true;
    Assert.equal(workspaceMock.activeWindow, desktopWindow);
});
