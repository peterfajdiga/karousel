{
    const testCases = [
        {tiledByDefault: true, resourceClass: "ksmserver-logout-greeter", caption: "anything", shouldTile: false},
    ];

    const enforcer = new WindowRuleEnforcer(JSON.parse(defaultWindowRules));
    for (const testCase of testCases) {
        const kwinClient: any = createKwinClient(testCase.tiledByDefault, testCase.resourceClass, testCase.caption);
        assert(enforcer.shouldTile(kwinClient) === testCase.shouldTile, "failed case: " + JSON.stringify(testCase));
    }

    function createKwinClient(normalWindow: boolean, resoureClass: string, caption: string) {
        return {
            normalWindow: normalWindow,
            transient: false,
            managed: true,
            moveable: true,
            resizeable: true,
            popupWindow: false,
            minimized: false,
            desktops: [1],
            activities: [1],
            resourceClass: resoureClass,
            caption: caption,
        }
    }
}
