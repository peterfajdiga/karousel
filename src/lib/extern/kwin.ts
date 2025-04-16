interface KWin {
    __brand: "KWin";

    readConfig(key: string, defaultValue: any): any;
}

interface Workspace {
    __brand: "Workspace";

    readonly activities: string[];
    readonly desktops: KwinDesktop[];
    readonly currentDesktop: KwinDesktop;
    readonly currentActivity: string;
    readonly activeScreen: Output;
    readonly windows: KwinClient[];
    readonly cursorPos: Readonly<QmlPoint>;

    activeWindow: KwinClient|null;

    readonly currentDesktopChanged: QSignal<[]>;
    readonly windowAdded: QSignal<[KwinClient]>;
    readonly windowRemoved: QSignal<[KwinClient]>;
    readonly windowActivated: QSignal<[KwinClient|null]>;
    readonly screensChanged: QSignal<[]>;
    readonly activitiesChanged: QSignal<[]>;
    readonly desktopsChanged: QSignal<[]>;
    readonly currentActivityChanged: QSignal<[]>;
    readonly virtualScreenSizeChanged: QSignal<[]>;

    clientArea(option: ClientAreaOption, output: Output, kwinDesktop: KwinDesktop): QmlRect;
}

const enum ClientAreaOption {
    PlacementArea,
    MovementArea,
    MaximizeArea,
    MaximizeFullArea,
    FullScreenArea,
    WorkArea,
    FullArea,
    ScreenArea,
}

const enum MaximizedMode {
    Unmaximized,
    Vertically,
    Horizontally,
    Maximized,
}

interface Tile { __brand: "Tile" }
interface Output { __brand: "Output" }

interface KwinClient {
    __brand: "KwinClient";

    readonly caption: string;
    readonly minSize: Readonly<QmlSize>;
    readonly transient: boolean;
    readonly transientFor: KwinClient | null;
    readonly clientGeometry: Readonly<QmlRect>;
    readonly move: boolean;
    readonly resize: boolean;
    readonly moveable: boolean;
    readonly resizeable: boolean;
    readonly fullScreenable: boolean;
    readonly maximizable: boolean;
    readonly output: Output;
    readonly resourceClass: string;
    readonly dock: boolean;
    readonly normalWindow: boolean;
    readonly managed: boolean;
    readonly popupWindow: boolean;
    readonly pid: number;

    fullScreen: boolean;
    activities: string[]; // empty array means all activities
    skipSwitcher: boolean;
    keepAbove: boolean;
    keepBelow: boolean;
    minimized: boolean;
    frameGeometry: QmlRect;
    desktops: KwinDesktop[]; // empty array means all desktops
    tile: Tile|null;
    opacity: number;

    readonly fullScreenChanged: QSignal<[]>;
    readonly desktopsChanged: QSignal<[]>;
    readonly activitiesChanged: QSignal<[]>;
    readonly minimizedChanged: QSignal<[]>;
    readonly maximizedAboutToChange: QSignal<[MaximizedMode]>;
    readonly captionChanged: QSignal<[]>;
    readonly tileChanged: QSignal<[]>;
    readonly interactiveMoveResizeStarted: QSignal<[]>;
    readonly interactiveMoveResizeFinished: QSignal<[]>;
    readonly frameGeometryChanged: QSignal<[oldGeometry: QmlRect]>;

    setMaximize(vertically: boolean, horizontally: boolean): void;
}

interface KwinDesktop {
    __brand: "KwinDesktop";

    readonly id: string;
}

interface ShortcutHandler extends QmlObject {
    readonly activated: QSignal<[]>;
    destroy(): void;
}
