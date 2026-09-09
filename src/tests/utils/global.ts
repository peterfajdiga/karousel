let Qt: Qt;
let KWin: KWin;
let Workspace: Workspace;
let qmlBase: QmlObject;
let notificationInvalidTiledDesktops: Notification;
let notificationInvalidWindowRules: Notification;
let notificationInvalidPresetWidths: Notification;
let moveCursorToFocus: DBusCall;

let screen: MockQmlRect;
let desktopWindow: MockKwinClient;
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

    // Plasma's desktop window exists before Karousel is initialized
    desktopWindow = new MockKwinClient(screen.clone());
    desktopWindow.caption = "Desktop";
    desktopWindow.desktopWindow = true;
    desktopWindow.normalWindow = false;
    desktopWindow.desktops = [];
    workspaceMock.windows.push(desktopWindow);

    moveCursorToFocus = {
        __brand: "QmlObject",
        call: () => {
            Assert.assert(Workspace.activeWindow !== null, { message: "moveCursorToFocus should never be called if there's no focused window" });
            const frame = (Workspace.activeWindow! as MockKwinClient).getActualFrameGeometry();
            workspaceMock.cursorPos.x = Math.floor(frame.x + frame.width/2);
            workspaceMock.cursorPos.y = Math.floor(frame.y + frame.height/2);
        },
    };

    const world = new World(config);
    return { qtMock, workspaceMock, world };
}

function getGridBounds(clientLeft: MockKwinClient, clientRight: MockKwinClient) {
    const columnsWidth = rectRight(clientRight.getActualFrameGeometry()) - clientLeft.getActualFrameGeometry().x;
    const left = tilingArea.x + Math.floor((tilingArea.width - columnsWidth) / 2);
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

function rectIntersects(a: QmlRect, b: QmlRect) {
    return a.x < rectRight(b) && b.x < rectRight(a) &&
        a.y < rectBottom(b) && b.y < rectBottom(a);
}

// Mimics KWin's `Workspace::activateNextWindow`, which KWin runs when the active window gets closed or minimized,
// before it emits `windowRemoved` or `minimizedChanged`. With KWin's default `SeparateScreenFocus` setting,
// it only considers windows that intersect the screen. If there are none, it activates the desktop window.
// (When there are candidates, this mock simply unfocuses and lets Karousel pick, as it doesn't model KWin's focus chain.)
function activateNextWindow(window: MockKwinClient) {
    if (Workspace.activeWindow !== window) {
        return;
    }
    const hasCandidate = Workspace.windows.some(other =>
        other !== window &&
        other !== desktopWindow &&
        !other.minimized &&
        other.desktops.includes(Workspace.currentDesktop) &&
        rectIntersects((other as MockKwinClient).getActualFrameGeometry(), screen),
    );
    Workspace.activeWindow = hasCandidate ? null : desktopWindow;
}

function activateRandomWindowOnDesktop(desktop: KwinDesktop) {
    const windows = Workspace.windows.filter(w => w.desktops.includes(desktop));
    if (windows.length > 0) {
        Workspace.activeWindow = randomItem(windows);
    }
}
