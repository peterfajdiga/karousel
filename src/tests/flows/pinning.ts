tests.register("Pin", 20, () => {
    const { qtMock, workspaceMock } = initMocks();
    const config = getDefaultConfig();
    const world = new World(config);

    const screenFull = new MockQmlRect(0, 0, screenWidth, screenHeight);
    const screenHalfLeft = new MockQmlRect(0, 0, screenWidth/2, screenHeight);
    const screenHalfRight = new MockQmlRect(screenWidth/2, 0, screenWidth/2, screenHeight);

    const tiled1 = new MockKwinClient(
        1,
        "app1",
        "Application 1",
        new MockQmlRect(10, 20, 100, 200),
    );

    const tiled2 = new MockKwinClient(
        2,
        "app2",
        "Application 2",
        new MockQmlRect(10, 20, 100, 200),
    );

    const pinned = new MockKwinClient(
        3,
        "browser",
        "Documentation - Browser",
        new MockQmlRect(10, 20, 100, 200),
    );

    function getRectInGrid(screen: QmlRect, column: number, window: number, nColumns: number, nWindows: number) {
        const columnHeight = screen.height - config.gapsOuterTop - config.gapsOuterBottom;
        const columnsWidth = nColumns * 100 + (nColumns-1) * config.gapsInnerHorizontal;
        const windowHeight = (columnHeight - config.gapsInnerVertical * (nWindows-1)) / nWindows;
        return new MockQmlRect(
            screen.x + column * (100 + config.gapsInnerHorizontal) + (screen.width-columnsWidth) / 2,
            screen.y + config.gapsOuterTop + (windowHeight + config.gapsInnerVertical) * window,
            100,
            (columnHeight - config.gapsInnerVertical * (nWindows-1)) / nWindows,
        );
    }

    function assertGrid(screen: QmlRect, grid: KwinClient[][]) {
        const nColumns = grid.length;
        for (let iColumn = 0; iColumn < nColumns; iColumn++) {
            const column = grid[iColumn];
            const nWindows = column.length;
            for (let iWindow = 0; iWindow < nWindows; iWindow++) {
                const window = column[iWindow];
                assertRectEqual(window.frameGeometry, getRectInGrid(screen, iColumn, iWindow, nColumns, nWindows), 1);
            }
        }
    }

    workspaceMock.createWindow(pinned);
    workspaceMock.createWindow(tiled1);
    workspaceMock.createWindow(tiled2);
    assertGrid(screenFull, [ [pinned], [tiled1], [tiled2] ]);

    pinned.pin(screenHalfLeft);
    assertRectEqual(pinned.frameGeometry, screenHalfLeft);
    assertGrid(screenHalfRight, [ [tiled1], [tiled2] ]);

    pinned.pin(screenHalfRight);
    assertRectEqual(pinned.frameGeometry, screenHalfRight);
    assertGrid(screenHalfLeft, [ [tiled1], [tiled2] ]);

    pinned.unpin();
    assertRectEqual(pinned.frameGeometry, screenHalfRight);
    assertGrid(screenFull, [ [tiled1], [tiled2] ]);

    pinned.pin(screenHalfRight);
    assertRectEqual(pinned.frameGeometry, screenHalfRight);
    assertGrid(screenHalfLeft, [ [tiled1], [tiled2] ]);

    pinned.minimized = true;
    assertGrid(screenFull, [ [tiled1], [tiled2] ]);

    pinned.minimized = false;
    assertRectEqual(pinned.frameGeometry, screenHalfRight);
    assertGrid(screenHalfLeft, [ [tiled1], [tiled2] ]);

    workspaceMock.activeWindow = pinned;
    qtMock.fireShortcut("karousel-window-toggle-floating");
    assert(pinned.tile === null);
    pinned.frameGeometry = new MockQmlRect(10, 20, 100, 200); // This is needed because the window's preferredWidth can change when pinning, because frameGeometryChanged can fire before tileChanged. TODO: Ensure pinned window keeps its preferredWidth.
    assertGrid(screenFull, [ [tiled1], [tiled2], [pinned] ]);
});
