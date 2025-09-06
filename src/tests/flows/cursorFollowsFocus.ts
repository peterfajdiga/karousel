tests.register("Drag tiled window, untile", 10, () => {
    const config = getDefaultConfig();
    config.cursorFollowsFocus = true;
    const { qtMock, workspaceMock, world } = init(config);

    const [client1, client2] = workspaceMock.createClients(2);
    const initialCursorPos = new MockQmlPoint(380, 20);
    Assert.assert(rectContainsPoint(client1.frameGeometry, initialCursorPos), { message: "invalid test setup" });
    workspaceMock.cursorPos = initialCursorPos.clone();

    runOneOf(
        () => { Workspace.activeWindow = client1; },
        () => { qtMock.fireShortcut("karousel-focus-1"); },
    );
    Assert.assert(rectContainsPoint(client1.frameGeometry, Workspace.cursorPos));
    Assert.assert(!rectContainsPoint(client2.frameGeometry, Workspace.cursorPos));
    Assert.assert(pointEquals(Workspace.cursorPos, initialCursorPos), { message: "Cursor should not have been moved because it was already within the focused client" });

    runOneOf(
        () => { Workspace.activeWindow = client2; },
        () => { qtMock.fireShortcut("karousel-focus-2"); },
    );
    Assert.assert(!rectContainsPoint(client1.frameGeometry, Workspace.cursorPos));
    Assert.assert(rectContainsPoint(client2.frameGeometry, Workspace.cursorPos));

    runOneOf(
        () => { Workspace.activeWindow = client1; },
        () => { qtMock.fireShortcut("karousel-focus-1"); },
    );
    Assert.assert(rectContainsPoint(client1.frameGeometry, Workspace.cursorPos));
    Assert.assert(!rectContainsPoint(client2.frameGeometry, Workspace.cursorPos));
    const lastCursorPos = workspaceMock.cursorPos.clone();

    Workspace.activeWindow = null;
    Assert.assert(pointEquals(Workspace.cursorPos, lastCursorPos), { message: "Cursor should not have been moved" });
});
