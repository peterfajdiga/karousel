class MockWorkspace {
    public readonly __brand = "Workspace";

    public activities = ["test-activity"];
    public desktops: KwinDesktop[] = [
        { __brand: "KwinDesktop", id: "desktop1" },
        { __brand: "KwinDesktop", id: "desktop2" }
    ];
    public currentDesktop = this.desktops[0];
    public currentActivity = this.activities[0];
    public activeScreen: Output = { __brand: "Output" };
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
        return screen;
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
