declare const KWin: {
    readConfig(key: string, defaultValue: any): any;
    registerShortcut(name: string, description: string, keySequence: string, callback: () => void): void;
};

declare const workspace: {
    PlacementArea: ClientAreaOption;

    activeClient: AbstractClient;
    desktops: number;
    currentDesktop: number;
    currentActivity: string;

    clientAdded: QSignal;
    clientRemoved: QSignal;
    clientMinimized: QSignal;
    clientUnminimized: QSignal;
    clientMaximizeSet: QSignal;
    clientActivated: QSignal;
    clientFullScreenSet: QSignal;
    numberDesktopsChanged: QSignal;
    virtualScreenSizeChanged: QSignal;

    clientArea(option: ClientAreaOption, screenNumber: number, desktopNumber: number);
    clientList(): AbstractClient[];
};

type ClientAreaOption = any;
type AbstractClient = any;
type TopLevel = any;
type X11Client = any;
type Tile = any;
