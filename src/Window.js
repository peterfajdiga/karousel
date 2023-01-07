class Window {
    constructor(client) {
        this.column = null;
        this.client = client;
        this.height = client.frameGeometry.height;
        this.preferredWidth = client.frameGeometry.width;
        this.skipArrange = false;
        this.floatingState = {
            width: client.frameGeometry.width,
            height: client.frameGeometry.height,
            keepAbove: client.keepAbove,
            keepBelow: client.keepBelow,
        };
        this.signalHandlers = {};
    }

    setRect(x, y, width, height) {
        const rect = this.client.frameGeometry;
        rect.x = x;
        rect.y = y;
        rect.width = width;
        rect.height = height;
    }

    connectToSignals() {
        this.signalHandlers.desktopPresenceChanged = (client, oldDesktop) => {
            print("client desktopPresenceChanged", client, oldDesktop, client.desktop, client.x11DesktopIds);
        };

        this.signalHandlers.desktopChanged = () => {
            print("client desktopChanged", this.client.desktop, this.client.x11DesktopIds);
        }

        this.signalHandlers.x11DesktopIdsChanged = () => {
            print("client x11DesktopIdsChanged", this.client.desktop, this.client.x11DesktopIds);
        }

        this.signalHandlers.frameGeometryChanged = (client, oldGeometry) => {
            print("client frameGeometryChanged", client, oldGeometry);
        }

        this.client.desktopPresenceChanged.connect(this.signalHandlers.desktopPresenceChanged);
        this.client.desktopChanged.connect(this.signalHandlers.desktopChanged);
        this.client.x11DesktopIdsChanged.connect(this.signalHandlers.x11DesktopIdsChanged);
        this.client.frameGeometryChanged.connect(this.signalHandlers.frameGeometryChanged);
    }

    disconnectFromSignals() {
        this.client.desktopPresenceChanged.disconnect(this.signalHandlers.desktopPresenceChanged);
        this.client.desktopChanged.disconnect(this.signalHandlers.desktopChanged);
        this.client.x11DesktopIdsChanged.disconnect(this.signalHandlers.x11DesktopIdsChanged);
        this.client.frameGeometryChanged.disconnect(this.signalHandlers.frameGeometryChanged);
    }
}
