tests.register("Desktop filtering", 1, () => {
    // Test 1: Default config should work on all desktops
    const config1 = getDefaultConfig();
    const { workspaceMock: wm1, world: world1 } = init(config1);

    const client1 = new MockKwinClient();
    client1.desktops = [wm1.desktops[0]];
    wm1.createWindows(client1);

    world1.do((clientManager) => {
        Assert.tiledClient(clientManager, client1, { message: "Client should be tiled on desktop1 with default config (*)" });
    });
});

tests.register("Desktop filtering - specific desktop", 1, () => {
    // Test 2: Specific desktop name - should work only on matching desktop
    const config2 = getDefaultConfig();
    config2.tiledDesktops = "^Desktop 1$";
    const { workspaceMock: wm2, world: world2 } = init(config2);

    const client1 = new MockKwinClient();
    client1.desktops = [wm2.desktops[0]]; // Desktop 1
    wm2.createWindows(client1);
    world2.do((clientManager) => {
        Assert.tiledClient(clientManager, client1, { message: "Client should be tiled on Desktop 1" });
    });

    wm2.removeWindow(client1);

    const client2 = new MockKwinClient();
    client2.desktops = [wm2.desktops[1]]; // Desktop 2
    wm2.createWindows(client2);
    world2.do((clientManager) => {
        Assert.notTiledClient(clientManager, client2, { message: "Client should NOT be tiled on Desktop 2" });
    });
});

tests.register("Desktop filtering - multiple desktops", 1, () => {
    // Test 3: Multiple desktop names using regex alternation
    const config3 = getDefaultConfig();
    config3.tiledDesktops = "^Desktop [12]$";
    const { workspaceMock: wm3, world: world3 } = init(config3);

    const client1 = new MockKwinClient();
    client1.desktops = [wm3.desktops[0]]; // Desktop 1
    wm3.createWindows(client1);
    world3.do((clientManager) => {
        Assert.tiledClient(clientManager, client1, { message: "Client should be tiled on Desktop 1" });
    });

    wm3.removeWindow(client1);

    const client2 = new MockKwinClient();
    client2.desktops = [wm3.desktops[1]]; // Desktop 2
    wm3.createWindows(client2);
    world3.do((clientManager) => {
        Assert.tiledClient(clientManager, client2, { message: "Client should be tiled on Desktop 2" });
    });
});

tests.register("Desktop filtering - windows on multiple desktops", 1, () => {
    // Test 4: Windows on multiple desktops should not be tiled (fallback to floating)
    const config4 = getDefaultConfig();
    config4.tiledDesktops = ".*";
    const { workspaceMock: wm4, world: world4 } = init(config4);

    const client1 = new MockKwinClient();
    client1.desktops = [wm4.desktops[0], wm4.desktops[1]]; // Multiple desktops
    wm4.createWindows(client1);
    world4.do((clientManager) => {
        Assert.notTiledClient(clientManager, client1, { message: "Client on multiple desktops should not be tiled" });
    });
});
