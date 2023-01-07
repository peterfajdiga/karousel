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
        const window = this;

        this.signalHandlers.desktopChanged = () => {
            if (window.client.desktop === -1) {
                // windows on all desktops are not supported
                world.removeClient(window.client.windowId);
            }
        }

        this.signalHandlers.moveResizedChanged = () => {
            if (window.client.move) {
                world.removeClient(window.client.windowId);
            }
        }

        this.signalHandlers.frameGeometryChanged = (client, oldGeometry) => {
            print("client frameGeometryChanged", client, oldGeometry);
        }

        this.client.desktopChanged.connect(this.signalHandlers.desktopChanged);
        this.client.moveResizedChanged.connect(this.signalHandlers.moveResizedChanged);
        this.client.frameGeometryChanged.connect(this.signalHandlers.frameGeometryChanged);
    }

    disconnectFromSignals() {
        this.client.desktopChanged.disconnect(this.signalHandlers.desktopChanged);
        this.client.moveResizedChanged.disconnect(this.signalHandlers.moveResizedChanged);
        this.client.frameGeometryChanged.disconnect(this.signalHandlers.frameGeometryChanged);
    }
}
