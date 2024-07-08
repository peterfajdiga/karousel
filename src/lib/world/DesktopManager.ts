class DesktopManager {
    private readonly pinManager: PinManager;
    private readonly config: Desktop.Config;
    public readonly layoutConfig: LayoutConfig;
    private readonly desktops: Map<string, Desktop>; // key is activityId|desktopId
    private kwinScreens: Set<Output>;
    private kwinActivities: Set<string>;
    private kwinDesktops: Set<KwinDesktop>;

    constructor(
        pinManager: PinManager,
        config: Desktop.Config,
        layoutConfig: LayoutConfig,
        currentScreen: Output,
        currentActivity: string,
        currentDesktop: KwinDesktop
    ) {
        this.pinManager = pinManager;
        this.config = config;
        this.layoutConfig = layoutConfig;
        this.desktops = new Map();
        this.kwinScreens = new Set(Workspace.screens);
        this.kwinActivities = new Set(Workspace.activities);
        this.kwinDesktops = new Set(Workspace.desktops);
        this.addDesktop(currentScreen, currentActivity, currentDesktop);
    }

    public getDesktop(screen: Output, activity: string, kwinDesktop: KwinDesktop) {
        const desktopKey = DesktopManager.getDesktopKey(screen, activity, kwinDesktop);
        const desktop = this.desktops.get(desktopKey);
        if (desktop !== undefined) {
            return desktop;
        } else {
            return this.addDesktop(screen, activity, kwinDesktop);
        }
    }

    public getCurrentDesktop() {
        return this.getDesktop(Workspace.activeScreen, Workspace.currentActivity, Workspace.currentDesktop);
    }

    public getDesktopInCurrentActivity(kwinDesktop: KwinDesktop) {
        return this.getDesktop(Workspace.activeScreen, Workspace.currentActivity, kwinDesktop);
    }

    public getDesktopForClient(kwinClient: KwinClient) {
        if (kwinClient.activities.length !== 1 || kwinClient.desktops.length !== 1) {
            return undefined;
        }
        return this.getDesktop(kwinClient.output, kwinClient.activities[0], kwinClient.desktops[0]);
    }

    private addDesktop(screen: Output, activity: string, kwinDesktop: KwinDesktop) {
        const desktopKey = DesktopManager.getDesktopKey(screen, activity, kwinDesktop);
        const desktop = new Desktop(screen, kwinDesktop, this.pinManager, this.config, this.layoutConfig);
        this.desktops.set(desktopKey, desktop);
        return desktop;
    }

    private static getDesktopKey(screen: Output, activity: string, kwinDesktop: KwinDesktop) {
        return screen.name + "|" + activity + "|" + kwinDesktop.id;
    }

    public updateScreens() {
        const newScreens = new Set(Workspace.screens);
        for (const screen of this.kwinScreens) {
            if (!newScreens.has(screen)) {
                this.removeScreen(screen);
            }
        }
        this.kwinScreens = newScreens;
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

    private removeScreen(kwinScreen: Output) {
        for (const activity of this.kwinActivities) {
            for (const kwinDesktop of this.kwinDesktops) {
                this.destroyDesktop(kwinScreen, activity, kwinDesktop);
            }
        }
    }

    private removeActivity(activity: string) {
        for (const kwinScreen of this.kwinScreens) {
            for (const kwinDesktop of this.kwinDesktops) {
                this.destroyDesktop(kwinScreen, activity, kwinDesktop);
            }
        }
    }

    private removeKwinDesktop(kwinDesktop: KwinDesktop) {
        for (const kwinScreen of this.kwinScreens) {
            for (const activity of this.kwinActivities) {
                this.destroyDesktop(kwinScreen, activity, kwinDesktop);
            }
        }
    }

    private destroyDesktop(screen: Output, activity: string, kwinDesktop: KwinDesktop) {
        const desktopKey = DesktopManager.getDesktopKey(screen, activity, kwinDesktop);
        const desktop = this.desktops.get(desktopKey);
        if (desktop !== undefined) {
            desktop.destroy();
            this.desktops.delete(desktopKey);
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
        const desktops = this.getDesktops([kwinClient.output], kwinClient.activities, kwinClient.desktops); // workaround for QTBUG-109880
        return desktops;
    }

    // empty array means all
    public *getDesktops(screens: Output[], activities: string[], kwinDesktops: KwinDesktop[]) {
        const matchedScreens = screens.length > 0 ? screens : this.kwinScreens.keys();
        const matchedActivities = activities.length > 0 ? activities : this.kwinActivities.keys();
        const matchedDesktops = kwinDesktops.length > 0 ? kwinDesktops : this.kwinDesktops.keys();
        for (const matchedScreen of matchedScreens) {
            for (const matchedActivity of matchedActivities) {
                for (const matchedDesktop of matchedDesktops) {
                    const desktopKey = DesktopManager.getDesktopKey(matchedScreen, matchedActivity, matchedDesktop);
                    const desktop = this.desktops.get(desktopKey);
                    if (desktop !== undefined) {
                        yield desktop;
                    }
                }
            }
        }
    }
}
