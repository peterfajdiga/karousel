class Window {
    constructor(column, client) {
        this.node = new LinkedListNode(this);
        this.column = column;
        this.client = client;
        this.floatingSize = {
            width: client.frameGeometry.width,
            height: client.frameGeometry.height,
        };
    }
}
