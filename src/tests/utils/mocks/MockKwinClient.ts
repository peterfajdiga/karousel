class MockKwinClient {
    public readonly __brand = "KwinClient";

    private static readonly borderThickness = 10;

    public caption = "App";
    public minSize: Readonly<QmlSize> = new MockQmlSize(0, 0);
    public readonly transient: boolean;
    public move = false;
    public resize = false;
    public readonly fullScreenable: boolean = true;
    public readonly maximizable: boolean = true;
    public readonly output: Output = { __brand: "Output" };
    public resourceClass = "app";
    public readonly dock: boolean = false;
    public readonly normalWindow: boolean = true;
    public readonly managed: boolean = true;
    public readonly popupWindow: boolean = false;
    public readonly pid = 1;

    private _maximizedVertically = false;
    private _maximizedHorizontally = false;
    private _fullScreen = false;
    public activities: string[] = [];
    public skipSwitcher = false;
    public keepAbove = false;
    public keepBelow = false;
    private _minimized = false;
    private _desktops: KwinDesktop[] = [];
    private _tile: Tile|null = null;
    public opacity = 1.0;

    public readonly fullScreenChanged = new MockQSignal<[]>();
    public readonly desktopsChanged = new MockQSignal<[]>();
    public readonly activitiesChanged = new MockQSignal<[]>();
    public readonly minimizedChanged = new MockQSignal<[]>();
    public readonly maximizedAboutToChange = new MockQSignal<[MaximizedMode]>();
    public readonly captionChanged = new MockQSignal<[]>();
    public readonly tileChanged = new MockQSignal<[]>();
    public readonly interactiveMoveResizeStarted = new MockQSignal<[]>();
    public readonly interactiveMoveResizeFinished = new MockQSignal<[]>();
    public readonly frameGeometryChanged = new MockQSignal<[oldGeometry: QmlRect]>();

    private windowedFrameGeometry: MockQmlRect;
    private windowed = true;
    private hasBorder = true;

    constructor(
        private _frameGeometry: MockQmlRect = new MockQmlRect(10, 10, 100, 200),
        public readonly transientFor: MockKwinClient|null = null,
    ) {
        this.windowedFrameGeometry = _frameGeometry.clone();
        this.transient = transientFor !== null;
        this._desktops = [Workspace.currentDesktop];
    }

    setMaximize(vertically: boolean, horizontally: boolean) {
        this.windowed = !(vertically || horizontally);

        if (vertically === this._maximizedVertically && horizontally === this._maximizedHorizontally) {
            return;
        }
        this._maximizedVertically = vertically;
        this._maximizedHorizontally = horizontally;

        this.maximizedAboutToChange.fire(
            vertically ? (
                horizontally ? MaximizedMode.Maximized : MaximizedMode.Vertically
            ) : (
                horizontally ? MaximizedMode.Horizontally : MaximizedMode.Unmaximized
            ),
        );

        this.frameGeometry = new MockQmlRect(
            horizontally ? 0             : this.windowedFrameGeometry.x,
            vertically   ? 0             : this.windowedFrameGeometry.y,
            horizontally ? screen.width  : this.windowedFrameGeometry.width,
            vertically   ? screen.height : this.windowedFrameGeometry.height,
        );
    }

    public get clientGeometry() {
        if (this.hasBorder) {
            return new MockQmlRect(
                this.frameGeometry.x + MockKwinClient.borderThickness,
                this.frameGeometry.y + MockKwinClient.borderThickness,
                this.frameGeometry.width - 2 * MockKwinClient.borderThickness,
                this.frameGeometry.height - 2 * MockKwinClient.borderThickness,
            );
        } else {
            return runOneOf(
                () => this.frameGeometry,
                () => new MockQmlRect(
                    this.frameGeometry.x - 20,
                    this.frameGeometry.y - 20,
                    this.frameGeometry.width + 40,
                    this.frameGeometry.height + 40,
                ), // some full-screen windows that manage their own window decorations can temporarily have a client geometry bigger than the screen
            );
        }
    }

    public get moveable() {
        return !this._fullScreen;
    }

    public get resizeable() {
        return !this._fullScreen;
    }

    public get fullScreen() {
        return this._fullScreen;
    }

    public set fullScreen(fullScreen: boolean) {
        const oldFullScreen = this._fullScreen;
        this.hasBorder = !fullScreen;
        const targetFrameGeometry = fullScreen ? screen : this.windowedFrameGeometry;

        runReorder(
            () => {
                this._fullScreen = fullScreen;
                if (fullScreen !== oldFullScreen) {
                    this.fullScreenChanged.fire();
                }
            },
            () => {
                if (oldFullScreen && !fullScreen) {
                    // when switching from full-screen to windowed, Kwin sometimes first adds the frame before changing the frameGeometry to the final value
                    if (!rectEquals(this.frameGeometry, screen)) {
                        // already has windowed frame geometry, don't undo that
                        return;
                    }
                    runOneOf(
                        () => {
                            this.frameGeometry = new MockQmlRect(
                                0,
                                0,
                                screen.width + 2 * MockKwinClient.borderThickness,
                                screen.height + 2 * MockKwinClient.borderThickness,
                            );
                        },
                        () => {
                            this.frameGeometry = new MockQmlRect(
                                -MockKwinClient.borderThickness,
                                -MockKwinClient.borderThickness,
                                screen.width + 2 * MockKwinClient.borderThickness,
                                screen.height + 2 * MockKwinClient.borderThickness,
                            );
                        },
                        () => {},
                    );
                }
            },
            () => {
                this.windowed = !fullScreen;
                this.frameGeometry = targetFrameGeometry;
            },
        );
    }

    public get frameGeometry() {
        return this._frameGeometry;
    }

    public set frameGeometry(frameGeometry: MockQmlRect) {
        const oldFrameGeometry = this._frameGeometry;
        this._frameGeometry = new MockQmlRect(
            frameGeometry.x,
            frameGeometry.y,
            frameGeometry.width,
            frameGeometry.height,
            this.frameGeometryChanged.fire.bind(this.frameGeometryChanged),
        );
        if (this.windowed) {
            this.windowedFrameGeometry = this._frameGeometry.clone();
        }
        if (!rectEquals(frameGeometry, oldFrameGeometry)) {
            this.frameGeometryChanged.fire(oldFrameGeometry);
        }
    }

    public get minimized() {
        return this._minimized;
    }

    public set minimized(minimized: boolean) {
        this._minimized = minimized;
        this.minimizedChanged.fire();
    }

    public get desktops() {
        return this._desktops;
    }

    public set desktops(desktops: KwinDesktop[]) {
        this._desktops = desktops;
        this.desktopsChanged.fire();
        if (Workspace.activeWindow === this && !desktops.includes(Workspace.currentDesktop)) {
            Workspace.activeWindow = null;
            runMaybe(() => Workspace.activeWindow = null); // fired again for some reason
            if (Workspace.activeWindow === null) {
                activateRandomWindowOnDesktop(Workspace.currentDesktop);
            }
        };
    }

    public moveAndFollowToDesktop(desktop: KwinDesktop, workspaceMock: MockWorkspace) {
        Assert.assert(workspaceMock.activeWindow === this);
        this._desktops = [desktop];
        this.desktopsChanged.fire();
        workspaceMock.currentDesktop = desktop;
    }

    public get tile() {
        return this._tile;
    }

    public set tile(tile: Tile|null) {
        this._tile = tile;
        this.tileChanged.fire();
    }

    public pin(geometry: MockQmlRect) {
        runMaybe(() => this.frameGeometry = geometry);
        this.tile = { __brand: "Tile" };
        this.frameGeometry = geometry;
    }

    public unpin() {
        this.tile = null;
    }

    public getFrameGeometryCopy() {
        return this._frameGeometry.clone();
    }

    public toString() {
        return `MockKwinClient("${this.caption}")`;
    }
}
