tests.register("Column move to desktop", 10, () => {
    const config = getDefaultConfig();
    const { qtMock, workspaceMock, world } = init(config);

    function assertDesktop(desktop: KwinDesktop, clients: MockKwinClient[]) {
        for (const client of clients) {
            Assert.equalArrays(client.desktops, [desktop]);
        }
    }

    const desktop0 = workspaceMock.desktops[0];
    const desktop1 = workspaceMock.desktops[1];

    const [client0, client1a, client1b, client1c, client4, client5, client6] = workspaceMock.createClients(7);
    workspaceMock.activeWindow = client1b;
    qtMock.fireShortcut("karousel-window-move-left");
    workspaceMock.activeWindow = client1c;
    qtMock.fireShortcut("karousel-window-move-left");
    workspaceMock.activeWindow = client1b;
    // W1: 0, [1,*2*,3], 4, 5, 6; W2: -
    assertDesktop(desktop0, [client0, client1a, client1b, client1c, client4, client5, client6]);

    qtMock.fireShortcut("karousel-column-move-to-desktop-2");
    // W1: *0*, 4, 5, 6; W2: [1,*2*,3]
    Assert.equal(workspaceMock.activeWindow, client0);
    assertDesktop(desktop0, [client0, client4, client5, client6]);
    assertDesktop(desktop1, [client1a, client1b, client1c]);

    qtMock.fireShortcut("karousel-column-move-to-previous-desktop"); // no-op
    Assert.equal(workspaceMock.activeWindow, client0);
    assertDesktop(desktop0, [client0, client4, client5, client6]);
    assertDesktop(desktop1, [client1a, client1b, client1c]);

    qtMock.fireShortcut("karousel-column-move-to-next-desktop");
    // W1: *4*, 5, 6; W2: [1,*2*,3], 0
    Assert.equal(workspaceMock.activeWindow, client4);
    assertDesktop(desktop0, [client4, client5, client6]);
    assertDesktop(desktop1, [client1a, client1b, client1c, client0]);

    workspaceMock.currentDesktop = workspaceMock.desktops[1];
    qtMock.fireShortcut("karousel-focus-start");
    Assert.equal(workspaceMock.activeWindow, client1b);
    qtMock.fireShortcut("karousel-column-move-to-next-desktop"); // no-op
    Assert.equal(workspaceMock.activeWindow, client1b);
    assertDesktop(desktop0, [client4, client5, client6]);
    assertDesktop(desktop1, [client1a, client1b, client1c, client0]);

    qtMock.fireShortcut("karousel-column-move-to-previous-desktop");
    // W1: *4*, 5, 6, [1,*2*,3]; W2: *0*
    Assert.equal(workspaceMock.activeWindow, client0);
    assertDesktop(desktop0, [client4, client5, client6, client1a, client1b, client1c]);
    assertDesktop(desktop1, [client0]);

    workspaceMock.currentDesktop = workspaceMock.desktops[0];
    qtMock.fireShortcut("karousel-focus-end");
    qtMock.fireShortcut("karousel-focus-left");
    qtMock.fireShortcut("karousel-focus-left");
    // W1: 4, *5*, 6, [1,2,3]; W2: *0*
    Assert.equal(workspaceMock.activeWindow, client5);
    qtMock.fireShortcut("karousel-tail-move-to-previous-desktop"); // no-op
    assertDesktop(desktop0, [client4, client5, client6, client1a, client1b, client1c]);
    assertDesktop(desktop1, [client0]);

    Assert.equal(workspaceMock.activeWindow, client5);
    qtMock.fireShortcut("karousel-tail-move-to-next-desktop");
    // W1: *4*; W2: *0*, 5, 6, [1,2,3]
    Assert.equal(workspaceMock.activeWindow, client4);
    assertDesktop(desktop0, [client4]);
    assertDesktop(desktop1, [client0, client5, client6, client1a, client1b, client1c]);
});
