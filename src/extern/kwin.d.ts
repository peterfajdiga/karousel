declare const KWin: {
    readConfig(key: string, defaultValue: any): any;
    registerShortcut(name: string, description: string, keySequence: string, callback: () => void): void;
};

declare const Workspace: {
    readonly desktops: number;
    readonly currentDesktop: number;
    readonly currentActivity: string;
    readonly windows: KwinClient[];

    activeWindow: KwinClient;

    readonly currentDesktopChanged: QSignal<[]>
    readonly windowAdded: QSignal<[KwinClient]>;
    readonly windowRemoved: QSignal<[KwinClient]>;
    readonly windowActivated: QSignal<[KwinClient]>;
    readonly desktopsChanged: QSignal<[]>;
    readonly currentActivityChanged: QSignal<[]>;
    readonly virtualScreenSizeChanged: QSignal<[]>;

    clientArea(option: ClientAreaOption, screenNumber: number, desktopNumber: number);
};

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

type Tile = unknown;

interface KwinClient {
    readonly shadeable: boolean;
    readonly caption: string;
    readonly minSize: QmlSize;
    readonly transient: boolean;
    readonly transientFor: KwinClient;
    readonly move: boolean;
    readonly resize: boolean;
    readonly resizeable: boolean;
    readonly screen: number;
    readonly resourceClass: QByteArray;
    readonly dock: boolean;
    readonly normalWindow: boolean;
    readonly managed: boolean;

    opacity: number;
    fullScreen: boolean;
    activities: string[]; // empty array means all activities
    skipSwitcher: boolean;
    keepAbove: boolean;
    keepBelow: boolean;
    shade: boolean;
    minimized: boolean;
    frameGeometry: QmlRect;
    desktop: number; // -1 means all desktops
    tile: Tile;

    readonly fullScreenChanged: QSignal<[]>
    readonly desktopChanged: QSignal<[]>
    readonly activitiesChanged: QSignal<[]>
    readonly minimizedChanged: QSignal<[]>
    readonly clientMaximizedStateChanged: QSignal<[KwinClient, horizontally: boolean, vertically: boolean]>
    readonly captionChanged: QSignal<[]>
    readonly tileChanged: QSignal<[]>
    readonly moveResizedChanged: QSignal<[]>
    readonly moveResizeCursorChanged: QSignal<[]>
    readonly clientStartUserMovedResized: QSignal<[]>
    readonly frameGeometryChanged: QSignal<[KwinClient, oldGeometry: QmlRect]>;

    setMaximize(vertically: boolean, horizontally: boolean): void;
}
