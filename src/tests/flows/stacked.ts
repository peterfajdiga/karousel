tests.register("Stacked", 5, () => {
    const config = getDefaultConfig();
    const { qtMock, workspaceMock, world } = init(config);

    const [leftTop, leftBottom, rightTop, rightBottom] = workspaceMock.createClients(4);
    const grid = [[leftTop, leftBottom], [rightTop, rightBottom]];
    workspaceMock.activeWindow = rightBottom;
    qtMock.fireShortcut("karousel-window-move-left");
    workspaceMock.activeWindow = leftBottom;
    qtMock.fireShortcut("karousel-window-move-left");
    Assert.grid(config, tilingArea, 100, grid, true);

    qtMock.fireShortcut("karousel-column-toggle-stacked");
    Assert.grid(config, tilingArea, 100, grid, true, [0]);

    qtMock.fireShortcut("karousel-focus-up");
    Assert.grid(config, tilingArea, 100, grid, true, [0]);

    qtMock.fireShortcut("karousel-focus-down");
    Assert.grid(config, tilingArea, 100, grid, true, [0]);

    qtMock.fireShortcut("karousel-window-move-up");
    Assert.grid(config, tilingArea, 100, [[leftBottom, leftTop], [rightTop, rightBottom]], true, [0]);

    qtMock.fireShortcut("karousel-window-move-down");
    Assert.grid(config, tilingArea, 100, grid, true, [0]);

    qtMock.fireShortcut("karousel-column-toggle-stacked");
    Assert.grid(config, tilingArea, 100, grid, true);
});
