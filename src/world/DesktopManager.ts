class DesktopManager {
    private readonly pinManager: PinManager;
    private readonly config: Desktop.Config;
    public readonly layoutConfig: LayoutConfig;
    private readonly desktopsPerActivity: Map<string, Desktop[]>;
    private nVirtualDesktops: number;

    constructor(pinManager: PinManager, config: Desktop.Config, layoutConfig: LayoutConfig, currentActivity: string) {
        this.pinManager = pinManager;
        this.config = config;
        this.layoutConfig = layoutConfig;
        this.desktopsPerActivity = new Map();
        this.nVirtualDesktops = 0;
        this.update()
        this.addActivity(currentActivity);
    }

    public update() {
        this.setNVirtualDesktops(workspace.desktops);
    }

    public getDesktop(activity: string, desktopNumber: number) {
        const desktopIndex = desktopNumber - 1;
        if (desktopIndex >= this.nVirtualDesktops || desktopIndex < 0) {
            throw new Error("invalid desktop number: " + String(desktopNumber));
        }
        if (!this.desktopsPerActivity.has(activity)) {
            this.addActivity(activity);
        }
        return this.desktopsPerActivity.get(activity)![desktopIndex];
    }

    public getCurrentDesktop() {
        return this.getDesktop(workspace.currentActivity, workspace.currentDesktop);
    }

    public getDesktopInCurrentActivity(desktopNumber: number) {
        return this.getDesktop(workspace.currentActivity, desktopNumber);
    }

    public getDesktopForClient(kwinClient: KwinClient) {
        console.assert(kwinClient.activities.length === 1 && kwinClient.desktop > 0);
        return this.getDesktop(kwinClient.activities[0], kwinClient.desktop);
    }

    private setNVirtualDesktops(nVirtualDesktops: number) {
        if (nVirtualDesktops > this.nVirtualDesktops) {
            this.addDesktopsToActivities(nVirtualDesktops - this.nVirtualDesktops);
        } else if (nVirtualDesktops < this.nVirtualDesktops) {
            this.removeDesktopsFromActivities(this.nVirtualDesktops - nVirtualDesktops);
        }
        this.nVirtualDesktops = nVirtualDesktops;
    }

    private addDesktopsToActivities(n: number) {
        for (const desktops of this.desktopsPerActivity.values()) {
            this.addDesktops(desktops, n);
        }
    }

    private addDesktops(desktops: Desktop[], n: number) {
        const nStart = desktops.length;
        for (let i = 0; i < n; i++) {
            const desktopNumber = nStart + i + 1;
            desktops.push(new Desktop(desktopNumber, this.pinManager, this.config, this.layoutConfig));
        }
    }

    private removeDesktopsFromActivities(n: number) {
        const lastRemainingDesktopIndex = this.nVirtualDesktops - n - 1;
        for (const desktops of this.desktopsPerActivity.values()) {
            const targetDesktop = desktops[lastRemainingDesktopIndex];
            for (let i = 0; i < n; i++) {
                const removedDesktop = desktops.pop()!;
                removedDesktop.grid.evacuate(targetDesktop.grid);
            }
        }
    }

    private addActivity(activity: string) {
        const desktops: Desktop[] = [];
        this.addDesktops(desktops, this.nVirtualDesktops);
        this.desktopsPerActivity.set(activity, desktops);
    }

    private removeActivity(activity: string) {
        const removedDesktops = this.desktopsPerActivity.get(activity)!;
        this.desktopsPerActivity.delete(activity);
        const targetActivityDesktops = this.desktopsPerActivity.values().next().value;
        for (let i = 0; i < removedDesktops.length; i++) {
            removedDesktops[i].grid.evacuate(targetActivityDesktops[i]);
        }
    }

    public destroy() {
        for (const desktop of this.desktops()) {
            desktop.destroy();
        }
    }

    public *desktops() {
        for (const desktops of this.desktopsPerActivity.values()) {
            for (const desktop of desktops) {
                yield desktop;
            }
        }
    }

    public *getDesktopsForClient(kwinClient: KwinClient) {
        const activities = kwinClient.activities.length > 0 ? kwinClient.activities : this.desktopsPerActivity.keys();
        for (const activity of activities) {
            if (!this.desktopsPerActivity.has(activity)) {
                this.addActivity(activity);
            }
            const activityDesktops = this.desktopsPerActivity.get(activity)!;
            if (kwinClient.desktop === -1) {
                for (const desktop of activityDesktops) {
                    yield desktop;
                }
            } else {
                const desktopIndex = kwinClient.desktop - 1;
                yield activityDesktops[desktopIndex];
            }
        }
    }

    // empty array means all
    public *getDesktops(desktopNumbers: number[], inputActivities: string[]) {
        const activities = inputActivities.length > 0 ? inputActivities : this.desktopsPerActivity.keys();
        for (const activity of activities) {
            if (!this.desktopsPerActivity.has(activity)) {
                this.addActivity(activity);
            }
            const activityDesktops = this.desktopsPerActivity.get(activity)!;
            if (desktopNumbers.length === 0) {
                for (const desktop of activityDesktops) {
                    yield desktop;
                }
            } else {
                for (const desktopNumber of desktopNumbers) {
                    const desktopIndex = desktopNumber - 1;
                    yield activityDesktops[desktopIndex];
                }
            }
        }
    }
}
