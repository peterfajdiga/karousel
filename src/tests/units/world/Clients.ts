tests.register("Clients.canTileEver", 1, () => {
    const testCases = [
        { clientProperties: { resourceClass: "app", caption: "Title" }, tileable: true },
        { clientProperties: { resourceClass: "app", caption: "Title", moveable: false }, tileable: false },
        { clientProperties: { resourceClass: "app", caption: "Caption", resizeable: false }, tileable: false },
        { clientProperties: { resourceClass: "app", caption: "Caption", normalWindow: false, popupWindow: true }, tileable: false },
        { clientProperties: { resourceClass: "ksmserver-logout-greeter", caption: "Caption" }, tileable: false },
        { clientProperties: { resourceClass: "xwaylandvideobridge", caption: "" }, tileable: false },
    ];

    for (const testCase of testCases) {
        const kwinClient: any = createKwinClient(testCase.clientProperties);
        assert(Clients.canTileEver(kwinClient) === testCase.tileable, "failed case: " + JSON.stringify(testCase));
    }

    function createKwinClient(properties: { resourceClass: string, caption: string }) {
        const defaultProperties = {
            normalWindow: true,
            transient: false,
            managed: true,
            pid: 100,
            moveable: true,
            resizeable: true,
            popupWindow: false,
            minimized: false,
            desktops: [1],
            activities: [1],
        };
        return { ...defaultProperties, ...properties };
    }
});
