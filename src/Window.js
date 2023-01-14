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
        if (this.client.resize) {
            // window is being manually resized, prevent fighting with the user
            return;
        }
        this.client.frameGeometry = Qt.rect(x, y, width, height);
    }

    focus() {
        workspace.activeClient = this.client;
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

            const grid = window.column.grid;
            const resize = client.resize;
            grid.allowAutoAdjustScroll = !resize;
            if (this.lastResize && !resize) {
                // resizing finished
                grid.autoAdjustScroll();
                grid.arrange();
            }
            this.lastResize = resize;
        }

        this.clientSignalHandlers.frameGeometryChanged = (client, oldGeometry) => {
            if (client.resize) {
                const newGeometry = client.frameGeometry;
                const column = window.column;
                const widthDelta = newGeometry.width - oldGeometry.width;
                const heightDelta = newGeometry.height - oldGeometry.height;
                if (widthDelta !== 0) {
                    column.adjustWidth(widthDelta);
                    if (newGeometry.x !== oldGeometry.x) {
                        column.grid.adjustScroll(widthDelta, true);
                    }
                }
                if (heightDelta !== 0) {
                    column.adjustWindowHeight(window, heightDelta, newGeometry.y !== oldGeometry.y);
                }
                if (widthDelta !== 0 || heightDelta !== 0) {
                    column.grid.arrange();
                }
            }
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
