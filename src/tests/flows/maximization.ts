tests.register("Maximization", 100, () => {
    const workspaceMock = initMocks();
    const config = getDefaultConfig();
    const world = new World(config);

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

    const columnLeftX = screenWidth/2 - 300/2;
    const columnTopY = config.gapsOuterTop;
    const columnHeight = screenHeight - config.gapsOuterTop - config.gapsOuterBottom;

    kwinClient.fullScreen = true;
    assertRect(kwinClient.frameGeometry, 0, 0, screenWidth, screenHeight);

    kwinClient.fullScreen = false;
    assertRect(kwinClient.frameGeometry, columnLeftX, columnTopY, 300, columnHeight);

    kwinClient.setMaximize(true, true);
    assertRect(kwinClient.frameGeometry, 0, 0, screenWidth, screenHeight);

    kwinClient.setMaximize(true, false);
    assertRect(kwinClient.frameGeometry, columnLeftX, 0, 300, screenHeight);

    kwinClient.setMaximize(false, false);
    assertRect(kwinClient.frameGeometry, columnLeftX, columnTopY, 300, columnHeight);
});
