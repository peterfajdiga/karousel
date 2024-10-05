tests.register("External resize", 1, () => {
    const config = getDefaultConfig();
    const { qtMock, workspaceMock, world } = init(config);

    function getClientDesiredFrame(width: number) {
        return new MockQmlRect(10, 10, width, 200);
    }

    function getTiledFrame(width: number) {
        return new MockQmlRect(
            Math.round((screen.width - width) / 2),
            tilingArea.top,
            width,
            tilingArea.height,
        );
    }

    const client = new MockKwinClient(
        1,
        "app1",
        "Application 1",
        getClientDesiredFrame(100),
    );

    workspaceMock.createWindow(client);
    Assert.equalRects(client.frameGeometry, getTiledFrame(100), { message: "We should tile the window, respecting its desired width" });

    function testExternalResizing() {
        client.frameGeometry = getClientDesiredFrame(110);
        Assert.equalRects(client.frameGeometry, getTiledFrame(110), { message: "We should re-arrange the window, respecting its new desired width" });

        client.frameGeometry = getClientDesiredFrame(120);
        Assert.equalRects(client.frameGeometry, getTiledFrame(120), { message: "We should re-arrange the window, respecting its new desired width" });

        client.frameGeometry = getClientDesiredFrame(200);
        Assert.equalRects(client.frameGeometry, getClientDesiredFrame(200), { message: "We should give up and let the client have its desired frame" });
    }

    timeControl(addTime => {
        testExternalResizing();
        addTime(1000);
        // the concession has expired, let's test again
        testExternalResizing();
    });
});
