tests.register("fillSpace", 1, () => {
    const testCases: {
        availableSpace: number,
        items: { min: number, max: number }[],
        expected: number[],
    }[] = [
        {
            availableSpace: 600,
            items: [],
            expected: [],
        },
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
        {
            availableSpace: 801,
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
            expected: [114, 93, 93, 93, 93, 93, 111, 111],
        },
        {
            availableSpace: 801,
            items: [
                { min: 114, max: 800 },
                { min: 10, max: 93 },
                { min: 10, max: 93 },
                { min: 10, max: 93 },
                { min: 10, max: 93 },
                { min: 10, max: 93 },
                { min: 109, max: 800 },
                { min: 10, max: 95 },
            ],
            expected: [120, 93, 93, 93, 93, 93, 120, 95],
        },
        {
            availableSpace: 799,
            items: [
                { min: 10, max: 86 },
                { min: 107, max: 800 },
                { min: 107, max: 800 },
                { min: 107, max: 800 },
                { min: 107, max: 800 },
                { min: 107, max: 800 },
                { min: 10, max: 91},
                { min: 105, max: 800 },
            ],
            expected: [79, 107, 107, 107, 107, 107, 79, 105],
        },
        {
            availableSpace: 1029,
            items: [
                { min: 114, max: 800 },
                { min: 114, max: 800 },
                { min: 114, max: 800 },
                { min: 10, max: 93 },
                { min: 10, max: 93 },
                { min: 10, max: 93 },
                { min: 10, max: 93 },
                { min: 10, max: 93 },
                { min: 109, max: 800 },
                { min: 10, max: 800 },
            ],
            expected: [114, 114, 114, 93, 93, 93, 93, 93, 111, 111],
        },
        {
            availableSpace: 602,
            items: [
                { min: 10, max: 600 },
                { min: 10, max: 600 },
                { min: 10, max: 600 },
            ],
            expected: [200, 200, 200],
        },
        {
            availableSpace: 602,
            items: [
                { min: 204, max: 600 },
                { min: 202, max: 600 },
                { min: 10, max: 600 },
            ],
            expected: [204, 202, 196],
        },
        {
            availableSpace: 803,
            items: [
                { min: 204, max: 600 },
                { min: 10, max: 600 },
                { min: 10, max: 600 },
                { min: 10, max: 600 },
            ],
            expected: [204, 199, 199, 199],
        },
        {
            availableSpace: 900,
            items: [
                { min: 10, max: 120 },
                { min: 10, max: 250 },
                { min: 500, max: 500 },
                { min: 300, max: 500 },
            ],
            expected: [50, 50, 500, 300],
        },
        {
            availableSpace: 845,
            items: [
                { min: 5, max: 5 },
                { min: 10, max: 40 },
                { min: 500, max: 500 },
                { min: 300, max: 500 },
            ],
            expected: [5, 40, 500, 300],
        },
        {
            availableSpace: 800,
            items: [
                { min: 10, max: 20 },
                { min: 220, max: 221 },
                { min: 250, max: 260 },
                { min: 300, max: 305 },
            ],
            expected: [20, 221, 259, 300],
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
