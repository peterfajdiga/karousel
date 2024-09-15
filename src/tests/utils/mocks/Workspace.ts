class MockWorkspace {
    public activities = ["test-activity"];
    public desktops = [{id: "desktop1"}, {id: "desktop2"}];
    public currentDesktop = this.desktops[0];
    public currentActivity = this.activities[0];
    public activeScreen = {};
    public windows = [];
    public cursorPos = new MockQmlPoint(0, 0);

    public activeWindow: any;

    public readonly currentDesktopChanged = new MockQSignal<[]>();
    public readonly windowAdded = new MockQSignal<[MockKwinClient]>();
    public readonly windowRemoved = new MockQSignal<[MockKwinClient]>();
    public readonly windowActivated = new MockQSignal<[MockKwinClient]>();
    public readonly screensChanged = new MockQSignal<[]>();
    public readonly activitiesChanged = new MockQSignal<[]>();
    public readonly desktopsChanged = new MockQSignal<[]>();
    public readonly currentActivityChanged = new MockQSignal<[]>();
    public readonly virtualScreenSizeChanged = new MockQSignal<[]>();

    public clientArea(option: ClientAreaOption, output: Output, kwinDesktop: KwinDesktop) {
        return new MockQmlRect(0, 0, screenWidth, screenHeight);
    }

    public createWindow(kwinClient: MockKwinClient) {
        this.windowActivated.fire(kwinClient);
    }
}
