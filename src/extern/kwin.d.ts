declare const KWin: {
    // Functions
    readConfig(key: string, defaultValue: any): any;
    registerShortcut(name: string, description: string, keySequence: string, callback: () => void): void;
};

declare const workspace: {
    // Enums
    PlacementArea: ClientAreaOption;

    // Read-write Properties
    activeClient: AbstractClient;
    desktops: number;
    currentDesktop: number;
    currentActivity: string;

    // Signals
    clientAdded: QSignal;
    clientRemoved: QSignal;
    clientMinimized: QSignal;
    clientUnminimized: QSignal;
    clientMaximizeSet: QSignal;
    clientActivated: QSignal;
    clientFullScreenSet: QSignal;
    numberDesktopsChanged: QSignal;
    virtualScreenSizeChanged: QSignal;

    // Functions
    clientArea(option: ClientAreaOption, screenNumber: number, desktopNumber: number);
    clientList(): TopLevel[];
};

type ClientAreaOption = any;
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
    desktopChanged: QSignal;
    activitiesChanged: QSignal;
    captionChanged: QSignal;
    tileChanged: QSignal;
    moveResizedChanged: QSignal;
    moveResizeCursorChanged: QSignal;
    clientStartUserMovedResized: QSignal;

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
    frameGeometryChanged: QSignal;
}

interface KwinClient extends TopLevel {}

interface X11Client extends TopLevel {}
