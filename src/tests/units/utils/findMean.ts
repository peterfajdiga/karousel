tests.register("findMean", 1, () => {
    const testCases: {
        sum: number,
        constraints: { min: number, max: number }[],
        check: (result: number) => boolean,
    }[] = [
        {
            sum: 600,
            constraints: [
                { min: 10, max: 600 },
                { min: 10, max: 600 },
            ],
            check: r => r === 300,
        },
        {
            sum: 600,
            constraints: [
                { min: 10, max: 250 },
                { min: 10, max: 500 },
            ],
            check: r => r === 350,
        },
        {
            sum: 600,
            constraints: [
                { min: 10, max: 250 },
                { min: 400, max: 500 },
            ],
            check: r => r === 200,
        },
        {
            sum: 765,
            constraints: [
                { min: 10, max: 250 },
                { min: 10, max: 254 },
                { min: 10, max: 500 },
            ],
            check: r => r === 261,
        },
        {
            sum: 600,
            constraints: [
                { min: 10, max: 150 },
                { min: 400, max: 500 },
            ],
            check: r => r === 450,
        },
        {
            sum: 750,
            constraints: [
                { min: 10, max: 250 },
                { min: 10, max: 250 },
                { min: 400, max: 500 },
                { min: 10, max: 300 },
            ],
            check: r => r === 116,
        },
        {
            sum: 750,
            constraints: [
                { min: 10, max: 250 },
                { min: 120, max: 250 },
                { min: 400, max: 500 },
                { min: 10, max: 300 },
            ],
            check: r => r === 115,
        },
        {
            sum: 1200,
            constraints: [
                { min: 10, max: 250 },
                { min: 10, max: 500 },
            ],
            check: r => r >= 500,
        },
        {
            sum: 5,
            constraints: [
                { min: 10, max: 250 },
                { min: 10, max: 500 },
            ],
            check: r => r <= 10,
        },
        {
            sum: 800,
            constraints: [
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
        const result = findMeanInt(testCase.sum, testCase.constraints);
        Assert.assert(
            testCase.check(result),
            { message: `got ${result} for test case ${JSON.stringify(testCase)}` },
        );
    }
});
