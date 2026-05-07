tests.register("columns squeeze side", 5, () => {
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
        action: "karousel-columns-squeeze-left",
        focus: baseTestCase.widths.length-1,
    }));

    const testCasesRight = baseTestCases.map((baseTestCase, i) => ({
        ...baseTestCase,
        widths: baseTestCase.widths.slice().reverse(),
        blocked: baseTestCase.blocked.slice().reverse(),
        name: "right " + i,
        action: "karousel-columns-squeeze-right",
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
                    Assert.equal(clients[i].getActualFrameGeometry().width, testCase.widths[i], assertOpt);
                }
            }
        }

        const frames = clients.map(client => client.getActualFrameGeometry());
        qtMock.fireShortcut(testCase.action);
        const newFrames = clients.map(client => client.getActualFrameGeometry());
        for (let i = 0; i < clients.length; i++) {
            Assert.equalRects(frames[i], newFrames[i], assertOpt);
        }
    }
});

tests.register("columns squeeze side (just scroll)", 5, () => {
    const baseTestCases = [
        { focus: 0, startVisible: [true, true, false], endVisible: [true, true, false] },
        { focus: 1, startVisible: [false, true, true], endVisible: [true, true, false] },
        { focus: 2, startVisible: [false, true, true], endVisible: [false, true, true] },
    ];

    const testCasesLeft = baseTestCases.map((baseTestCase, i) => ({
        ...baseTestCase,
        name: "left " + i,
        action: "karousel-columns-squeeze-left",
        scrollStart: false,
    }));

    const testCasesRight = baseTestCases.map((baseTestCase, i) => ({
        focus: 2 - baseTestCase.focus,
        startVisible: baseTestCase.startVisible.slice().reverse(),
        endVisible: baseTestCase.endVisible.slice().reverse(),
        name: "right " + i,
        action: "karousel-columns-squeeze-right",
        scrollStart: true,
    }));

    const testCases = [...testCasesLeft, ...testCasesRight];

    for (const testCase of testCases) {
        const assertMsg = `Case: ${testCase.name}`;

        const config = getDefaultConfig();
        const { qtMock, workspaceMock, world } = init(config);

        function assertVisible(clients: MockKwinClient[], visible: boolean[]) {
            for (let i = 0; i < clients.length; i++) {
                if (visible[i]) {
                    Assert.fullyVisible(clients[i].getActualFrameGeometry(), { message: assertMsg, skip: 1 });
                } else {
                    Assert.notFullyVisible(clients[i].getActualFrameGeometry(), { message: assertMsg, skip: 1 });
                }
            }
        }

        const clients = workspaceMock.createClientsWithWidths(300, 300, 300);
        for (const client of clients) {
            client.minSize = new MockQmlSize(300, 100);
        }
        if (testCase.scrollStart) {
            qtMock.fireShortcut("karousel-grid-scroll-start");
        }
        workspaceMock.activeWindow = clients[testCase.focus];
        assertVisible(clients, testCase.startVisible);

        qtMock.fireShortcut(testCase.action);
        assertVisible(clients, testCase.endVisible);

        const frames = clients.map(client => client.getActualFrameGeometry());
        qtMock.fireShortcut(testCase.action);
        const newFrames = clients.map(client => client.getActualFrameGeometry());
        for (let i = 0; i < clients.length; i++) {
            Assert.equalRects(frames[i], newFrames[i], { message: assertMsg });
        }
    }
});
