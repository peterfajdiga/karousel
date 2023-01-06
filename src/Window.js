class Window {
    constructor(client) {
        this.column = null;
        this.client = client;
        this.floatingSize = {
            width: client.frameGeometry.width,
            height: client.frameGeometry.height,
        };
    }
}
