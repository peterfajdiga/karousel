function assert(assertion: boolean, message?: string, skip: number = 0) {
    if (assertion) {
        return;
    }

    if (message != undefined) {
        console.assert(assertion, message);
    } else {
        console.assert(assertion);
    }

    console.log(getStackTrace(skip+1));

    console.log("Random branches:");
    for (const message of runLog) {
        console.log("    " + message);
    }

    process.exit(1);
}

function getStackTrace(skip: number) {
    return new Error().stack!.split("\n").slice(skip+2).join("\n");
}

function assertEqual(actual: any, expected: any, skip: number = 0) {
    assert(expected == actual, `Values not equal
Expected: ${expected}
Actual: ${actual}`, skip+1);
}

function assertRectEqual(actual: QmlRect, expected: QmlRect, skip: number = 0) {
    assert(rectEquals(expected, actual), `QmlRect not equal
Expected: ${expected}
Actual: ${actual}`, skip+1);
}

function assertRect(actual: QmlRect, x: number, y: number, width: number, height: number, skip: number = 0) {
    assertRectEqual(actual, new MockQmlRect(x, y, width, height), skip+1);
}

function assertGrid(config: Config, screen: QmlRect, grid: KwinClient[][], skip: number = 0) {
    // assumes uniformly sized columns and windows within columns
    function getRectInGrid(column: number, window: number, nColumns: number, nWindows: number) {
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

    const nColumns = grid.length;
    for (let iColumn = 0; iColumn < nColumns; iColumn++) {
        const column = grid[iColumn];
        const nWindows = column.length;
        for (let iWindow = 0; iWindow < nWindows; iWindow++) {
            const window = column[iWindow];
            assertRectEqual(window.frameGeometry, getRectInGrid(iColumn, iWindow, nColumns, nWindows), skip+1);
        }
    }
}
