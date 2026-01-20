namespace Assert {
    interface Options {
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
        tilingArea: QmlRect,
        columnWidths: number[] | number,
        grid: KwinClient[][],
        centered: boolean,
        stackedColumns: number[] = [],
        { message, skip=0 }: Options = {},
    ) {
        const nColumns = grid.length;
        function getGridWidth() {
            function getColumnsWidth() {
                if (columnWidths instanceof Array) {
                    let columnsWidth = 0;
                    for (const columnWidth of columnWidths) {
                        columnsWidth += columnWidth;
                    }
                    return columnsWidth;
                } else {
                    return nColumns * columnWidths;
                }
            }

            const gapsWidth = (nColumns-1) * config.gapsInnerHorizontal;
            return getColumnsWidth() + gapsWidth;
        }

        function getColumnWidth(column: number) {
            if (columnWidths instanceof Array) {
                return columnWidths[column];
            } else {
                return columnWidths;
            }
        }

        const gridWidth = getGridWidth();
        const startX = centered ?
            tilingArea.x + (tilingArea.width - gridWidth) / 2 :
            grid[0][0].frameGeometry.x;

        function getColumnX(column: number) {
            if (columnWidths instanceof Array) {
                let x = startX;
                for (let i = 0; i < column; i++) {
                    x += columnWidths[i] + config.gapsInnerHorizontal;
                }
                return x;
            } else {
                return startX + column * (columnWidths + config.gapsInnerHorizontal);
            }
        }

        // assumes uniformly sized windows within columns of uniform width
        function getRectInGrid(column: number, window: number, nColumns: number, nWindows: number) {
            const columnWidth = getColumnWidth(column);
            const windowHeight = (tilingArea.height - config.gapsInnerVertical * (nWindows-1)) / nWindows;
            return new MockQmlRect(
                getColumnX(column),
                tilingArea.y + (windowHeight + config.gapsInnerVertical) * window,
                columnWidth,
                (tilingArea.height - config.gapsInnerVertical * (nWindows-1)) / nWindows,
            );
        }

        function getRectInGridStacked(column: number, window: number, nColumns: number, nWindows: number) {
            const columnWidth = getColumnWidth(column);
            return new MockQmlRect(
                getColumnX(column) + (nWindows-window-1) * config.stackOffsetX,
                tilingArea.y + window * config.stackOffsetY,
                columnWidth - (nWindows-1) * config.stackOffsetX,
                tilingArea.height - (nWindows-1) * config.stackOffsetY,
            );
        }

        for (let iColumn = 0; iColumn < nColumns; iColumn++) {
            const column = grid[iColumn];
            const stacked = stackedColumns.includes(iColumn);
            const getRect = stacked ? getRectInGridStacked : getRectInGrid;
            const nWindows = column.length;
            for (let iWindow = 0; iWindow < nWindows; iWindow++) {
                const window = column[iWindow];
                equalRects(
                    window.frameGeometry,
                    getRect(iColumn, iWindow, nColumns, nWindows),
                    { message: appendMessage(`column ${iColumn}, window ${iWindow}`, message), skip: skip+1 },
                );
            }
        }
    }

    export function centered(
        config: Config,
        tilingArea: QmlRect,
        client:KwinClient,
        { message, skip=0 }: Options = {},
    ) {
        grid(
            config,
            tilingArea,
            client.frameGeometry.width,
            [[client]],
            true,
            [],
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
