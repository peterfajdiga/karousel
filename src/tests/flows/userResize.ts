tests.register("User resize", 10, () => {
    const config = getDefaultConfig();
    config.resizeNeighborColumn = true;

    const h = getWindowHeight(2);
    let clientLeft: MockKwinClient, clientRightTop: MockKwinClient, clientRightBottom: MockKwinClient;
    function assertSizes(leftWidth: number, rightWidth: number, topHeight: number, bottomHeight: number) {
        const { left, right } = getGridBounds(clientLeft, clientRightTop);
        Assert.rect(clientLeft.frameGeometry, left, tilingArea.top, leftWidth, tilingArea.height);
        Assert.rect(clientRightTop.frameGeometry, left+leftWidth+gapH, tilingArea.top, rightWidth, topHeight);
        Assert.rect(clientRightBottom.frameGeometry, left+leftWidth+gapH, tilingArea.top+topHeight+gapV, rightWidth, bottomHeight);
    }

    {
        const { qtMock, workspaceMock, world } = init(config);
        [clientLeft, clientRightTop, clientRightBottom] = workspaceMock.createClientsWithWidths(300, 300, 200);
        qtMock.fireShortcut("karousel-window-move-left");
        assertSizes(300, 300, h, h);

        workspaceMock.resizeWindow(clientLeft, false, false, false, new MockQmlSize(10, 20));
        assertSizes(310, 300, h, h);

        workspaceMock.resizeWindow(clientRightTop, false, false, false, new MockQmlSize(-5, -10), new MockQmlSize(-5, -10));
        assertSizes(310, 290, h-20, h+20);

        workspaceMock.resizeWindow(clientRightBottom, false, false, false, new MockQmlSize(-10, 20));
        assertSizes(310, 280, h-20, h+20);

        workspaceMock.resizeWindow(clientRightBottom, false, false, true, new MockQmlSize(0, 20));
        assertSizes(310, 280, h-40, h+40);
    }

    {
        const { qtMock, workspaceMock, world } = init(config);
        [clientLeft, clientRightTop, clientRightBottom] = workspaceMock.createClientsWithWidths(300, 300, 200);
        qtMock.fireShortcut("karousel-window-move-left");
        assertSizes(300, 300, h, h);

        workspaceMock.resizeWindow(clientLeft, true, false, false, new MockQmlSize(10, 20));
        assertSizes(310, 290, h, h);

        workspaceMock.resizeWindow(clientRightTop, true, false, false, new MockQmlSize(-5, -10), new MockQmlSize(-5, -10));
        assertSizes(310, 280, h-20, h+20);

        workspaceMock.resizeWindow(clientRightBottom, true, true, false, new MockQmlSize(-10, 20));
        assertSizes(320, 270, h-20, h+20);

        workspaceMock.resizeWindow(clientRightBottom, true, false, true, new MockQmlSize(0, 20));
        assertSizes(320, 270, h-40, h+40);
    }

    {
        const { qtMock, workspaceMock, world } = init(config);
        [clientLeft, clientRightTop, clientRightBottom] = workspaceMock.createClientsWithWidths(300, 300, 200);
        clientRightBottom.minSize = new MockQmlSize(295, h-20);
        qtMock.fireShortcut("karousel-window-move-left");
        assertSizes(300, 300, h, h);

        workspaceMock.resizeWindow(clientLeft, true, false, false, new MockQmlSize(10, 20));
        assertSizes(310, 295, h, h);

        workspaceMock.resizeWindow(clientRightTop, true, false, false, new MockQmlSize(-5, -10), new MockQmlSize(-5, -10));
        assertSizes(310, 295, h-20, h+20);

        workspaceMock.resizeWindow(clientRightBottom, true, true, false, new MockQmlSize(-10, 20));
        assertSizes(320, 295, h-20, h+20);

        // TODO
        // workspaceMock.resizeWindow(clientRightBottom, true, false, true, new MockQmlSize(0, -80));
        // assertSizes(320, 295, h+60, h-20);
    }
});
