{
    Qt = new Mocks.Qt();
    const workspaceMock = new Mocks.Workspace();
    Workspace = workspaceMock;
    const world = new World(getDefaultConfig());

    const kwinClient = new Mocks.KwinClient(
        1,
        "app1",
        "Application 1",
        new Mocks.QmlRect(0, 0, 200, 200),
    );

    workspaceMock.createWindow(kwinClient);
    kwinClient.fullScreen = true;
    {
        const frame = kwinClient.frameGeometry;
        assert(frame.width === Mocks.screenWidth && frame.height === Mocks.screenHeight);
    }

    kwinClient.fullScreen = false;
    {
        const frame = kwinClient.frameGeometry;
        assert(frame.width === 200 && frame.height === 200);
    }
}
