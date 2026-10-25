class WindowActivatedHandler {
    private readonly timer: QmlTimer;
    private kwinClient: KwinClient|null = null;

    constructor(private readonly world: World) {
        this.timer = initQmlTimer();
        this.timer.interval = 50;
        this.timer.triggered.connect(() => this.world.do(() => {})); // calls completeActivation
    }

    public requestActivation(kwinClient: KwinClient) {
        if (this.kwinClient !== null) {
            this.world.do(() => {}); // calls completeActivation
        }
        this.kwinClient = kwinClient;
        this.timer.restart();
    }

    public completeActivation(clientManager: ClientManager) {
        this.timer.stop();
        if (this.kwinClient === null) {
            return;
        }
        const kwinClient = this.kwinClient;
        this.kwinClient = null;
        clientManager.onClientFocused(kwinClient);
    }

    public cancel() {
        this.timer.stop();
        this.kwinClient = null;
    }

    public destroy() {
        this.timer.destroy();
    }
}
