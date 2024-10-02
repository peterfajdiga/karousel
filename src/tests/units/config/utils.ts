tests.register("parsePresetWidths", 1, () => {
    const screenWidth = 800;
    const spacing = 10;

    const testCases = [
        { str: "100%, 50%", result: [800, 395] },
        { str: "100px,50 px", result: [100, 50] },
        { str: "100px, 25 % , 0.1 ", result: [100, 192, 71] },
        { str: "100px, 25 % , 0.1p", error: true },
        { str: "100px, % , 0.1 ", error: true },
        { str: "100px,  , 0.1 ", error: true },
        { str: "100px,, 0.1 ", error: true },
        { str: "100px, 25 % , ", error: true },
        { str: "asdf", error: true },
        { str: "", error: true },
        { str: " ", error: true },
    ];

    function applyPresetWidths(presetWidths: PresetWidth[]) {
        return presetWidths.map(f => f(screenWidth, spacing));
    }

    for (const testCase of testCases) {
        try {
            const result = parsePresetWidths(testCase.str);
            assert(!testCase.error);
            assertArrayEqual(applyPresetWidths(result), testCase.result!);
        } catch (error) {
            assert(testCase.error === true);
        }
    }
});
