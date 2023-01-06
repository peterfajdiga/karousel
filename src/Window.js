class Window {
    constructor(columnNode, client) {
        this.columnNode = columnNode;
        this.client = client;
        this.floatingSize = {
            width: client.frameGeometry.width,
            height: client.frameGeometry.height,
        };
    }
}
