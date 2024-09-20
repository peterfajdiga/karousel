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

function assertRect(actual: QmlRect, x: number, y: number, width: number, height: number) {
    assertRectEqual(actual, new MockQmlRect(x, y, width, height), 1);
}
