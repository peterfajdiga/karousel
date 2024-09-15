namespace Mocks {
    export class Workspace {
        public activities = ["test-activity"];
        public desktops = [{id: "desktop1"}, {id: "desktop2"}];
        public currentDesktop = this.desktops[0];
        public currentActivity = this.activities[0];
        public activeScreen = {};
        public windows = [];
        public cursorPos = new QmlPoint(0, 0);

        public activeWindow: any;

        public readonly currentDesktopChanged = new Mocks.QSignal<[]>();
        public readonly windowAdded = new Mocks.QSignal<[KwinClient]>();
        public readonly windowRemoved = new Mocks.QSignal<[KwinClient]>();
        public readonly windowActivated = new Mocks.QSignal<[KwinClient]>();
        public readonly screensChanged = new Mocks.QSignal<[]>();
        public readonly activitiesChanged = new Mocks.QSignal<[]>();
        public readonly desktopsChanged = new Mocks.QSignal<[]>();
        public readonly currentActivityChanged = new Mocks.QSignal<[]>();
        public readonly virtualScreenSizeChanged = new Mocks.QSignal<[]>();

        public clientArea(option: ClientAreaOption, output: Output, kwinDesktop: KwinDesktop) {
            return new QmlRect(0, 0, Mocks.screenWidth, Mocks.screenHeight);
        }

        public createWindow(kwinClient: KwinClient) {
            this.windowActivated.fire(kwinClient);
        }
    }
}
