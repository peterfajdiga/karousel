class ClientWrapper {
    public readonly kwinClient: KwinClient;
    public readonly stateManager: ClientState.Manager;
    public transientFor: ClientWrapper | null;
    private readonly transients: ClientWrapper[];
    private readonly rulesSignalManager: SignalManager | null;
    public preferredWidth: number;
    private readonly manipulatingGeometry: Doer;
    private lastPlacement: QmlRect | null; // workaround for issue #19

    constructor(
        kwinClient: KwinClient,
        constructInitialState: (client: ClientWrapper) => ClientState.State,
        transientFor: ClientWrapper | null,
        rulesSignalManager: SignalManager | null,
    ) {
        this.kwinClient = kwinClient;
        this.transientFor = transientFor;
        this.transients = [];
        if (transientFor !== null) {
            transientFor.addTransient(this);
        }
        this.rulesSignalManager = rulesSignalManager;
        this.preferredWidth = kwinClient.frameGeometry.width;
        this.manipulatingGeometry = new Doer();
        this.lastPlacement = null;
        this.stateManager = new ClientState.Manager(constructInitialState(this));
    }

    public place(x: number, y: number, width: number, height: number) {
        this.manipulatingGeometry.do(() => {
            if (this.kwinClient.resize) {
                // window is being manually resized, prevent fighting with the user
                return;
            }
            const clientWrapper = this; // workaround for bug in Qt5's JS engine
            clientWrapper.lastPlacement = Qt.rect(x, y, width, height);
            clientWrapper.kwinClient.frameGeometry = clientWrapper.lastPlacement;
            if (clientWrapper.kwinClient.frameGeometry !== clientWrapper.lastPlacement) {
                // frameGeometry assignment failed. This sometimes happens on Wayland
                // when a window is off-screen, effectively making it stuck there.
                clientWrapper.kwinClient.frameGeometry.x = x; // This makes it unstuck.
                clientWrapper.kwinClient.frameGeometry = clientWrapper.lastPlacement;
            }
        });
    }

    private moveTransient(dx: number, dy: number, desktopNumber: number) {
        if (this.stateManager.getState() instanceof ClientState.Floating) {
            if (this.kwinClient.desktop === desktopNumber) {
                const frame = this.kwinClient.frameGeometry;
                this.kwinClient.frameGeometry = Qt.rect(
                    frame.x + dx,
                    frame.y + dy,
                    frame.width,
                    frame.height,
                );
            }

            for (const transient of this.transients) {
                transient.moveTransient(dx, dy, desktopNumber);
            }
        }
    }

    public moveTransients(dx: number, dy: number) {
        for (const transient of this.transients) {
            transient.moveTransient(dx, dy, this.kwinClient.desktop);
        }
    }

    public focus() {
        workspace.activeClient = this.kwinClient;
    }

    public isFocused() {
        return workspace.activeClient === this.kwinClient;
    }

    public setMaximize(horizontally: boolean, vertically: boolean) {
        this.manipulatingGeometry.do(() => {
            this.kwinClient.setMaximize(vertically, horizontally);
        });
    }

    public setFullScreen(fullScreen: boolean) {
        this.manipulatingGeometry.do(() => {
            this.kwinClient.fullScreen = fullScreen;
        });
    }

    public setShade(shade: boolean) {
        this.manipulatingGeometry.do(() => {
            this.kwinClient.shade = shade;
        });
    }

    public isShaded() {
        return this.kwinClient.shade;
    }

    public isManipulatingGeometry(newGeometry: QmlRect | null) {
        if (newGeometry !== null && newGeometry === this.lastPlacement) {
            return true;
        }
        return this.manipulatingGeometry.isDoing();
    }

    private addTransient(transient: ClientWrapper) {
        this.transients.push(transient);
    }

    private removeTransient(transient: ClientWrapper) {
        const i = this.transients.indexOf(transient);
        this.transients.splice(i, 1);
    }

    public ensureTransientsVisible(screenSize: QmlRect) {
        for (const transient of this.transients) {
            if (transient.stateManager.getState() instanceof ClientState.Floating) {
                transient.ensureVisible(screenSize);
                transient.ensureTransientsVisible(screenSize);
            }
        }
    }

    public ensureVisible(screenSize: QmlRect) {
        if (this.kwinClient.desktop !== workspace.currentDesktop) {
            return;
        }
        const frame = this.kwinClient.frameGeometry;
        if (frame.left < screenSize.left) {
            frame.x = screenSize.left;
        } else if (frame.right > screenSize.right) {
            frame.x = screenSize.right - frame.width;
        }
    }

    public destroy(passFocus: boolean) {
        this.stateManager.destroy(passFocus);
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
}
