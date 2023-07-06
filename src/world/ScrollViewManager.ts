class ScrollViewManager {
    private readonly world: World;
    private readonly scrollViewsPerActivity: Map<string, ScrollView[]>;
    private nDesktops: number;

    constructor(world: World, currentActivity: string, nDesktops: number) {
        this.world = world;
        this.scrollViewsPerActivity = new Map();
        this.nDesktops = 0;
        this.setNDesktops(nDesktops);
        this.addActivity(currentActivity);
    }

    get(activity: string, desktopNumber: number) {
        const desktopIndex = desktopNumber - 1;
        if (desktopIndex >= this.nDesktops || this.nDesktops < 0) {
            throw new Error("invalid desktop number: " + String(desktopNumber));
        }
        if (!this.scrollViewsPerActivity.has(activity)) {
            this.addActivity(activity);
        }
        return this.scrollViewsPerActivity.get(activity)![desktopIndex];
    }

    setNDesktops(nDesktops: number) {
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
            scrollViews.push(new ScrollView(this.world, desktopNumber));
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

    addActivity(activity: string) {
        const scrollViews: ScrollView[] = [];
        this.addDesktops(scrollViews, this.nDesktops);
        this.scrollViewsPerActivity.set(activity, scrollViews);
    }

    removeActivity(activity: string) {
        const removedScrollViews = this.scrollViewsPerActivity.get(activity)!;
        this.scrollViewsPerActivity.delete(activity);
        const targetActivityScrollViews = this.scrollViewsPerActivity.values().next().value;
        for (let i = 0; i < removedScrollViews.length; i++) {
            removedScrollViews[i].grid.evacuate(targetActivityScrollViews[i]);
        }
    }

    *scrollViews() {
        for (const scrollViews of this.scrollViewsPerActivity.values()) {
            for (const scrollView of scrollViews) {
                yield scrollView;
            }
        }
    }
}
