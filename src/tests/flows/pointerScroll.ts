tests.register("pointer scroll methods", 5, () => {
    const config = getDefaultConfig();
    const { workspaceMock, world } = init(config);

    const clients = workspaceMock.createClientsWithWidths(300, 300, 300, 300);
    const [client1, client2, client3, client4] = clients;

    Assert.notFullyVisible(client1.getActualFrameGeometry(), { message: "initial client1" });
    Assert.notFullyVisible(client2.getActualFrameGeometry(), { message: "initial client2" });
    Assert.fullyVisible(client3.getActualFrameGeometry(), { message: "initial client3" });
    Assert.fullyVisible(client4.getActualFrameGeometry(), { message: "initial client4" });

    world.scrollColumnLeft();
    Assert.notFullyVisible(client1.getActualFrameGeometry(), { message: "after left client1" });
    Assert.fullyVisible(client2.getActualFrameGeometry(), { message: "after left client2" });
    Assert.fullyVisible(client3.getActualFrameGeometry(), { message: "after left client3" });
    Assert.notFullyVisible(client4.getActualFrameGeometry(), { message: "after left client4" });

    world.scrollColumnRight();
    Assert.notFullyVisible(client1.getActualFrameGeometry(), { message: "after right client1" });
    Assert.notFullyVisible(client2.getActualFrameGeometry(), { message: "after right client2" });
    Assert.fullyVisible(client3.getActualFrameGeometry(), { message: "after right client3" });
    Assert.fullyVisible(client4.getActualFrameGeometry(), { message: "after right client4" });
});

tests.register("pointer scroll boundaries", 5, () => {
    const config = getDefaultConfig();
    const { workspaceMock, world } = init(config);

    const clients = workspaceMock.createClientsWithWidths(300, 300, 300);
    const [client1, client2, client3] = clients;

    world.scrollColumnLeft();
    Assert.fullyVisible(client1.getActualFrameGeometry(), { message: "scroll to start client1" });
    Assert.fullyVisible(client2.getActualFrameGeometry(), { message: "scroll to start client2" });
    Assert.notFullyVisible(client3.getActualFrameGeometry(), { message: "scroll to start client3" });

    const startFrames = clients.map(client => client.getActualFrameGeometry().clone());
    world.scrollColumnLeft();
    clients.forEach((client, index) => {
        Assert.equalRects(client.getActualFrameGeometry(), startFrames[index], { message: `start boundary ${index}` });
    });

    world.scrollColumnRight();
    Assert.notFullyVisible(client1.getActualFrameGeometry(), { message: "scroll to end client1" });
    Assert.fullyVisible(client2.getActualFrameGeometry(), { message: "scroll to end client2" });
    Assert.fullyVisible(client3.getActualFrameGeometry(), { message: "scroll to end client3" });

    const endFrames = clients.map(client => client.getActualFrameGeometry().clone());
    world.scrollColumnRight();
    clients.forEach((client, index) => {
        Assert.equalRects(client.getActualFrameGeometry(), endFrames[index], { message: `end boundary ${index}` });
    });
});

tests.register("screen edge repeated scroll", 5, () => {
    const config = getDefaultConfig();
    config.screenEdgeScrollColumns = true;
    const { workspaceMock, world } = init(config);

    const clients = workspaceMock.createClientsWithWidths(300, 300, 300, 300);
    const [client1, client2, client3, client4] = clients;

    world.triggerScreenEdgeLeft();
    Assert.notFullyVisible(client1.getActualFrameGeometry(), { message: "first trigger client1" });
    Assert.fullyVisible(client2.getActualFrameGeometry(), { message: "first trigger client2" });
    Assert.fullyVisible(client3.getActualFrameGeometry(), { message: "first trigger client3" });
    Assert.notFullyVisible(client4.getActualFrameGeometry(), { message: "first trigger client4" });

    world.triggerScreenEdgeLeft();
    Assert.fullyVisible(client1.getActualFrameGeometry(), { message: "second trigger client1" });
    Assert.fullyVisible(client2.getActualFrameGeometry(), { message: "second trigger client2" });
    Assert.notFullyVisible(client3.getActualFrameGeometry(), { message: "second trigger client3" });
    Assert.notFullyVisible(client4.getActualFrameGeometry(), { message: "second trigger client4" });
});

tests.register("screen edge scroll requires cursor at edge", 5, () => {
    const config = getDefaultConfig();
    config.screenEdgeScrollColumns = true;
    const { workspaceMock, world } = init(config);

    const clients = workspaceMock.createClientsWithWidths(300, 300, 300, 300);
    const [client1, client2, client3, client4] = clients;
    const framesBeforeEdge = clients.map(client => client.getActualFrameGeometry().clone());

    workspaceMock.cursorPos.x = screen.x + 1;
    world.triggerScreenEdgeLeftIfCursorStillAtEdge();
    clients.forEach((client, index) => {
        Assert.equalRects(client.getActualFrameGeometry(), framesBeforeEdge[index], { message: `not at edge ${index}` });
    });

    workspaceMock.cursorPos.x = screen.x;
    world.triggerScreenEdgeLeftIfCursorStillAtEdge();
    Assert.notFullyVisible(client1.getActualFrameGeometry(), { message: "at edge client1" });
    Assert.fullyVisible(client2.getActualFrameGeometry(), { message: "at edge client2" });
    Assert.fullyVisible(client3.getActualFrameGeometry(), { message: "at edge client3" });
    Assert.notFullyVisible(client4.getActualFrameGeometry(), { message: "at edge client4" });
});

tests.register("screen edge scroll disabled", 5, () => {
    const config = getDefaultConfig();
    config.screenEdgeScrollColumns = false;
    const { workspaceMock, world } = init(config);

    const clients = workspaceMock.createClientsWithWidths(300, 300, 300, 300);
    const frames = clients.map(client => client.getActualFrameGeometry().clone());

    world.triggerScreenEdgeLeft();
    world.triggerScreenEdgeRight();

    clients.forEach((client, index) => {
        Assert.equalRects(client.getActualFrameGeometry(), frames[index], { message: `disabled ${index}` });
    });
});

tests.register("pointer scroll config defaults", 1, () => {
    const config = getDefaultConfig();
    Assert.equal(config.screenEdgeScrollColumns, false);
    Assert.equal(config.screenEdgeScrollDelay, 200);
});
