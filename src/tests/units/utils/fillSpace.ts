tests.register("fillSpace", 1, () => {
    const testCases: {
        availableSpace: number,
        items: { min: number, max: number }[],
        check: (result: number) => boolean,
    }[] = [
        {
            availableSpace: 600,
            items: [
                { min: 10, max: 600 },
                { min: 10, max: 600 },
            ],
            check: r => r === 300,
        },
        {
            availableSpace: 600,
            items: [
                { min: 10, max: 250 },
                { min: 10, max: 500 },
            ],
            check: r => r === 350,
        },
        {
            availableSpace: 600,
            items: [
                { min: 10, max: 250 },
                { min: 400, max: 500 },
            ],
            check: r => r === 200,
        },
        {
            availableSpace: 765,
            items: [
                { min: 10, max: 250 },
                { min: 10, max: 254 },
                { min: 10, max: 500 },
            ],
            check: r => r === 261,
        },
        {
            availableSpace: 600,
            items: [
                { min: 10, max: 150 },
                { min: 400, max: 500 },
            ],
            check: r => r === 450,
        },
        {
            availableSpace: 750,
            items: [
                { min: 10, max: 250 },
                { min: 10, max: 250 },
                { min: 400, max: 500 },
                { min: 10, max: 300 },
            ],
            check: r => r === 116,
        },
        {
            availableSpace: 750,
            items: [
                { min: 10, max: 250 },
                { min: 120, max: 250 },
                { min: 400, max: 500 },
                { min: 10, max: 300 },
            ],
            check: r => r === 115,
        },
        {
            availableSpace: 1200,
            items: [
                { min: 10, max: 250 },
                { min: 10, max: 500 },
            ],
            check: r => r >= 500,
        },
        {
            availableSpace: 5,
            items: [
                { min: 10, max: 250 },
                { min: 10, max: 500 },
            ],
            check: r => r <= 10,
        },
        {
            availableSpace: 800,
            items: [
                { min: 114, max: 800 },
                { min: 10, max: 93 },
                { min: 10, max: 93 },
                { min: 10, max: 93 },
                { min: 10, max: 93 },
                { min: 10, max: 93 },
                { min: 109, max: 800 },
                { min: 10, max: 800 },
            ],
            check: r => r === 110,
        },
    ];

    for (const testCase of testCases) {
        const result = fillSpace(testCase.availableSpace, testCase.items);
        Assert.assert(
            testCase.check(result),
            { message: `got ${result} for test case ${JSON.stringify(testCase)}` },
        );
    }
});
