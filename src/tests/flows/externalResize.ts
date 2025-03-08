tests.register("External resize", 1, () => {
    const config = getDefaultConfig();
    const { qtMock, workspaceMock, world } = init(config);

    function getClientDesiredFrame(width: number) {
        return new MockQmlRect(10, 10, width, 200);
    }

    function getTiledFrame(width: number) {
        return new MockQmlRect(
            tilingArea.left + Math.round((tilingArea.width - width) / 2),
            tilingArea.top,
            width,
            tilingArea.height,
        );
    }

    const [client] = workspaceMock.createClientsWithFrames(getClientDesiredFrame(100));
    Assert.equalRects(client.frameGeometry, getTiledFrame(100), { message: "We should tile the window, respecting its desired width" });

    function testExternalResizing() {
        client.frameGeometry = getClientDesiredFrame(110);
        Assert.equalRects(client.frameGeometry, getTiledFrame(110), { message: "We should re-arrange the window, respecting its new desired width" });

        client.frameGeometry = getClientDesiredFrame(120);
        Assert.equalRects(client.frameGeometry, getTiledFrame(120), { message: "We should re-arrange the window, respecting its new desired width" });

        client.frameGeometry = getClientDesiredFrame(130);
        Assert.equalRects(client.frameGeometry, getTiledFrame(130), { message: "We should re-arrange the window, respecting its new desired width" });

        client.frameGeometry = getClientDesiredFrame(140);
        Assert.equalRects(client.frameGeometry, getTiledFrame(140), { message: "We should re-arrange the window, respecting its new desired width" });

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
