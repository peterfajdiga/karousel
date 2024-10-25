tests.register("fillSpace", 1, () => {
    const testCases: {
        availableSpace: number,
        items: { min: number, max: number }[],
        expected: number[],
    }[] = [
        {
            availableSpace: 600,
            items: [
                { min: 10, max: 600 },
                { min: 10, max: 600 },
            ],
            expected: [300, 300],
        },
        {
            availableSpace: 600,
            items: [
                { min: 10, max: 250 },
                { min: 10, max: 500 },
            ],
            expected: [250, 350],
        },
        {
            availableSpace: 600,
            items: [
                { min: 10, max: 250 },
                { min: 400, max: 500 },
            ],
            expected: [200, 400],
        },
        {
            availableSpace: 765,
            items: [
                { min: 10, max: 250 },
                { min: 10, max: 254 },
                { min: 10, max: 500 },
            ],
            expected: [250, 254, 261],
        },
        {
            availableSpace: 600,
            items: [
                { min: 10, max: 150 },
                { min: 400, max: 500 },
            ],
            expected: [150, 450],
        },
        {
            availableSpace: 750,
            items: [
                { min: 10, max: 250 },
                { min: 10, max: 250 },
                { min: 400, max: 500 },
                { min: 10, max: 300 },
            ],
            expected: [116, 116, 400, 116],
        },
        {
            availableSpace: 750,
            items: [
                { min: 10, max: 250 },
                { min: 120, max: 250 },
                { min: 400, max: 500 },
                { min: 10, max: 300 },
            ],
            expected: [115, 120, 400, 115],
        },
        {
            availableSpace: 1200,
            items: [
                { min: 10, max: 250 },
                { min: 10, max: 500 },
            ],
            expected: [250, 500],
        },
        {
            availableSpace: 5,
            items: [
                { min: 10, max: 250 },
                { min: 10, max: 500 },
            ],
            expected: [10, 10],
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
            expected: [114, 93, 93, 93, 93, 93, 110, 110],
        },
    ];

    for (const testCase of testCases) {
        const result = fillSpace(testCase.availableSpace, testCase.items);
        Assert.equalArrays(
            result,
            testCase.expected,
            { message: JSON.stringify(testCase) },
        );
    }
});
