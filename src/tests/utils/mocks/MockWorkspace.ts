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

    public createWindows(...kwinClients: MockKwinClient[]) {
        for (const kwinClient of kwinClients) {
            this.windowAdded.fire(kwinClient);
            this.activeWindow = kwinClient;
        }
    }

    public createClients(n: number) {
        return this.createClientsWithWidths(...Array(n).fill(100));
    }

    public createClientsWithFrames(...frames: MockQmlRect[]) {
        const clients = frames.map(rect => new MockKwinClient(rect));
        clients.forEach((client, index) => client.caption = `Client ${index}`);
        this.createWindows(...clients);
        return clients;
    }

    public createClientsWithWidths(...widths: number[]) {
        return this.createClientsWithFrames(...widths.map(width => new MockQmlRect(randomInt(100), randomInt(100), width, 100+randomInt(400))));
    }

    public removeWindow(window: MockKwinClient) {
        this.windowRemoved.fire(window);
        if (window === this.activeWindow) {
            Workspace.activeWindow = null;
        };
        // TODO: activate another window
    }

    public resizeWindow(window: MockKwinClient, edgeResize: boolean, leftEdge: boolean, topEdge: boolean, ...deltas: QmlSize[]) {
        const frame = window.getFrameGeometryCopy();
        if (edgeResize) {
            this.cursorPos = new MockQmlPoint(
                leftEdge ? frame.left : frame.right,
                topEdge ? frame.top : frame.bottom,
            );
        } else {
            this.cursorPos = new MockQmlPoint(
                Math.round(frame.x + frame.width/2),
                Math.round(frame.y + frame.height/2),
            );
        }
        window.resize = true;
        window.interactiveMoveResizeStarted.fire();

        for (const delta of deltas) {
            if (delta.width !== 0) {
                frame.width += delta.width;
                if (leftEdge) {
                    frame.x -= delta.width;
                }
            }
            if (delta.height !== 0) {
                frame.height += delta.height;
                if (topEdge) {
                    frame.y -= delta.height;
                }
            }
            runOneOf(
                () => window.frameGeometry.set(frame),
                () => window.frameGeometry = frame,
            )
        }

        window.resize = false;
        window.interactiveMoveResizeFinished.fire();
    }

    public get activeWindow() {
        return this._activeWindow;
    }

    public set activeWindow(activeWindow: KwinClient|null) {
        this._activeWindow = activeWindow;
        this.windowActivated.fire(activeWindow);
    }
}
