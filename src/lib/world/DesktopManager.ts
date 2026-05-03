class DesktopManager {
    private readonly desktops: Map<string, Desktop>; // key is activityId|desktopId
    private readonly screenDesktops: Map<number, Desktop>;
    private kwinActivities: Set<string>;
    private kwinDesktops: Set<KwinDesktop>;

    constructor(
        private readonly pinManager: PinManager,
        private readonly config: Desktop.Config,
        private readonly layoutConfig: LayoutConfig,
        private readonly focusPasser: FocusPassing.Passer,
        private readonly desktopFilter: DesktopFilter,
    ) {
        this.desktops = new Map();
        this.screenDesktops = new Map();
        this.kwinActivities = new Set(Workspace.activities);
        this.kwinDesktops = new Set(Workspace.desktops);
    }

    public getDesktopForScreen(screenIndex: number, activity: string, kwinDesktop: KwinDesktop) {
        const enabledRaw = (this.config as any).enabledScreens;
        const enabled = Array.isArray(enabledRaw) ? enabledRaw : [];
        const isEnabled = enabled.length === 0 || enabled.includes(-1) || enabled.includes(screenIndex);

        if (!isEnabled) {
            return undefined;
        }

        if (!this.desktopFilter.shouldWorkOnDesktop(kwinDesktop)) {
            return undefined;
        }

        const key = `${activity}|${kwinDesktop.id}|${screenIndex}`;
        let desktop = this.desktops.get(key);
        if (desktop === undefined) {
            desktop = this.addDesktop(screenIndex, activity, kwinDesktop);
        }

        return desktop;
    }

    private addDesktop(screenIndex: number, activity: string, kwinDesktop: KwinDesktop) {
        const key = `${activity}|${kwinDesktop.id}|${screenIndex}`;
        const desktop = new Desktop(
            kwinDesktop,
            this.pinManager,
            this.config,
            () => {
                const screens = (Workspace as ExtendedWorkspace).screens || [];
                return screens[screenIndex] || Workspace.activeScreen;
            },
            this.layoutConfig,
            this.focusPasser,
        );
        this.desktops.set(key, desktop);
        this.screenDesktops.set(screenIndex, desktop);
        return desktop;
    }

    public getCurrentDesktop() {
        const screen = Workspace.activeScreen;
        const screens = (Workspace as ExtendedWorkspace).screens || [];
        const screenIndex = screens.indexOf(screen);
        return this.getDesktopForScreen(screenIndex >= 0 ? screenIndex : 0, Workspace.currentActivity, Workspace.currentDesktop);
    }

    public getDesktopForClient(kwinClient: KwinClient) {
        const screenIndex = (kwinClient as ExtendedKwinClient).screen || 0;
        if (kwinClient.activities.length !== 1 || kwinClient.desktops.length !== 1) {
            return undefined;
        }
        return this.getDesktopForScreen(screenIndex, kwinClient.activities[0], kwinClient.desktops[0]);
    }

    public updateActivities() {
        const newActivities = new Set(Workspace.activities);
        for (const activity of this.kwinActivities) {
            if (!newActivities.has(activity)) {
                this.removeActivity(activity);
            }
        }
        this.kwinActivities = newActivities;
    }

    public updateDesktops() {
        const newDesktops = new Set(Workspace.desktops);
        for (const desktop of this.kwinDesktops) {
            if (!newDesktops.has(desktop)) {
                this.removeKwinDesktop(desktop);
            }
        }
        this.kwinDesktops = newDesktops;
    }

    private removeActivity(activity: string) {
        for (const kwinDesktop of this.kwinDesktops) {
            this.destroyDesktop(activity, kwinDesktop);
        }
    }

    private removeKwinDesktop(kwinDesktop: KwinDesktop) {
        for (const activity of this.kwinActivities) {
            this.destroyDesktop(activity, kwinDesktop);
        }
    }

    private destroyDesktop(activity: string, kwinDesktop: KwinDesktop) {
        for (const screenIndex of this.screenDesktops.keys()) {
            const key = `${activity}|${kwinDesktop.id}|${screenIndex}`;
            const desktop = this.desktops.get(key);
            if (desktop !== undefined) {
                desktop.destroy();
                this.desktops.delete(key);
            }
        }
    }

    public destroy() {
        for (const desktop of this.desktops.values()) {
            desktop.destroy();
        }
    }

    public *getAllDesktops() {
        for (const desktop of this.desktops.values()) {
            yield desktop;
        }
    }

    public getDesktopsForClient(kwinClient: KwinClient) {
        const screenIndex = (kwinClient as ExtendedKwinClient).screen || 0;
        const desktops = [];
        for (const desktop of this.getDesktops(kwinClient.activities, kwinClient.desktops)) {
            desktops.push(desktop);
        }
        return desktops;
    }

    public *getDesktops(activities: string[], kwinDesktops: KwinDesktop[]) {
        const matchedActivities = activities.length > 0 ? activities : this.kwinActivities;
        const matchedDesktops = kwinDesktops.length > 0 ? kwinDesktops : this.kwinDesktops;
        for (const matchedActivity of matchedActivities) {
            for (const matchedDesktop of matchedDesktops) {
                for (const screenIndex of this.screenDesktops.keys()) {
                    const key = `${matchedActivity}|${matchedDesktop.id}|${screenIndex}`;
                    const desktop = this.desktops.get(key);
                    if (desktop !== undefined) {
                        yield desktop;
                    }
                }
            }
        }
    }

    public getDesktopInCurrentActivity(kwinDesktop: KwinDesktop) {
        const screen = Workspace.activeScreen;
        const screens = (Workspace as ExtendedWorkspace).screens || [];
        const screenIndex = screens.indexOf(screen);
        return this.getDesktopForScreen(screenIndex >= 0 ? screenIndex : 0, Workspace.currentActivity, kwinDesktop);
    }

}

interface ExtendedKwinClient extends KwinClient {
    screen: number;
}

interface ExtendedWorkspace extends Workspace {
    screens: Output[];
}

