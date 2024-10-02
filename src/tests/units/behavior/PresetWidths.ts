tests.register("PresetWidths", 1, () => {
    const screenWidth = 800;
    const spacing = 10;

    const testCases = [
        { str: "100%, 50%", result: [800, 395] },
        { str: "100px,50 px", result: [100, 50] },
        { str: " 100px, 25 % , 0.1 ", result: [100, 192, 71] },
        { str: "100px, -25 % , 0.1 ", error: true },
        { str: "100px, 25 % , -0.1 ", error: true },
        { str: "100px, 25 % , 0.1p", error: true },
        { str: "100px, % , 0.1 ", error: true },
        { str: "100px,  , 0.1 ", error: true },
        { str: "100px, 0, 0.1 ", error: true },
        { str: "100px,, 0.1 ", error: true },
        { str: "100px, 25 % , ", error: true },
        { str: "asdf", error: true },
        { str: "", error: true },
        { str: " ", error: true },
    ];

    for (const testCase of testCases) {
        try {
            const presetWidths = new PresetWidths(testCase.str, spacing);
            assert(!testCase.error);

            const result = presetWidths.get(screenWidth);
            assertArrayEqual(result, testCase.result!);
        } catch (error) {
            assert(testCase.error === true);
        }
    }
});
