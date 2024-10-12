tests.register("User resize", 1, () => {
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

        workspaceMock.resizeWindow(clientLeft, 10, 20, false, false, false);
        assertSizes(310, 300, h, h);

        workspaceMock.resizeWindow(clientRightTop, -10, -20, false, false, false);
        assertSizes(310, 290, h-20, h+20);

        workspaceMock.resizeWindow(clientRightBottom, -10, 20, false, false, false);
        assertSizes(310, 280, h-20, h+20);

        workspaceMock.resizeWindow(clientRightBottom, 0, 20, false, true, false);
        assertSizes(310, 280, h-40, h+40);
    }

    {
        const { qtMock, workspaceMock, world } = init(config);
        [clientLeft, clientRightTop, clientRightBottom] = workspaceMock.createClientsWithWidths(300, 300, 200);
        qtMock.fireShortcut("karousel-window-move-left");
        assertSizes(300, 300, h, h);

        workspaceMock.resizeWindow(clientLeft, 10, 20, false, false, true);
        assertSizes(310, 290, h, h);

        workspaceMock.resizeWindow(clientRightTop, -10, -20, false, false, true);
        assertSizes(310, 280, h-20, h+20);

        workspaceMock.resizeWindow(clientRightBottom, -10, 20, true, false, true);
        assertSizes(320, 270, h-20, h+20);

        workspaceMock.resizeWindow(clientRightBottom, 0, 20, false, true, true);
        assertSizes(320, 270, h-40, h+40);
    }

    {
        const { qtMock, workspaceMock, world } = init(config);
        [clientLeft, clientRightTop, clientRightBottom] = workspaceMock.createClientsWithWidths(300, 300, 200);
        clientRightBottom.minSize = new MockQmlSize(295, h-20);
        qtMock.fireShortcut("karousel-window-move-left");
        assertSizes(300, 300, h, h);

        workspaceMock.resizeWindow(clientLeft, 10, 20, false, false, true);
        assertSizes(310, 295, h, h);

        workspaceMock.resizeWindow(clientRightTop, -10, -20, false, false, true);
        assertSizes(310, 295, h-20, h+20);

        workspaceMock.resizeWindow(clientRightBottom, -10, 20, true, false, true);
        assertSizes(320, 295, h-20, h+20);

        // TODO
        // workspaceMock.resizeWindow(clientRightBottom, 0, -80, false, true, true);
        // assertSizes(320, 295, h+60, h-20);
    }
});
