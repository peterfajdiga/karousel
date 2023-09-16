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
    clientRemoved: QSignal<[AbstractClient]>;
    clientMinimized: QSignal<[AbstractClient]>;
    clientUnminimized: QSignal<[AbstractClient]>;
    clientMaximizeSet: QSignal<[AbstractClient, horizontally: boolean, vertically: boolean]>;
    clientActivated: QSignal<[AbstractClient]>;
    numberDesktopsChanged: QSignal<[oldNumberOfVirtualDesktops: number]>;
    currentActivityChanged: QSignal<[newActivity: string]>;
    virtualScreenSizeChanged: QSignal<[void]>;

    // Functions
    clientArea(option: ClientAreaOption, screenNumber: number, desktopNumber: number);
    clientList(): TopLevel[];
};

type Tile = any;

interface AbstractClient {
    // Read-only Properties
    readonly caption: string;
    readonly minSize: QSize;
    readonly transient: boolean;
    readonly transientFor: AbstractClient;
    readonly move: boolean;
    readonly resize: boolean;
    readonly resizeable: boolean;

    // Read-write Properties
    fullScreen: boolean;
    activities: string[]; // empty array means all activities
    keepAbove: boolean;
    keepBelow: boolean;
    shade: boolean;
    minimized: boolean;
    tile: Tile;

    // Signals
    fullScreenChanged: QSignal<[void]>;
    desktopChanged: QSignal<[void]>;
    activitiesChanged: QSignal<[AbstractClient]>;
    captionChanged: QSignal<[void]>;
    tileChanged: QSignal<[Tile]>;
    moveResizedChanged: QSignal<[void]>;
    moveResizeCursorChanged: QSignal<[void]>;
    clientStartUserMovedResized: QSignal<[void]>;

    // Functions
    setMaximize(vertically: boolean, horizontally: boolean): void;
}

interface TopLevel extends AbstractClient {
    // Read-only Properties
    readonly screen: number;
    readonly resourceClass: QByteArray;
    readonly dock: boolean;
    readonly normalWindow: boolean;
    readonly managed: boolean;

    // Read-write Properties
    frameGeometry: QRect;
    desktop: number; // -1 means all desktops

    // Signals
    frameGeometryChanged: QSignal<[TopLevel, oldGeometry: QRect]>;
}

interface KwinClient extends TopLevel {}
