class ScrollViewManager {
    private readonly config: ScrollView.Config;
    public readonly layoutConfig: LayoutConfig;
    private readonly scrollViewsPerActivity: Map<string, ScrollView[]>;
    private nDesktops: number;

    constructor(config: ScrollView.Config, layoutConfig: LayoutConfig, currentActivity: string) {
        this.config = config;
        this.layoutConfig = layoutConfig;
        this.scrollViewsPerActivity = new Map();
        this.nDesktops = 0;
        this.update()
        this.addActivity(currentActivity);
    }

    public update() {
        this.setNDesktops(workspace.desktops);
    }

    public get(activity: string, desktopNumber: number) {
        const desktopIndex = desktopNumber - 1;
        if (desktopIndex >= this.nDesktops || this.nDesktops < 0) {
            throw new Error("invalid desktop number: " + String(desktopNumber));
        }
        if (!this.scrollViewsPerActivity.has(activity)) {
            this.addActivity(activity);
        }
        return this.scrollViewsPerActivity.get(activity)![desktopIndex];
    }

    public getCurrent() {
        return this.get(workspace.currentActivity, workspace.currentDesktop);
    }

    public getInCurrentActivity(desktopNumber: number) {
        return this.get(workspace.currentActivity, desktopNumber);
    }

    public getForClient(kwinClient: AbstractClient) {
        console.assert(kwinClient.activities.length === 1);
        return this.get(kwinClient.activities[0], kwinClient.desktop);
    }

    private setNDesktops(nDesktops: number) {
        if (nDesktops > this.nDesktops) {
            this.addDesktopsToActivities(nDesktops - this.nDesktops);
        } else if (nDesktops < this.nDesktops) {
            this.removeDesktopsFromActivities(this.nDesktops - nDesktops);
        }
        this.nDesktops = nDesktops;
    }

    private addDesktopsToActivities(n: number) {
        for (const scrollViews of this.scrollViewsPerActivity.values()) {
            this.addDesktops(scrollViews, n);
        }
    }

    private addDesktops(scrollViews: ScrollView[], n: number) {
        const nStart = scrollViews.length;
        for (let i = 0; i < n; i++) {
            const desktopNumber = nStart + i + 1;
            scrollViews.push(new ScrollView(desktopNumber, this.config, this.layoutConfig));
        }
    }

    private removeDesktopsFromActivities(n: number) {
        const lastRemainingDesktopIndex = this.nDesktops - n - 1;
        for (const scrollViews of this.scrollViewsPerActivity.values()) {
            const targetScrollView = scrollViews[lastRemainingDesktopIndex];
            for (let i = 0; i < n; i++) {
                const removedScrollView = scrollViews.pop()!;
                removedScrollView.grid.evacuate(targetScrollView.grid);
            }
        }
    }

    private addActivity(activity: string) {
        const scrollViews: ScrollView[] = [];
        this.addDesktops(scrollViews, this.nDesktops);
        this.scrollViewsPerActivity.set(activity, scrollViews);
    }

    private removeActivity(activity: string) {
        const removedScrollViews = this.scrollViewsPerActivity.get(activity)!;
        this.scrollViewsPerActivity.delete(activity);
        const targetActivityScrollViews = this.scrollViewsPerActivity.values().next().value;
        for (let i = 0; i < removedScrollViews.length; i++) {
            removedScrollViews[i].grid.evacuate(targetActivityScrollViews[i]);
        }
    }

    public destroy() {
        for (const scrollView of this.scrollViews()) {
            scrollView.destroy();
        }
    }

    public *scrollViews() {
        for (const scrollViews of this.scrollViewsPerActivity.values()) {
            for (const scrollView of scrollViews) {
                yield scrollView;
            }
        }
    }
}
