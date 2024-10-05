tests.register("column shrink left", 1, () => {
    const baseTestCases = [
        { widths: [500, 500], blocked: [false, false], possible: true },
        { widths: [500, 768], blocked: [false, false], possible: true },
        { widths: [500, 500], blocked: [false, true], possible: true },
        { widths: [500, 200, 200], blocked: [false, false, false], possible: true },
        { widths: [500, 200, 200], blocked: [false, false, true], possible: true },
        { widths: [500, 200, 200], blocked: [true, false, true], possible: true },
        { widths: [500, 500, 500], blocked: [false, true, true], possible: false },
    ];

    const testCasesLeft = baseTestCases.map((baseTestCase, i) => ({
        ...baseTestCase,
        name: "left " + i,
        action: "karousel-column-shrink-left",
        focus: baseTestCase.widths.length-1,
    }));

    const testCasesRight = baseTestCases.map((baseTestCase, i) => ({
        ...baseTestCase,
        widths: baseTestCase.widths.slice().reverse(),
        blocked: baseTestCase.blocked.slice().reverse(),
        name: "right " + i,
        action: "karousel-column-shrink-right",
        focus: 0,
    }));

    const testCases = [...testCasesLeft, ...testCasesRight];

    for (const testCase of testCases) {
        const assertOpt = { message: `Case: ${testCase.name}` };

        const config = getDefaultConfig();
        const { qtMock, workspaceMock, world } = init(config);

        const clients = workspaceMock.createClientsWithWidths(...testCase.widths);
        workspaceMock.activeWindow = clients[testCase.focus];
        for (let i = 0; i < clients.length; i++) {
            if (testCase.blocked[i]) {
                clients[i].minSize = new MockQmlSize(testCase.widths[i], 100);
            }
        }

        if (testCase.possible) {
            qtMock.fireShortcut(testCase.action);
            Assert.columnsFillTilingArea(clients, assertOpt);
            for (let i = 0; i < clients.length; i++) {
                if (testCase.blocked[i]) {
                    Assert.equal(clients[i].frameGeometry.width, testCase.widths[i], assertOpt);
                }
            }
        }

        const frames = clients.map(client => client.frameGeometry);
        qtMock.fireShortcut(testCase.action);
        const newFrames = clients.map(client => client.frameGeometry);
        for (let i = 0; i < clients.length; i++) {
            Assert.equalRects(frames[i], newFrames[i], assertOpt);
        }
    }
});

tests.register("column shrink left (just scroll)", 1, () => {
    const config = getDefaultConfig();
    const { qtMock, workspaceMock, world } = init(config);

    const [ clientLeft, clientMiddle, clientRight ] = workspaceMock.createClientsWithWidths(300, 300, 300);
    workspaceMock.activeWindow = clientMiddle;
    Assert.notFullyVisible(clientLeft.frameGeometry);
    Assert.fullyVisible(clientMiddle.frameGeometry);
    Assert.fullyVisible(clientRight.frameGeometry);

    qtMock.fireShortcut("karousel-column-shrink-left");
    Assert.fullyVisible(clientLeft.frameGeometry);
    Assert.fullyVisible(clientMiddle.frameGeometry);
    Assert.notFullyVisible(clientRight.frameGeometry);
});
