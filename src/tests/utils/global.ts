let Qt: Qt;
let KWin: KWin;
let Workspace: Workspace;
let qmlBase: QmlObject;
let notificationInvalidTiledDesktops: Notification;
let notificationInvalidWindowRules: Notification;
let notificationInvalidPresetWidths: Notification;
let moveCursorToFocus: DBusCall;

let screen: MockQmlRect;
let tilingArea: MockQmlRect;
let gapH: number;
let gapV: number;
let runLog: string[];

function init(config: Config) {
    screen = new MockQmlRect(0, 0, 800, 600);
    tilingArea = new MockQmlRect(
        config.gapsOuterLeft,
        config.gapsOuterTop,
        screen.width - config.gapsOuterLeft - config.gapsOuterRight,
        screen.height - config.gapsOuterTop - config.gapsOuterBottom,
    );
    gapH = config.gapsInnerHorizontal;
    gapV = config.gapsInnerVertical;
    runLog = [];

    const qtMock = new MockQt();
    const workspaceMock = new MockWorkspace();

    Qt = qtMock;
    Workspace = workspaceMock;
    moveCursorToFocus = {
        __brand: "QmlObject",
        call: () => {
            Assert.assert(Workspace.activeWindow !== null, { message: "moveCursorToFocus should never be called if there's no focused window" });
            const frame = Workspace.activeWindow!.frameGeometry;
            workspaceMock.cursorPos.x = Math.floor(frame.x + frame.width/2);
            workspaceMock.cursorPos.y = Math.floor(frame.y + frame.height/2);
        },
    };

    const world = new World(config);
    return { qtMock, workspaceMock, world };
}

function getGridBounds(clientLeft: KwinClient, clientRight: KwinClient) {
    const columnsWidth = clientRight.frameGeometry.right - clientLeft.frameGeometry.left;
    const left = tilingArea.left + Math.floor((tilingArea.width - columnsWidth) / 2);
    const right = left + columnsWidth;
    return { left, right };
}

function getWindowHeight(windowsInColumn: number) {
    const totalGaps = (windowsInColumn-1) * gapV;
    return Math.round((tilingArea.height - totalGaps) / windowsInColumn);
}

function getClientManager(world: World): ClientManager {
    // don't do this outside of tests
    let clientManager;
    world.do((cm, dm) => clientManager = cm);
    return clientManager!;
}

function activateRandomWindowOnDesktop(desktop: KwinDesktop) {
    const windows = Workspace.windows.filter(w => w.desktops.includes(desktop));
    if (windows.length > 0) {
        Workspace.activeWindow = randomItem(windows);
    }
}
