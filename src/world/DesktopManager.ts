class DesktopManager {
    private readonly pinManager: PinManager;
    private readonly config: Desktop.Config;
    public readonly layoutConfig: LayoutConfig;
    private readonly desktops: Map<string, Desktop>; // key is activityId|desktopId
    private readonly kwinActivities: Set<string>;
    private readonly kwinDesktops: Set<KwinDesktop>;
    // TODO: remove removed desktops

    constructor(pinManager: PinManager, config: Desktop.Config, layoutConfig: LayoutConfig, currentActivity: string, currentDesktop: KwinDesktop) {
        this.pinManager = pinManager;
        this.config = config;
        this.layoutConfig = layoutConfig;
        this.desktops = new Map();
        this.kwinActivities = new Set();
        this.kwinDesktops = new Set();
        this.addDesktop(currentActivity, currentDesktop);
    }

    public getDesktop(activity: string, kwinDesktop: KwinDesktop) {
        const desktopKey = DesktopManager.getDesktopKey(activity, kwinDesktop);
        const desktop = this.desktops.get(desktopKey);
        if (desktop !== undefined) {
            return desktop;
        } else {
            return this.addDesktop(activity, kwinDesktop);
        }
    }

    public getCurrentDesktop() {
        return this.getDesktop(Workspace.currentActivity, Workspace.currentDesktop);
    }

    public getDesktopInCurrentActivity(kwinDesktop: KwinDesktop) {
        return this.getDesktop(Workspace.currentActivity, kwinDesktop);
    }

    // TODO: Remove?
    public getDesktopForClient(kwinClient: KwinClient) {
        if (kwinClient.activities.length !== 1 || kwinClient.desktops.length !== 1) {
            return undefined;
        }
        return this.getDesktop(kwinClient.activities[0], kwinClient.desktops[0]);
    }

    private addDesktop(activity: string, kwinDesktop: KwinDesktop) {
        const desktopKey = DesktopManager.getDesktopKey(activity, kwinDesktop);
        const desktop = new Desktop(kwinDesktop, this.pinManager, this.config, this.layoutConfig);
        this.desktops.set(desktopKey, desktop);
        this.kwinActivities.add(activity);
        this.kwinDesktops.add(kwinDesktop);
        return desktop;
    }

    private static getDesktopKey(activity: string, kwinDesktop: KwinDesktop) {
        return activity + "|" + kwinDesktop.id;
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

    public *getDesktopsForClient(kwinClient: KwinClient) {
        // TODO: call `getDesktops` when Qt bug is fixed
        const clientActivities = kwinClient.activities.length > 0 ? kwinClient.activities : this.kwinActivities.keys();
        const clientDesktops = kwinClient.desktops.length > 0 ? kwinClient.desktops : this.kwinDesktops.keys();
        for (const clientActivity of clientActivities) {
            for (const clientDesktop of clientDesktops) {
                yield this.getDesktop(clientActivity, clientDesktop);
            }
        }
    }

    // empty array means all
    public *getDesktops(activities: string[], kwinDesktops: KwinDesktop[]) {
        const matchedActivities = activities.length > 0 ? activities : this.kwinActivities.keys();
        const matchedDesktops = kwinDesktops.length > 0 ? kwinDesktops : this.kwinDesktops.keys();
        for (const clientActivity of matchedActivities) {
            for (const clientDesktop of matchedDesktops) {
                yield this.getDesktop(clientActivity, clientDesktop);
            }
        }
    }
}
