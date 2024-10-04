class MockKwinClient {
    public readonly __brand = "KwinClient";

    private static readonly borderThickness = 10;

    public readonly shadeable: boolean = false;
    public readonly minSize: Readonly<QmlSize> = new MockQmlSize(0, 0);
    public readonly transient: boolean;
    public readonly move: boolean = false;
    public readonly resize: boolean = false;
    public readonly moveable: boolean = true;
    public readonly resizeable: boolean = true;
    public readonly fullScreenable: boolean = true;
    public readonly maximizable: boolean = true;
    public readonly output: Output = { __brand: "Output" };
    public readonly dock: boolean = false;
    public readonly normalWindow: boolean = true;
    public readonly managed: boolean = true;
    public readonly popupWindow: boolean = false;

    private _fullScreen: boolean = false;
    public activities: string[] = [];
    public skipSwitcher: boolean = false;
    public keepAbove: boolean = false;
    public keepBelow: boolean = false;
    public shade: boolean = false;
    public _minimized: boolean = false;
    public desktops: KwinDesktop[] = [];
    public _tile: Tile|null = null;
    public opacity: number = 1.0;

    public readonly fullScreenChanged = new MockQSignal();
    public readonly desktopsChanged = new MockQSignal();
    public readonly activitiesChanged = new MockQSignal();
    public readonly minimizedChanged = new MockQSignal();
    public readonly maximizedAboutToChange = new MockQSignal<[MaximizedMode]>();
    public readonly captionChanged = new MockQSignal();
    public readonly tileChanged = new MockQSignal();
    public readonly interactiveMoveResizeStarted = new MockQSignal();
    public readonly interactiveMoveResizeFinished = new MockQSignal();
    public readonly frameGeometryChanged = new MockQSignal<[oldGeometry: QmlRect]>();

    private windowedFrameGeometry: QmlRect;
    private windowed: boolean = false;
    private hasBorder: boolean = true;

    constructor(
        public readonly pid: number,
        public readonly resourceClass: string,
        public readonly caption: string,
        private _frameGeometry: MockQmlRect,
        public readonly transientFor: MockKwinClient|null = null,
    ) {
        this.windowedFrameGeometry = _frameGeometry.clone();
        this.transient = transientFor !== null;
    }

    setMaximize(vertically: boolean, horizontally: boolean) {
        this.windowed = !(vertically || horizontally);

        this.maximizedAboutToChange.fire(
            vertically ? (
                horizontally ? MaximizedMode.Maximized : MaximizedMode.Vertically
            ) : (
                horizontally ? MaximizedMode.Horizontally : MaximizedMode.Unmaximized
            )
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
            return this.frameGeometry;
        }
    }

    public get fullScreen() {
        return this._fullScreen;
    }

    public set fullScreen(fullScreen: boolean) {
        const oldFullScreen = this._fullScreen;
        this.hasBorder = !fullScreen;

        runReorder(
            () => {
                this._fullScreen = fullScreen;
                this.fullScreenChanged.fire();
            },
            () => {
                if (oldFullScreen && !fullScreen) {
                    // when switching from full-screen to windowed, Kwin sometimes first adds the frame before changing the frameGeometry to the final value
                    if (rectEquals(this.frameGeometry, this.windowedFrameGeometry)) {
                        // already has windowed frame geometry, don't undo that
                        return;
                    }
                    runOneOf(
                        () => this.frameGeometry = new MockQmlRect(
                            0,
                            0,
                            screen.width + 2 * MockKwinClient.borderThickness,
                            screen.height + 2 * MockKwinClient.borderThickness,
                        ),
                        () => this.frameGeometry = new MockQmlRect(
                            -MockKwinClient.borderThickness,
                            -MockKwinClient.borderThickness,
                            screen.width + 2 * MockKwinClient.borderThickness,
                            screen.height + 2 * MockKwinClient.borderThickness,
                        ),
                        () => {},
                    );
                }
            },
            () => {
                this.windowed = !fullScreen;
                if (fullScreen) {
                    this.frameGeometry = screen;
                } else {
                    this.frameGeometry = this.windowedFrameGeometry;
                }
            },
        );
    }

    public get frameGeometry() {
        return this._frameGeometry;
    }

    public set frameGeometry(frameGeometry: QmlRect) {
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
        this.frameGeometryChanged.fire(oldFrameGeometry);
    }

    public get minimized() {
        return this._minimized;
    }

    public set minimized(minimized: boolean) {
        this._minimized = minimized;
        this.minimizedChanged.fire();
    }

    public get tile() {
        return this._tile;
    }

    public set tile(tile: Tile|null) {
        this._tile = tile;
        this.tileChanged.fire();
    }

    public pin(geometry: QmlRect) {
        runMaybe(() => this.frameGeometry = geometry);
        this.tile = { __brand: "Tile" };
        this.frameGeometry = geometry;
    }

    public unpin() {
        this.tile = null;
    }
}
