tests.register("WindowRuleEnforcer", 1, () => {
    const testCases = [
        { tiledByDefault: true, resourceClass: "unknown", caption: "anything", shouldTile: true },
        { tiledByDefault: false, resourceClass: "unknown", caption: "anything", shouldTile: false },
        { tiledByDefault: true, resourceClass: "org.kde.plasmashell", caption: "something", shouldTile: false },
        { tiledByDefault: true, resourceClass: "plasmashell", caption: "something", shouldTile: false },
        { tiledByDefault: false, resourceClass: "org.kde.kfind", caption: "something", shouldTile: true },
        { tiledByDefault: false, resourceClass: "kfind", caption: "something", shouldTile: true },
        { tiledByDefault: true, resourceClass: "org.kde.kruler", caption: "anything", shouldTile: false },
        { tiledByDefault: true, resourceClass: "kruler", caption: "anything", shouldTile: false },
        { tiledByDefault: true, resourceClass: "zoom", caption: "something", shouldTile: true },
        { tiledByDefault: true, resourceClass: "zoom", caption: "zoom", shouldTile: false },
    ];

    const enforcer = new WindowRuleEnforcer(JSON.parse(defaultWindowRules));
    for (const testCase of testCases) {
        const kwinClient: any = createKwinClient(testCase.tiledByDefault, testCase.resourceClass, testCase.caption);
        Assert.truth(
            enforcer.shouldTile(kwinClient) === testCase.shouldTile,
            { message: "failed case: " + JSON.stringify(testCase) },
        );
    }

    function createKwinClient(normalWindow: boolean, resourceClass: string, caption: string) {
        return {
            normalWindow: normalWindow,
            transient: false,
            managed: true,
            pid: 100,
            moveable: true,
            resizeable: true,
            popupWindow: false,
            minimized: false,
            desktops: [1],
            activities: [1],
            resourceClass: resourceClass,
            caption: caption,
        };
    }
});
