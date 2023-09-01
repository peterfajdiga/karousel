declare const KWin: {
    // Functions
    readConfig(key: string, defaultValue: any): any;
    registerShortcut(name: string, description: string, keySequence: string, callback: () => void): void;
};

declare const workspace: {
    // Read-write Properties
    activeClient: AbstractClient;
    desktops: number;
    currentDesktop: number;
    currentActivity: string;

    // Signals
    clientAdded: QSignal<[KwinClient]>;
    clientRemoved: QSignal<[AbstractClient]>;
    clientMinimized: QSignal<[AbstractClient]>;
    clientUnminimized: QSignal<[AbstractClient]>;
    clientMaximizeSet: QSignal<[AbstractClient, horizontally: boolean, vertically: boolean]>;
    clientActivated: QSignal<[AbstractClient]>;
    numberDesktopsChanged: QSignal<[oldNumberOfVirtualDesktops: number]>;
    virtualScreenSizeChanged: QSignal<[void]>;

    // Functions
    clientArea(option: ClientAreaOption, screenNumber: number, desktopNumber: number);
    clientList(): TopLevel[];
};

type Tile = any;

interface AbstractClient {
    // Read-only Properties
    caption: string;
    minSize: QSize;
    transient: boolean;
    transientFor: AbstractClient;
    move: boolean;
    resize: boolean;
    resizeable: boolean;
    tile: Tile;

    // Read-write Properties
    fullScreen: boolean;
    desktop: number;
    activities: string[];
    keepBelow: boolean;
    shade: boolean;
    minimized: boolean;

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
    frameGeometry: QRect;
    resourceClass: QByteArray;
    dock: boolean;
    normalWindow: boolean;
    managed: boolean;

    // Signals
    frameGeometryChanged: QSignal<[TopLevel, oldGeometry: QRect]>;
}

interface KwinClient extends TopLevel {}
