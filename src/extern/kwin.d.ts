declare const KWin: {
    // Functions
    readConfig(key: string, defaultValue: any): any;
    registerShortcut(name: string, description: string, keySequence: string, callback: () => void): void;
};

declare const workspace: {
    // Read-write Properties
    readonly desktops: number;
    readonly currentDesktop: number;
    readonly currentActivity: string;

    // Read-write Properties
    activeClient: KwinClient;

    // Signals
    readonly currentDesktopChanged: QSignal<[oldDesktopNumber: number]>
    readonly clientAdded: QSignal<[KwinClient]>;
    readonly clientRemoved: QSignal<[KwinClient]>;
    readonly clientMinimized: QSignal<[KwinClient]>;
    readonly clientUnminimized: QSignal<[KwinClient]>;
    readonly clientMaximizeSet: QSignal<[KwinClient, horizontally: boolean, vertically: boolean]>;
    readonly clientActivated: QSignal<[KwinClient]>;
    readonly numberDesktopsChanged: QSignal<[oldNumberOfVirtualDesktops: number]>;
    readonly currentActivityChanged: QSignal<[newActivity: string]>;
    readonly virtualScreenSizeChanged: QSignal<[void]>;

    // Functions
    clientArea(option: ClientAreaOption, screenNumber: number, desktopNumber: number);
    clientList(): KwinClient[];
};

type Tile = any;

interface KwinClient {
    // Read-only Properties
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

    // Read-write Properties
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

    // Signals
    readonly fullScreenChanged: QSignal<[void]>;
    readonly desktopChanged: QSignal<[void]>;
    readonly activitiesChanged: QSignal<[KwinClient]>;
    readonly captionChanged: QSignal<[void]>;
    readonly tileChanged: QSignal<[Tile]>;
    readonly moveResizedChanged: QSignal<[void]>;
    readonly moveResizeCursorChanged: QSignal<[void]>;
    readonly clientStartUserMovedResized: QSignal<[void]>;
    readonly frameGeometryChanged: QSignal<[KwinClient, oldGeometry: QmlRect]>;

    // Functions
    setMaximize(vertically: boolean, horizontally: boolean): void;
}
