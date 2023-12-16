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
    currentDesktopChanged: QSignal<[oldDesktopNumber: number]>
    clientAdded: QSignal<[KwinClient]>;
    clientRemoved: QSignal<[KwinClient]>;
    clientMinimized: QSignal<[KwinClient]>;
    clientUnminimized: QSignal<[KwinClient]>;
    clientMaximizeSet: QSignal<[KwinClient, horizontally: boolean, vertically: boolean]>;
    clientActivated: QSignal<[KwinClient]>;
    numberDesktopsChanged: QSignal<[oldNumberOfVirtualDesktops: number]>;
    currentActivityChanged: QSignal<[newActivity: string]>;
    virtualScreenSizeChanged: QSignal<[void]>;

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
    fullScreenChanged: QSignal<[void]>;
    desktopChanged: QSignal<[void]>;
    activitiesChanged: QSignal<[KwinClient]>;
    captionChanged: QSignal<[void]>;
    tileChanged: QSignal<[Tile]>;
    moveResizedChanged: QSignal<[void]>;
    moveResizeCursorChanged: QSignal<[void]>;
    clientStartUserMovedResized: QSignal<[void]>;
    frameGeometryChanged: QSignal<[KwinClient, oldGeometry: QmlRect]>;

    // Functions
    setMaximize(vertically: boolean, horizontally: boolean): void;
}
