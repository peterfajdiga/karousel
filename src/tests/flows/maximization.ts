{
    const workspaceMock = initMocks();
    const world = new World(getDefaultConfig());

    const kwinClient = new MockKwinClient(
        1,
        "app1",
        "Application 1",
        new MockQmlRect(10, 20, 300, 200),
    );

    workspaceMock.createWindow(kwinClient);
    world.do((clientManager, desktopManager) => {
        assert(clientManager.hasClient(kwinClient));
    })

    kwinClient.fullScreen = true;
    assert(rectEquals(kwinClient.frameGeometry, new MockQmlRect(0, 0, screenWidth, screenHeight)));

    kwinClient.fullScreen = false;
    assert(rectEquals(kwinClient.frameGeometry, new MockQmlRect(10, 20, 300, 200)));

    kwinClient.setMaximize(true, true);
    assert(rectEquals(kwinClient.frameGeometry, new MockQmlRect(0, 0, screenWidth, screenHeight)));

    kwinClient.setMaximize(true, false);
    assert(rectEquals(kwinClient.frameGeometry, new MockQmlRect(10, 0, 300, screenHeight)));

    kwinClient.setMaximize(false, false);
    assert(rectEquals(kwinClient.frameGeometry, new MockQmlRect(10, 20, 300, 200)));
}
