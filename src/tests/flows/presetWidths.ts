tests.register("Preset Widths default", 1, () => {
    const config = getDefaultConfig();
    const { qtMock, workspaceMock, world } = init(config);

    const maxWidth = tilingArea.width;
    const halfWidth = maxWidth/2 - config.gapsInnerHorizontal/2;

    function getRect(columnWidth: number) {
        return new MockQmlRect(
            (screen.width - columnWidth) / 2,
            tilingArea.top,
            columnWidth,
            tilingArea.height,
        );
    }

    const [kwinClient] = workspaceMock.createClientsWithWidths(300);
    Assert.equalRects(kwinClient.frameGeometry, getRect(300));

    qtMock.fireShortcut("karousel-cycle-preset-widths");
    Assert.equalRects(kwinClient.frameGeometry, getRect(halfWidth));

    qtMock.fireShortcut("karousel-cycle-preset-widths");
    Assert.equalRects(kwinClient.frameGeometry, getRect(maxWidth));

    qtMock.fireShortcut("karousel-cycle-preset-widths");
    Assert.equalRects(kwinClient.frameGeometry, getRect(halfWidth));

    qtMock.fireShortcut("karousel-cycle-preset-widths-reverse");
    Assert.equalRects(kwinClient.frameGeometry, getRect(maxWidth));

    qtMock.fireShortcut("karousel-cycle-preset-widths-reverse");
    Assert.equalRects(kwinClient.frameGeometry, getRect(halfWidth));
});

tests.register("Preset Widths custom", 1, () => {
    const config = getDefaultConfig();
    config.presetWidths = "500px, 250px, 100px, 50%";
    const { qtMock, workspaceMock, world } = init(config);

    const maxWidth = tilingArea.width;
    const halfWidth = maxWidth/2 - config.gapsInnerHorizontal/2;

    function getRect(columnWidth: number) {
        return new MockQmlRect(
            (screen.width - columnWidth) / 2,
            tilingArea.top,
            columnWidth,
            tilingArea.height,
        );
    }

    const [kwinClient] = workspaceMock.createClientsWithWidths(200);
    Assert.equalRects(kwinClient.frameGeometry, getRect(200));

    qtMock.fireShortcut("karousel-cycle-preset-widths");
    Assert.equalRects(kwinClient.frameGeometry, getRect(250));

    qtMock.fireShortcut("karousel-cycle-preset-widths");
    Assert.equalRects(kwinClient.frameGeometry, getRect(halfWidth));

    qtMock.fireShortcut("karousel-cycle-preset-widths");
    Assert.equalRects(kwinClient.frameGeometry, getRect(500));

    qtMock.fireShortcut("karousel-cycle-preset-widths");
    Assert.equalRects(kwinClient.frameGeometry, getRect(100));

    qtMock.fireShortcut("karousel-cycle-preset-widths");
    Assert.equalRects(kwinClient.frameGeometry, getRect(250));

    qtMock.fireShortcut("karousel-cycle-preset-widths-reverse");
    Assert.equalRects(kwinClient.frameGeometry, getRect(100));

    qtMock.fireShortcut("karousel-cycle-preset-widths-reverse");
    Assert.equalRects(kwinClient.frameGeometry, getRect(500));

    qtMock.fireShortcut("karousel-cycle-preset-widths-reverse");
    Assert.equalRects(kwinClient.frameGeometry, getRect(halfWidth));
});

tests.register("Preset Widths fill screen uniform", 1, () => {
    for (let nColumns = 1; nColumns < 10; nColumns++) {
        const config = getDefaultConfig();
        config.presetWidths = String(1 / nColumns);
        const { qtMock, workspaceMock, world } = init(config);

        let firstClient, lastClient;
        for (let i = 0; i < nColumns; i++) {
            const [kwinClient] = workspaceMock.createClientsWithWidths(300);
            if (i === 0) {
                firstClient = kwinClient;
            }
            if (i === nColumns-1) {
                lastClient = kwinClient;
            }
            qtMock.fireShortcut("karousel-cycle-preset-widths");
        }

        const left = tilingArea.left;
        const right = tilingArea.right;
        const maxLeftoverPx = nColumns - 1;
        const eps = Math.ceil(maxLeftoverPx / 2);
        Assert.between(firstClient!.frameGeometry.left, left, left+eps, { message: `nColumns: ${nColumns}` });
        Assert.between(lastClient!.frameGeometry.right, right-eps, right, { message: `nColumns: ${nColumns}` });
    }
});

tests.register("Preset Widths fill screen non-uniform", 1, () => {
    const config = getDefaultConfig();
    config.presetWidths = String("50%, 25%");
    const { qtMock, workspaceMock, world } = init(config);

    const [clientThin1] = workspaceMock.createClientsWithWidths(100);
    qtMock.fireShortcut("karousel-cycle-preset-widths");

    const [clientThin2] = workspaceMock.createClientsWithWidths(100);
    qtMock.fireShortcut("karousel-cycle-preset-widths");

    const [clientWide] = workspaceMock.createClientsWithWidths(300);
    qtMock.fireShortcut("karousel-cycle-preset-widths");

    const maxWidth = tilingArea.width;
    const halfWidth = maxWidth/2 - config.gapsInnerHorizontal/2;
    const quarterWidth = halfWidth/2 - config.gapsInnerHorizontal/2;
    const height = tilingArea.height;
    const left1 = tilingArea.left;
    const left2 = left1 + config.gapsInnerHorizontal + quarterWidth;
    const left3 = left2 + config.gapsInnerHorizontal + quarterWidth;

    Assert.rect(clientThin1.frameGeometry, left1, tilingArea.top, quarterWidth, height);
    Assert.rect(clientThin2.frameGeometry, left2, tilingArea.top, quarterWidth, height);
    Assert.rect(clientWide.frameGeometry, left3, tilingArea.top, halfWidth, height);
    Assert.equal(clientWide.frameGeometry.right, tilingArea.right);
});
