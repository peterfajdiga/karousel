let Qt: Qt;
let KWin: KWin;
let Workspace: Workspace;
let qmlBase: QmlObject;
let notificationInvalidWindowRules: Notification;
let notificationInvalidPresetWidths: Notification;

let screen: QmlRect;
let tilingArea: QmlRect;

function init(config: Config) {
    screen = new MockQmlRect(0, 0, 800, 600);
    tilingArea = new MockQmlRect(
        config.gapsOuterLeft,
        config.gapsOuterTop,
        screen.width - config.gapsOuterLeft - config.gapsOuterRight,
        screen.height - config.gapsOuterTop - config.gapsOuterBottom,
    );

    const qtMock = new MockQt();
    const workspaceMock = new MockWorkspace();

    Qt = qtMock;
    Workspace = workspaceMock;

    const world = new World(config);
    return { qtMock, workspaceMock, world };
}
