{
    Qt = new Mocks.Qt();
    const workspaceMock = new Mocks.Workspace();
    Workspace = workspaceMock;
    const world = new World(getDefaultConfig());

    workspaceMock.createWindow(new Mocks.KwinClient(
        1,
        "app1",
        "Application 1",
        new Mocks.QmlRect(0, 0, 200, 200),
    ));
}
