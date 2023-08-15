class ClientWrapper {
    public readonly kwinClient: AbstractClient;
    public readonly stateManager: ClientStateManager;
    public transientFor: ClientWrapper | null;
    private readonly transients: ClientWrapper[];
    private readonly signalManager: SignalManager;
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
        this.signalManager = ClientWrapper.initSignalManager(this);
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

    private moveTransient(dx: number, dy: number) {
        // TODO: prevent moving off the grid
        if (this.stateManager.getState() instanceof ClientStateFloating) {
            const frame = this.kwinClient.frameGeometry;
            this.kwinClient.frameGeometry = Qt.rect(
                frame.x + dx,
                frame.y + dy,
                frame.width,
                frame.height,
            );

            for (const transient of this.transients) {
                transient.moveTransient(dx, dy);
            }
        }
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

    public ensureTransientsVisible(screenSize: QRect) {
        for (const transient of this.transients) {
            if (transient.stateManager.getState() instanceof ClientStateFloating) {
                transient.ensureVisible(screenSize);
                transient.ensureTransientsVisible(screenSize);

            }
        }
    }

    public ensureVisible(screenSize: QRect) {
        const frame = this.kwinClient.frameGeometry;
        if (frame.left < 0) {
            frame.x = 0;
        } else if (frame.right > screenSize.width) {
            frame.x = screenSize.width - frame.width;
        }
    }

    destroy(passFocus: boolean) {
        this.stateManager.destroy(passFocus);
        this.signalManager.destroy();
        if (this.rulesSignalManager !== null) {
            this.rulesSignalManager.destroy();
        }
        if (this.transientFor !== null) {
            this.transientFor.removeTransient(this);
        }
        for (const transient of this.transients) {
            transient.transientFor = null;
        }
    }

    static initSignalManager(client: ClientWrapper) {
        const manager = new SignalManager();
        manager.connect(client.kwinClient.frameGeometryChanged, (kwinClient: TopLevel, oldGeometry: QRect) => {
            if (client.stateManager.getState() instanceof ClientStateTiled) {
                const newGeometry = client.kwinClient.frameGeometry;
                const oldCenterX = oldGeometry.x + oldGeometry.width/2;
                const oldCenterY = oldGeometry.y + oldGeometry.height/2;
                const newCenterX = newGeometry.x + newGeometry.width/2;
                const newCenterY = newGeometry.y + newGeometry.height/2;
                const dx = Math.round(newCenterX - oldCenterX);
                const dy = Math.round(newCenterY - oldCenterY);
                for (const transient of client.transients) {
                    transient.moveTransient(dx, dy);
                }
            }
        });
        return manager;
    }
}
