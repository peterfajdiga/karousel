class MockKwinClient {
    private static readonly borderThickness = 10;

    public readonly shadeable: boolean = false;
    public readonly minSize: Readonly<QmlSize> = new MockQmlSize(0, 0);
    public readonly transient: boolean = false;
    public readonly transientFor: MockKwinClient | null = null;
    public readonly move: boolean = false;
    public readonly resize: boolean = false;
    public readonly moveable: boolean = false;
    public readonly resizeable: boolean = false;
    public readonly fullScreenable: boolean = false;
    public readonly maximizable: boolean = false;
    public readonly output: Output = false;
    public readonly dock: boolean = false;
    public readonly normalWindow: boolean = false;
    public readonly managed: boolean = false;
    public readonly popupWindow: boolean = false;

    private _fullScreen: boolean = false;
    public activities: string[] = [];
    public skipSwitcher: boolean = false;
    public keepAbove: boolean = false;
    public keepBelow: boolean = false;
    public shade: boolean = false;
    public minimized: boolean = false;
    public desktops: KwinDesktop[] = [];
    public tile: Tile = false;
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

    constructor(
        public readonly pid: number,
        public readonly resourceClass: string,
        public readonly caption: string,
        private _frameGeometry: MockQmlRect,
    ) {
        this.windowedFrameGeometry = _frameGeometry.clone();
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
            horizontally ? 0            : this.windowedFrameGeometry.x,
            vertically   ? 0            : this.windowedFrameGeometry.y,
            horizontally ? screenWidth  : this.windowedFrameGeometry.width,
            vertically   ? screenHeight : this.windowedFrameGeometry.height,
        );
    }

    public get clientGeometry() {
        if (this._fullScreen) {
            return this.frameGeometry;
        }

        return new MockQmlRect(
            this.frameGeometry.x + MockKwinClient.borderThickness,
            this.frameGeometry.y + MockKwinClient.borderThickness,
            this.frameGeometry.width - 2 * MockKwinClient.borderThickness,
            this.frameGeometry.height - 2 * MockKwinClient.borderThickness,
        );
    }

    public get fullScreen() {
        return this._fullScreen;
    }

    public set fullScreen(fullScreen: boolean) {
        this.windowed = !fullScreen;
        this._fullScreen = fullScreen;
        this.fullScreenChanged.fire();

        if (fullScreen) {
            this.frameGeometry = new MockQmlRect(0, 0, screenWidth, screenHeight);
        } else {
            this.frameGeometry = this.windowedFrameGeometry;
        }
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
            this.frameGeometryChanged.fire,
        );
        if (this.windowed) {
            this.windowedFrameGeometry = this._frameGeometry.clone();
        }
        this.frameGeometryChanged.fire(oldFrameGeometry);
    }
}
