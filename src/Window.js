class Window {
    constructor(client) {
        this.node = new LinkedListNode(this);
        this.column = null;
        this.client = client;
        this.floatingSize = {
            width: client.frameGeometry.width,
            height: client.frameGeometry.height,
        };
    }
}
