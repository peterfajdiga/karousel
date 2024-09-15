{
    const workspaceMock = initMocks();
    const world = new World(getDefaultConfig());

    const kwinClient = new MockKwinClient(
        1,
        "app1",
        "Application 1",
        new MockQmlRect(0, 0, 300, 200),
    );

    workspaceMock.createWindow(kwinClient);
    world.do((clientManager, desktopManager) => {
        assert(clientManager.hasClient(kwinClient));
    })

    kwinClient.fullScreen = true;
    {
        const frame = kwinClient.frameGeometry;
        assert(frame.width === screenWidth && frame.height === screenHeight);
    }

    kwinClient.fullScreen = false;
    {
        const frame = kwinClient.frameGeometry;
        assert(frame.width === 300 && frame.height === 200);
    }

    kwinClient.setMaximize(true, true);
    {
        const frame = kwinClient.frameGeometry;
        assert(frame.width === screenWidth && frame.height === screenHeight);
    }

    kwinClient.setMaximize(true, false);
    {
        const frame = kwinClient.frameGeometry;
        assert(frame.width === 300 && frame.height === screenHeight);
    }

    kwinClient.setMaximize(false, false);
    {
        const frame = kwinClient.frameGeometry;
        assert(frame.width === 300 && frame.height === 200);
    }
}
