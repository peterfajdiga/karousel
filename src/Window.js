class Window {
    constructor(client) {
        this.column = null;
        this.client = client;
        this.height = client.frameGeometry.height;
        this.preferredWidth = client.frameGeometry.width;
        this.skipArrange = false;
        this.lastResize = false;
        this.floatingState = {
            width: client.frameGeometry.width,
            height: client.frameGeometry.height,
            keepAbove: client.keepAbove,
            keepBelow: client.keepBelow,
        };
        this.clientSignalHandlers = {};
    }

    setRect(x, y, width, height) {
        const rect = this.client.frameGeometry;
        rect.x = x;
        rect.y = y;
        rect.width = width;
        rect.height = height;
    }

    connectToClientSignals() {
        const window = this;

        this.clientSignalHandlers.desktopChanged = () => {
            if (window.client.desktop === -1) {
                // windows on all desktops are not supported
                world.removeClient(window.client.windowId);
            }
        }

        this.clientSignalHandlers.moveResizedChanged = () => {
            const client = window.client;
            if (client.move) {
                world.removeClient(client.windowId);
                return;
            }

            const resize = client.resize;
            if (this.lastResize && !resize) {
                // resizing finished
                window.column.setWidth(client.frameGeometry.width);
                window.column.grid.arrange();
            }
            this.lastResize = resize;
        }

        this.clientSignalHandlers.frameGeometryChanged = (client, oldGeometry) => {
            print("client frameGeometryChanged", client, oldGeometry);
        }

        this.client.desktopChanged.connect(this.clientSignalHandlers.desktopChanged);
        this.client.moveResizedChanged.connect(this.clientSignalHandlers.moveResizedChanged);
        this.client.frameGeometryChanged.connect(this.clientSignalHandlers.frameGeometryChanged);
    }

    disconnectFromClientSignals() {
        this.client.desktopChanged.disconnect(this.clientSignalHandlers.desktopChanged);
        this.client.moveResizedChanged.disconnect(this.clientSignalHandlers.moveResizedChanged);
        this.client.frameGeometryChanged.disconnect(this.clientSignalHandlers.frameGeometryChanged);
    }
}
