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

tests.register("Cursor follows focus only on matched desktops", 1, () => {
    // Test that cursor follow focus only works for windows on matched desktops (tiled windows)
    const config = getDefaultConfig();
    config.cursorFollowsFocus = true;
    config.desktops = "Desktop 1"; // Only work on Desktop 1
    const { workspaceMock, world } = init(config);

    // Create a client on Desktop 1 (matched desktop) - should be tiled
    const client1 = new MockKwinClient();
    client1.desktops = [workspaceMock.desktops[0]]; // Desktop 1
    workspaceMock.createWindows(client1);
    
    // Create a client on Desktop 2 (non-matched desktop) - should be floating
    const client2 = new MockKwinClient();
    client2.desktops = [workspaceMock.desktops[1]]; // Desktop 2
    workspaceMock.createWindows(client2);

    // Set initial cursor position outside both windows
    const initialCursorPos = new MockQmlPoint(10, 10);
    workspaceMock.cursorPos = initialCursorPos.clone();

    // Test 1: Focus client1 on matched desktop (Desktop 1) - cursor should move
    workspaceMock.currentDesktop = workspaceMock.desktops[0]; // Switch to Desktop 1
    Workspace.activeWindow = client1;
    world.do(() => {});
    Assert.assert(rectContainsPoint(client1.frameGeometry, Workspace.cursorPos), 
        { message: "Cursor should have moved to tiled window on matched desktop" });

    // Test 2: Switch to non-matched desktop (Desktop 2) and focus client2 - cursor should NOT move
    workspaceMock.cursorPos = initialCursorPos.clone();
    workspaceMock.currentDesktop = workspaceMock.desktops[1]; // Switch to Desktop 2
    Workspace.activeWindow = client2;
    world.do(() => {});
    Assert.assert(pointEquals(Workspace.cursorPos, initialCursorPos), 
        { message: "Cursor should NOT move on non-matched desktop" });

    // Test 3: Even if we focus client1 (tiled) while on Desktop 2, cursor should NOT move
    // because the current desktop is not matched
    workspaceMock.cursorPos = initialCursorPos.clone();
    workspaceMock.currentDesktop = workspaceMock.desktops[1]; // Stay on Desktop 2
    Workspace.activeWindow = client1;
    world.do(() => {});
    Assert.assert(pointEquals(Workspace.cursorPos, initialCursorPos), 
        { message: "Cursor should NOT move even for tiled window when current desktop is not matched" });
});
