tests.register("math", 1, () => {
    const rect = new MockQmlRect(100, 200, 10, 20);
    const testCases: {
        rect: QmlRect,
        point: QmlPoint,
        contained: boolean,
    }[] = [
        {
            rect: rect,
            point: new MockQmlPoint(100, 200),
            contained: true,
        },
        {
            rect: rect,
            point: new MockQmlPoint(110, 220),
            contained: true,
        },
        {
            rect: rect,
            point: new MockQmlPoint(105, 205),
            contained: true,
        },
        {
            rect: rect,
            point: new MockQmlPoint(110.01, 205),
            contained: false,
        },
        {
            rect: rect,
            point: new MockQmlPoint(105, 220.01),
            contained: false,
        },
        {
            rect: rect,
            point: new MockQmlPoint(16, 205),
            contained: false,
        },
        {
            rect: rect,
            point: new MockQmlPoint(105, 16),
            contained: false,
        },
    ];

    for (const testCase of testCases) {
        const result = rectContainsPoint(testCase.rect, testCase.point);
        Assert.equal(
            result,
            testCase.contained,
            { message: JSON.stringify(testCase) },
        );
    }
});
