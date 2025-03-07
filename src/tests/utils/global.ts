let Qt: Qt;
let KWin: KWin;
let Workspace: Workspace;
let qmlBase: QmlObject;
let notificationInvalidWindowRules: Notification;
let notificationInvalidPresetWidths: Notification;

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

    const world = new World(config);
    return { qtMock, workspaceMock, world };
}

function getGridBounds(clientLeft: KwinClient, clientRight: KwinClient) {
    const columnsWidth = clientRight.frameGeometry.right - clientLeft.frameGeometry.left;
    const left = Math.floor((screen.width - columnsWidth) / 2);
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
