class Window {
    public column: Column;
    public client: AbstractClient;
    public height: number;
    public preferredWidth: number;
    public skipArrange: boolean;

    constructor(client: AbstractClient, column: Column) {
        this.client = client;
        this.height = client.frameGeometry.height;
        this.preferredWidth = client.frameGeometry.width;
        this.skipArrange = false;
        this.column = column;
        column.onWindowAdded(this);
    }

    moveToColumn(targetColumn: Column) {
        this.column.onWindowRemoved(this);
        targetColumn.onWindowAdded(this);
        this.column = targetColumn;
    }

    arrange(x: number, y: number, width: number) {
        if (this.client.resize) {
            // window is being manually resized, prevent fighting with the user
            return;
        }
        placeClient(this.client, x, y, width, this.height);
    }

    focus() {
        focusClient(this.client);
    }

    isFocused() {
        return workspace.activeClient === this.client;
    }

    onFocused() {
        this.column.onWindowFocused(this);
    }

    destroy() {
        this.column.onWindowRemoved(this);
    }
}
