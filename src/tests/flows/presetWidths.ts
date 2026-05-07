tests.register("Preset Widths default", 5, () => {
    const config = getDefaultConfig();
    const { qtMock, workspaceMock, world } = init(config);

    const maxWidth = tilingArea.width;
    const halfWidth = maxWidth/2 - config.gapsInnerHorizontal/2;

    function getRect(columnWidth: number) {
        return new MockQmlRect(
            tilingArea.x + (tilingArea.width - columnWidth) / 2,
            tilingArea.y,
            columnWidth,
            tilingArea.height,
        );
    }

    const [kwinClient] = workspaceMock.createClientsWithWidths(300);
    Assert.equalRects(kwinClient.getActualFrameGeometry(), getRect(300));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths"),
        () => qtMock.fireShortcut("karousel-column-width-increase"),
    );
    Assert.equalRects(kwinClient.getActualFrameGeometry(), getRect(halfWidth));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths"),
        () => qtMock.fireShortcut("karousel-column-width-increase"),
    );
    Assert.equalRects(kwinClient.getActualFrameGeometry(), getRect(maxWidth));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths"),
        () => qtMock.fireShortcut("karousel-column-width-decrease"),
    );
    Assert.equalRects(kwinClient.getActualFrameGeometry(), getRect(halfWidth));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths"),
        () => qtMock.fireShortcut("karousel-column-width-increase"),
    );
    Assert.equalRects(kwinClient.getActualFrameGeometry(), getRect(maxWidth));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths"),
        () => qtMock.fireShortcut("karousel-column-width-decrease"),
    );
    Assert.equalRects(kwinClient.getActualFrameGeometry(), getRect(halfWidth));
});

tests.register("Preset Widths custom", 5, () => {
    const config = getDefaultConfig();
    config.presetWidths = "500px, 250px, 100px, 50%";
    const { qtMock, workspaceMock, world } = init(config);

    const maxWidth = tilingArea.width;
    const halfWidth = maxWidth/2 - config.gapsInnerHorizontal/2;

    function getRect(columnWidth: number) {
        return new MockQmlRect(
            tilingArea.x + (tilingArea.width - columnWidth) / 2,
            tilingArea.y,
            columnWidth,
            tilingArea.height,
        );
    }

    const [kwinClient] = workspaceMock.createClientsWithWidths(200);
    Assert.equalRects(kwinClient.getActualFrameGeometry(), getRect(200));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths"),
        () => qtMock.fireShortcut("karousel-column-width-increase"),
    );
    Assert.equalRects(kwinClient.getActualFrameGeometry(), getRect(250));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths"),
        () => qtMock.fireShortcut("karousel-column-width-increase"),
    );
    Assert.equalRects(kwinClient.getActualFrameGeometry(), getRect(halfWidth));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths"),
        () => qtMock.fireShortcut("karousel-column-width-increase"),
    );
    Assert.equalRects(kwinClient.getActualFrameGeometry(), getRect(500));

    qtMock.fireShortcut("karousel-cycle-preset-widths");
    Assert.equalRects(kwinClient.getActualFrameGeometry(), getRect(100));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths"),
        () => qtMock.fireShortcut("karousel-column-width-increase"),
    );
    Assert.equalRects(kwinClient.getActualFrameGeometry(), getRect(250));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths-reverse"),
        () => qtMock.fireShortcut("karousel-column-width-decrease"),
    );
    Assert.equalRects(kwinClient.getActualFrameGeometry(), getRect(100));

    qtMock.fireShortcut("karousel-cycle-preset-widths-reverse");
    Assert.equalRects(kwinClient.getActualFrameGeometry(), getRect(500));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths-reverse"),
        () => qtMock.fireShortcut("karousel-column-width-decrease"),
    );
    Assert.equalRects(kwinClient.getActualFrameGeometry(), getRect(halfWidth));
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
            tilingArea.x + (tilingArea.width - columnWidth) / 2,
            tilingArea.y,
            columnWidth,
            tilingArea.height,
        );
    }

    const [kwinClient] = workspaceMock.createClientsWithWidths(200);
    Assert.equalRects(kwinClient.getActualFrameGeometry(), getRect(200));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths"),
        () => qtMock.fireShortcut("karousel-column-width-increase"),
    );
    Assert.equalRects(kwinClient.getActualFrameGeometry(), getRect(width50));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths"),
        () => qtMock.fireShortcut("karousel-column-width-increase"),
    );
    Assert.equalRects(kwinClient.getActualFrameGeometry(), getRect(width75));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths"),
        () => qtMock.fireShortcut("karousel-column-width-increase"),
    );
    Assert.equalRects(kwinClient.getActualFrameGeometry(), getRect(width100));

    qtMock.fireShortcut("karousel-cycle-preset-widths");
    Assert.equalRects(kwinClient.getActualFrameGeometry(), getRect(width25));

    qtMock.fireShortcut("karousel-cycle-preset-widths-reverse");
    Assert.equalRects(kwinClient.getActualFrameGeometry(), getRect(width100));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths-reverse"),
        () => qtMock.fireShortcut("karousel-column-width-decrease"),
    );
    Assert.equalRects(kwinClient.getActualFrameGeometry(), getRect(width75));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths-reverse"),
        () => qtMock.fireShortcut("karousel-column-width-decrease"),
    );
    Assert.equalRects(kwinClient.getActualFrameGeometry(), getRect(width50));

    runOneOf(
        () => qtMock.fireShortcut("karousel-cycle-preset-widths-reverse"),
        () => qtMock.fireShortcut("karousel-column-width-decrease"),
    );
    Assert.equalRects(kwinClient.getActualFrameGeometry(), getRect(width25));
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

        const left = tilingArea.x;
        const right = rectRight(tilingArea);
        const maxLeftoverPx = nColumns - 1;
        const eps = Math.ceil(maxLeftoverPx / 2);
        Assert.between(firstClient!.getActualFrameGeometry().x, left, left+eps, { message: `nColumns: ${nColumns}` });
        Assert.between(rectRight(lastClient!.getActualFrameGeometry()), right-eps, right, { message: `nColumns: ${nColumns}` });
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
    const left1 = tilingArea.x;
    const left2 = left1 + config.gapsInnerHorizontal + quarterWidth;
    const left3 = left2 + config.gapsInnerHorizontal + quarterWidth;

    Assert.rect(clientThin1.getActualFrameGeometry(), left1, tilingArea.y, quarterWidth, height);
    Assert.rect(clientThin2.getActualFrameGeometry(), left2, tilingArea.y, quarterWidth, height);
    Assert.rect(clientWide.getActualFrameGeometry(), left3, tilingArea.y, halfWidth, height);
    Assert.equal(rectRight(clientWide.getActualFrameGeometry()), rectRight(tilingArea));
});
