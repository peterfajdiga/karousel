namespace Assert {
    type Options = {
        message?: string,
        skip?: number,
    }

    export function assert(
        assertion: boolean,
        { message, skip=0 }: Options = {},
    ) {
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

    function buildMessage(actual: any, expected: any, header: string, message?: string) {
        return `${header}
    Expected: ${expected}
    Actual: ${actual}` + (message === undefined ? "" : `
    Message: ${message}`);
    }

    export function equal(
        actual: any,
        expected: any,
        { message, skip=0 }: Options = {},
    ) {
        assert(
            expected == actual,
            {
                message: buildMessage(actual, expected, "Values not equal", message),
                skip: skip + 1,
            },
        );
    }

    export function equalArrays(
        actual: any[],
        expected: any[],
        { message, skip=0 }: Options = {},
    ) {
        assert(
            actual.length === expected.length && actual.every((item, index) => item === expected[index]),
            {
                message: buildMessage(actual, expected, "Arrays not equal", message),
                skip: skip + 1,
            },
        );
    }

    export function equalRects(
        actual: QmlRect,
        expected: QmlRect,
        { message, skip=0 }: Options = {},
    ) {
        assert(
            rectEquals(expected, actual),
            {
                message: buildMessage(actual, expected, "QmlRect not equal", message),
                skip: skip + 1,
            },
        );
    }

    export function rect(
        actual: QmlRect,
        x: number,
        y: number,
        width: number,
        height: number,
        { message, skip=0 }: Options = {},
    ) {
        equalRects(
            actual,
            new MockQmlRect(x, y, width, height),
            { message: message, skip: skip+1 },
        );
    }

    export function grid(
        config: Config,
        screen: QmlRect,
        grid: KwinClient[][],
        { message, skip=0 }: Options = {},
    ) {
        // assumes uniformly sized windows within columns of width 100
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
                equalRects(
                    window.frameGeometry,
                    getRectInGrid(iColumn, iWindow, nColumns, nWindows),
                    { message: message, skip: skip+1 },
                );
            }
        }
    }
}
