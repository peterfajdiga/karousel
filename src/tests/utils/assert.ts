function assert(assertion: boolean, message?: string) {
    if (assertion) {
        return;
    }

    if (message != undefined) {
        console.assert(assertion, message);
    } else {
        console.assert(assertion);
    }
    console.trace();
    process.exit(1);
}

function assertEqual(actual: any, expected: any) {
    assert(expected == actual, `Values not equal
Expected: ${expected}
Actual: ${actual}`);
}

function assertRectEqual(actual: QmlRect, expected: QmlRect) {
    assert(rectEquals(expected, actual), `QmlRect not equal
Expected: ${expected}
Actual: ${actual}`);
}

function assertRect(actual: QmlRect, x: number, y: number, width: number, height: number) {
    assertRectEqual(actual, new MockQmlRect(x, y, width, height));
}
