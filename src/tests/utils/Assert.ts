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
        if (runLog !== undefined) {
            for (const message of runLog) {
                console.log("    " + message);
            }
        }

        process.exit(1);
    }

    function getStackTrace(skip: number) {
        return new Error().stack!.split("\n").slice(skip+2).join("\n");
    }

    function appendMessage(base: string, message?: string) {
        if (message === undefined) {
            return base;
        }
        return `${base}
    Message: ${message}`;
    }

    function buildMessage(actual: any, expected: any, header: string, message?: string) {
        return appendMessage(
            `${header}
    Expected: ${expected}
    Actual: ${actual}`,
            message,
        );
    }

    export function equal(
        actual: any,
        expected: any,
        { message, skip=0 }: Options = {},
    ) {
        assert(
            expected === actual,
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

    export function between(
        actual: any,
        min: any,
        max: any,
        { message, skip=0 }: Options = {},
    ) {
        assert(
            actual >= min && actual <= max,
            {
                message: buildMessage(actual, `[${min}, ${max}]`, "Value not in range", message),
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
        columnWidth: number,
        grid: KwinClient[][],
        centered: boolean,
        { message, skip=0 }: Options = {},
    ) {
        const nColumns = grid.length;
        const columnHeight = screen.height - config.gapsOuterTop - config.gapsOuterBottom;
        const columnsWidth = nColumns * columnWidth + (nColumns-1) * config.gapsInnerHorizontal;
        const startX = centered ?
            screen.x + (screen.width - columnsWidth) / 2 :
            grid[0][0].frameGeometry.x;

        // assumes uniformly sized windows within columns of uniform width
        function getRectInGrid(column: number, window: number, nColumns: number, nWindows: number) {
            const windowHeight = (columnHeight - config.gapsInnerVertical * (nWindows-1)) / nWindows;
            return new MockQmlRect(
                startX + column * (columnWidth + config.gapsInnerHorizontal),
                screen.y + config.gapsOuterTop + (windowHeight + config.gapsInnerVertical) * window,
                columnWidth,
                (columnHeight - config.gapsInnerVertical * (nWindows-1)) / nWindows,
            );
        }

        for (let iColumn = 0; iColumn < nColumns; iColumn++) {
            const column = grid[iColumn];
            const nWindows = column.length;
            for (let iWindow = 0; iWindow < nWindows; iWindow++) {
                const window = column[iWindow];
                equalRects(
                    window.frameGeometry,
                    getRectInGrid(iColumn, iWindow, nColumns, nWindows),
                    { message: appendMessage(`column ${iColumn}, window ${iWindow}`, message), skip: skip+1 },
                );
            }
        }
    }

    export function centered(
        config: Config,
        screen: QmlRect,
        client:KwinClient,
        { message, skip=0 }: Options = {},
    ) {
        grid(
            config,
            screen,
            client.frameGeometry.width,
            [[client]],
            true,
            { message: appendMessage("Window not centered", message), skip: skip+1 },
        );
    }

    export function fullyVisible(
        rect: QmlRect,
        { message, skip=0 }: Options = {},
    ) {
        assert(
            rect.left >= tilingArea.left && rect.right <= tilingArea.right,
            {
                message: appendMessage(`Rect ${rect} not fully visible`, message),
                skip: skip + 1,
            },
        );
    }

    export function notFullyVisible(
        rect: QmlRect,
        { message, skip=0 }: Options = {},
    ) {
        assert(
            rect.left < tilingArea.left || rect.right > tilingArea.right,
            {
                message: appendMessage(`Rect ${rect} is fully visible, but shouldn't be`, message),
                skip: skip + 1,
            },
        );
    }

    export function columnsFillTilingArea(
        columns: KwinClient[],
        { message, skip=0 }: Options = {},
    ) {
        const options = { message: message, skip: skip+1 };
        let x = tilingArea.left;
        for (const column of columns) {
            const width = column.frameGeometry.width;
            fullyVisible(column.frameGeometry, options);
            rect(column.frameGeometry, x, tilingArea.top, width, tilingArea.height, options);
            x += width + gapH;
        }
        equal(columns[columns.length-1].frameGeometry.right, tilingArea.right, options);
    }

    export function tiledClient(
        clientManager: ClientManager,
        client: KwinClient,
        { message, skip=0 }: Options = {},
    ) {
        assert(
            clientManager.findTiledWindow(client) !== null,
            { message: message, skip: skip+1 },
        );
    }

    export function notTiledClient(
        clientManager: ClientManager,
        client: KwinClient,
        { message, skip=0 }: Options = {},
    ) {
        assert(
            clientManager.findTiledWindow(client) === null,
            { message: message, skip: skip+1 },
        );
    }
}
