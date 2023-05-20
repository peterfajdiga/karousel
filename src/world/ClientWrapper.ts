class ClientWrapper {
    public readonly kwinClient: AbstractClient;
    public readonly stateManager: ClientStateManager;
    private readonly transientFor: ClientWrapper | null;
    private readonly transients: ClientWrapper[];
    private readonly rulesSignalManager: SignalManager | null;
    public preferredWidth: number;
    private readonly manipulatingGeometry: Doer;

    constructor(
        kwinClient: AbstractClient,
        initialState: ClientState,
        transientFor: ClientWrapper | null,
        rulesSignalManager: SignalManager | null,
    ) {
        this.kwinClient = kwinClient;
        this.stateManager = new ClientStateManager(initialState);
        this.transientFor = transientFor;
        this.transients = [];
        if (transientFor !== null) {
            transientFor.addTransient(this);
        }
        this.rulesSignalManager = rulesSignalManager;
        this.preferredWidth = kwinClient.frameGeometry.width;
        this.manipulatingGeometry = new Doer();
    }

    place(x: number, y: number, width: number, height: number) {
        this.manipulatingGeometry.do(() => {
            if (this.kwinClient.resize) {
                // window is being manually resized, prevent fighting with the user
                return;
            }
            this.kwinClient.frameGeometry = Qt.rect(x, y, width, height);
        });
    }

    focus() {
        workspace.activeClient = this.kwinClient;
    }

    isFocused() {
        return workspace.activeClient === this.kwinClient;
    }

    setMaximize(horizontally: boolean, vertically: boolean) {
        this.manipulatingGeometry.do(() => {
            this.kwinClient.setMaximize(vertically, horizontally);
        });
    }

    setFullScreen(fullScreen: boolean) {
        this.manipulatingGeometry.do(() => {
            this.kwinClient.fullScreen = fullScreen;
        });
    }

    setShade(shade: boolean) {
        this.manipulatingGeometry.do(() => {
            this.kwinClient.shade = shade;
        });
    }

    isShaded() {
        return this.kwinClient.shade;
    }

    isManipulatingGeometry() {
        return this.manipulatingGeometry.isDoing();
    }

    prepareForTiling() {
        this.kwinClient.keepBelow = true;
        this.setFullScreen(false);
        this.setMaximize(false, false);
    }

    prepareForFloating(screenSize: QRect) {
        this.kwinClient.keepBelow = false;
        this.setShade(false);
        this.setFullScreen(false);
        this.setMaximize(false, false);

        const clientRect = this.kwinClient.frameGeometry;
        const width = this.preferredWidth;
        this.place(
            clamp(clientRect.x, screenSize.left, screenSize.right - width),
            clientRect.y,
            width,
            Math.min(clientRect.height, Math.round(screenSize.height / 2)),
        );
    }

    private addTransient(transient: ClientWrapper) {
        this.transients.push(transient);
    }

    private removeTransient(transient: ClientWrapper) {
        const i = this.transients.indexOf(transient);
        this.transients.splice(i, 1);
    }

    destroy(passFocus: boolean) {
        this.stateManager.destroy(passFocus);
        if (this.rulesSignalManager !== null) {
            this.rulesSignalManager.destroy();
        }
        if (this.transientFor !== null) {
            this.transientFor.removeTransient(this);
        }
    }
}
