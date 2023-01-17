class Window {
    public column: Column|null;
    public client: AbstractClient;
    public height: number;
    public preferredWidth: number;
    public skipArrange: boolean;

    constructor(client: AbstractClient) {
        this.column = null;
        this.client = client;
        this.height = client.frameGeometry.height;
        this.preferredWidth = client.frameGeometry.width;
        this.skipArrange = false;
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
}
