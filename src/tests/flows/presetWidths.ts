tests.register("Preset Widths default", 5, () => {
    const config = getDefaultConfig();
    const { qtMock, workspaceMock, world } = init(config);

    const maxWidth = tilingArea.width;
    const halfWidth = maxWidth/2 - config.gapsInnerHorizontal/2;

    function getRect(columnWidth: number) {
        return new MockQmlRect(
            tilingArea.left + (tilingArea.width - columnWidth) / 2,
            tilingArea.top,
            columnWidth,
            tilingArea.height,
        );
    }

    const [kwinClient] = workspaceMock.createClientsWithWidths(300);
    Assert.equalRects(kwinClient.frameGeometry, getRect(300));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths"),
        () => qtMock.fireShortcut("karousel-column-width-increase"),
    );
    Assert.equalRects(kwinClient.frameGeometry, getRect(halfWidth));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths"),
        () => qtMock.fireShortcut("karousel-column-width-increase"),
    );
    Assert.equalRects(kwinClient.frameGeometry, getRect(maxWidth));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths"),
        () => qtMock.fireShortcut("karousel-column-width-decrease"),
    );
    Assert.equalRects(kwinClient.frameGeometry, getRect(halfWidth));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths"),
        () => qtMock.fireShortcut("karousel-column-width-increase"),
    );
    Assert.equalRects(kwinClient.frameGeometry, getRect(maxWidth));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths"),
        () => qtMock.fireShortcut("karousel-column-width-decrease"),
    );
    Assert.equalRects(kwinClient.frameGeometry, getRect(halfWidth));
});

tests.register("Preset Widths custom", 5, () => {
    const config = getDefaultConfig();
    config.presetWidths = "500px, 250px, 100px, 50%";
    const { qtMock, workspaceMock, world } = init(config);

    const maxWidth = tilingArea.width;
    const halfWidth = maxWidth/2 - config.gapsInnerHorizontal/2;

    function getRect(columnWidth: number) {
        return new MockQmlRect(
            tilingArea.left + (tilingArea.width - columnWidth) / 2,
            tilingArea.top,
            columnWidth,
            tilingArea.height,
        );
    }

    const [kwinClient] = workspaceMock.createClientsWithWidths(200);
    Assert.equalRects(kwinClient.frameGeometry, getRect(200));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths"),
        () => qtMock.fireShortcut("karousel-column-width-increase"),
    );
    Assert.equalRects(kwinClient.frameGeometry, getRect(250));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths"),
        () => qtMock.fireShortcut("karousel-column-width-increase"),
    );
    Assert.equalRects(kwinClient.frameGeometry, getRect(halfWidth));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths"),
        () => qtMock.fireShortcut("karousel-column-width-increase"),
    );
    Assert.equalRects(kwinClient.frameGeometry, getRect(500));

    qtMock.fireShortcut("karousel-cycle-preset-widths");
    Assert.equalRects(kwinClient.frameGeometry, getRect(100));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths"),
        () => qtMock.fireShortcut("karousel-column-width-increase"),
    );
    Assert.equalRects(kwinClient.frameGeometry, getRect(250));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths-reverse"),
        () => qtMock.fireShortcut("karousel-column-width-decrease"),
    );
    Assert.equalRects(kwinClient.frameGeometry, getRect(100));

    qtMock.fireShortcut("karousel-cycle-preset-widths-reverse");
    Assert.equalRects(kwinClient.frameGeometry, getRect(500));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths-reverse"),
        () => qtMock.fireShortcut("karousel-column-width-decrease"),
    );
    Assert.equalRects(kwinClient.frameGeometry, getRect(halfWidth));
});

tests.register("Preset Widths custom percentages", 5, () => {
    const config = getDefaultConfig();
    config.presetWidths = "25%, 50%, 75%, 100%";
    const { qtMock, workspaceMock, world } = init(config);

    const width100 = tilingArea.width;
    const width75 = width100*0.75 - config.gapsInnerHorizontal*0.25;
    const width50 = width100*0.50 - config.gapsInnerHorizontal*0.50;
    const width25 = width100*0.25 - config.gapsInnerHorizontal*0.75;

    function getRect(columnWidth: number) {
        return new MockQmlRect(
            tilingArea.left + (tilingArea.width - columnWidth) / 2,
            tilingArea.top,
            columnWidth,
            tilingArea.height,
        );
    }

    const [kwinClient] = workspaceMock.createClientsWithWidths(200);
    Assert.equalRects(kwinClient.frameGeometry, getRect(200));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths"),
        () => qtMock.fireShortcut("karousel-column-width-increase"),
    );
    Assert.equalRects(kwinClient.frameGeometry, getRect(width50));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths"),
        () => qtMock.fireShortcut("karousel-column-width-increase"),
    );
    Assert.equalRects(kwinClient.frameGeometry, getRect(width75));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths"),
        () => qtMock.fireShortcut("karousel-column-width-increase"),
    );
    Assert.equalRects(kwinClient.frameGeometry, getRect(width100));

    qtMock.fireShortcut("karousel-cycle-preset-widths");
    Assert.equalRects(kwinClient.frameGeometry, getRect(width25));

    qtMock.fireShortcut("karousel-cycle-preset-widths-reverse");
    Assert.equalRects(kwinClient.frameGeometry, getRect(width100));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths-reverse"),
        () => qtMock.fireShortcut("karousel-column-width-decrease"),
    );
    Assert.equalRects(kwinClient.frameGeometry, getRect(width75));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths-reverse"),
        () => qtMock.fireShortcut("karousel-column-width-decrease"),
    );
    Assert.equalRects(kwinClient.frameGeometry, getRect(width50));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths-reverse"),
        () => qtMock.fireShortcut("karousel-column-width-decrease"),
    );
    Assert.equalRects(kwinClient.frameGeometry, getRect(width25));
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
