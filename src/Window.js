class Window {
    constructor(columnNode, client) {
        this.node = new LinkedListNode(this);
        this.columnNode = columnNode;
        this.client = client;
        this.floatingSize = {
            width: client.frameGeometry.width,
            height: client.frameGeometry.height,
        };
    }
}
