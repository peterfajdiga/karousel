tests.register("tiledKeepBelow", 10, () => {
    const config = getDefaultConfig();
    config.tiledKeepBelow = true;
    config.floatingKeepAbove = false;
    const { qtMock, workspaceMock, world } = init(config);

    const pinGeometry = new MockQmlRect(0, 0, 200, screen.height);

    const [client] = workspaceMock.createClients(1);
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.findTiledWindow(client) !== null);
    });
    Assert.assert(client.keepBelow);
    Assert.assert(!client.keepAbove);

    qtMock.fireShortcut("karousel-window-toggle-floating");
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.findTiledWindow(client) === null);
    });
    Assert.assert(!client.keepBelow);
    Assert.assert(!client.keepAbove);

    client.pin(pinGeometry);
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.findTiledWindow(client) === null);
    });
    Assert.assert(!client.keepBelow);
    Assert.assert(!client.keepAbove);

    client.unpin();
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.findTiledWindow(client) === null);
    });
    Assert.assert(!client.keepBelow);
    Assert.assert(!client.keepAbove);

    qtMock.fireShortcut("karousel-window-toggle-floating");
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.findTiledWindow(client) !== null);
    });
    Assert.assert(client.keepBelow);
    Assert.assert(!client.keepAbove);

    client.pin(pinGeometry);
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.findTiledWindow(client) === null);
    });
    Assert.assert(!client.keepBelow);
    Assert.assert(!client.keepAbove);

    qtMock.fireShortcut("karousel-window-toggle-floating");
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.findTiledWindow(client) !== null);
    });
    Assert.assert(client.keepBelow);
    Assert.assert(!client.keepAbove);
});

tests.register("floatingKeepAbove", 10, () => {
    const config = getDefaultConfig();
    config.tiledKeepBelow = false;
    config.floatingKeepAbove = true;
    const { qtMock, workspaceMock, world } = init(config);

    const pinGeometry = new MockQmlRect(0, 0, 200, screen.height);

    const [client] = workspaceMock.createClients(1);
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.findTiledWindow(client) !== null);
    });
    Assert.assert(!client.keepBelow);
    Assert.assert(!client.keepAbove);

    qtMock.fireShortcut("karousel-window-toggle-floating");
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.findTiledWindow(client) === null);
    });
    Assert.assert(!client.keepBelow);
    Assert.assert(client.keepAbove);

    client.pin(pinGeometry);
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.findTiledWindow(client) === null);
    });
    Assert.assert(!client.keepBelow);
    Assert.assert(client.keepAbove);

    client.unpin();
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.findTiledWindow(client) === null);
    });
    Assert.assert(!client.keepBelow);
    Assert.assert(client.keepAbove);

    qtMock.fireShortcut("karousel-window-toggle-floating");
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.findTiledWindow(client) !== null);
    });
    Assert.assert(!client.keepBelow);
    Assert.assert(!client.keepAbove);

    client.pin(pinGeometry);
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.findTiledWindow(client) === null);
    });
    Assert.assert(!client.keepBelow);
    Assert.assert(client.keepAbove);

    qtMock.fireShortcut("karousel-window-toggle-floating");
    world.do((clientManager, desktopManager) => {
        Assert.assert(clientManager.findTiledWindow(client) !== null);
    });
    Assert.assert(!client.keepBelow);
    Assert.assert(!client.keepAbove);
});

tests.register("No layering", 10, () => {
    const config = getDefaultConfig();
    config.tiledKeepBelow = false;
    config.floatingKeepAbove = false;
    // In this mode, Karousel shouldn't change keepBelow or keepAbove.
    // Except when tiling a window, keepAbove should still be cleared.

    const pinGeometry = new MockQmlRect(0, 0, 200, screen.height);

    const testCases = [
        { keepBelow: false, keepAbove: false },
        { keepBelow: false, keepAbove: true },
        { keepBelow: true,  keepAbove: false },
        { keepBelow: true,  keepAbove: true },
    ];

    for (const testCase of testCases) {
        const assertOptions = { message: JSON.stringify(testCase) };

        const { qtMock, workspaceMock, world } = init(config);

        const [client] = workspaceMock.createClients(1);
        client.keepBelow = testCase.keepBelow;
        client.keepAbove = testCase.keepAbove;

        world.do((clientManager, desktopManager) => {
            Assert.assert(clientManager.findTiledWindow(client) !== null, assertOptions);
        });
        Assert.equal(client.keepBelow, testCase.keepBelow, assertOptions);
        Assert.equal(client.keepAbove, testCase.keepAbove, assertOptions);

        qtMock.fireShortcut("karousel-window-toggle-floating");
        world.do((clientManager, desktopManager) => {
            Assert.assert(clientManager.findTiledWindow(client) === null, assertOptions);
        });
        Assert.equal(client.keepBelow, testCase.keepBelow, assertOptions);
        Assert.equal(client.keepAbove, testCase.keepAbove, assertOptions);

        client.pin(pinGeometry);
        world.do((clientManager, desktopManager) => {
            Assert.assert(clientManager.findTiledWindow(client) === null, assertOptions);
        });
        Assert.equal(client.keepBelow, testCase.keepBelow, assertOptions);
        Assert.equal(client.keepAbove, testCase.keepAbove, assertOptions);

        client.unpin();
        world.do((clientManager, desktopManager) => {
            Assert.assert(clientManager.findTiledWindow(client) === null, assertOptions);
        });
        Assert.equal(client.keepBelow, testCase.keepBelow, assertOptions);
        Assert.equal(client.keepAbove, testCase.keepAbove, assertOptions);

        qtMock.fireShortcut("karousel-window-toggle-floating");
        world.do((clientManager, desktopManager) => {
            Assert.assert(clientManager.findTiledWindow(client) !== null, assertOptions);
        });
        Assert.equal(client.keepBelow, testCase.keepBelow, assertOptions);
        Assert.assert(!client.keepAbove, assertOptions);
        client.keepAbove = testCase.keepAbove;

        client.pin(pinGeometry);
        world.do((clientManager, desktopManager) => {
            Assert.assert(clientManager.findTiledWindow(client) === null, assertOptions);
        });
        Assert.equal(client.keepBelow, testCase.keepBelow, assertOptions);
        Assert.equal(client.keepAbove, testCase.keepAbove, assertOptions);

        qtMock.fireShortcut("karousel-window-toggle-floating");
        world.do((clientManager, desktopManager) => {
            Assert.assert(clientManager.findTiledWindow(client) !== null, assertOptions);
        });
        Assert.equal(client.keepBelow, testCase.keepBelow, assertOptions);
        Assert.assert(!client.keepAbove, assertOptions);
    }
});
