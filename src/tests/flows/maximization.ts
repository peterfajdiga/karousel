{
    Qt = new MockQt();
    const workspaceMock = new MockWorkspace();
    Workspace = workspaceMock;
    const world = new World(getDefaultConfig());

    const kwinClient = new MockKwinClient(
        1,
        "app1",
        "Application 1",
        new MockQmlRect(0, 0, 200, 200),
    );

    workspaceMock.createWindow(kwinClient);
    kwinClient.fullScreen = true;
    {
        const frame = kwinClient.frameGeometry;
        assert(frame.width === screenWidth && frame.height === screenHeight);
    }

    kwinClient.fullScreen = false;
    {
        const frame = kwinClient.frameGeometry;
        assert(frame.width === 200 && frame.height === 200);
    }
}
