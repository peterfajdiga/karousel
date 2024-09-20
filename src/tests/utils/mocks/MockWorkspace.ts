class MockWorkspace {
    public activities = ["test-activity"];
    public desktops = [{id: "desktop1"}, {id: "desktop2"}];
    public currentDesktop = this.desktops[0];
    public currentActivity = this.activities[0];
    public activeScreen = {};
    public windows = [];
    public cursorPos = new MockQmlPoint(0, 0);

    private _activeWindow: KwinClient|null = null;

    public readonly currentDesktopChanged = new MockQSignal<[]>();
    public readonly windowAdded = new MockQSignal<[KwinClient]>();
    public readonly windowRemoved = new MockQSignal<[KwinClient]>();
    public readonly windowActivated = new MockQSignal<[KwinClient|null]>();
    public readonly screensChanged = new MockQSignal<[]>();
    public readonly activitiesChanged = new MockQSignal<[]>();
    public readonly desktopsChanged = new MockQSignal<[]>();
    public readonly currentActivityChanged = new MockQSignal<[]>();
    public readonly virtualScreenSizeChanged = new MockQSignal<[]>();

    public clientArea(option: ClientAreaOption, output: Output, kwinDesktop: KwinDesktop) {
        return new MockQmlRect(0, 0, screenWidth, screenHeight);
    }

    public createWindow(kwinClient: MockKwinClient) {
        this.windowAdded.fire(kwinClient);
        this.activeWindow = kwinClient;
    }

    public get activeWindow() {
        return this._activeWindow;
    }

    public set activeWindow(activeWindow: KwinClient|null) {
        this._activeWindow = activeWindow;
        this.windowActivated.fire(activeWindow);
    }
}
