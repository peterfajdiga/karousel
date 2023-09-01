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
    activeClient: AbstractClient;

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
    readonly caption: string;
    readonly minSize: QSize;
    readonly transient: boolean;
    readonly transientFor: AbstractClient;
    readonly move: boolean;
    readonly resize: boolean;
    readonly resizeable: boolean;
    readonly tile: Tile;

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
    readonly resourceClass: QByteArray;
    readonly dock: boolean;
    readonly normalWindow: boolean;
    readonly managed: boolean;

    // Read-write Properties
    frameGeometry: QRect;

    // Signals
    frameGeometryChanged: QSignal<[TopLevel, oldGeometry: QRect]>;
}

interface KwinClient extends TopLevel {}
