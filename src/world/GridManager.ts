class GridManager {
    private readonly world: World;
    private readonly gridsPerActivity: Map<string, Grid[]>;
    private nDesktops: number;

    constructor(world: World, currentActivity: string, nDesktops: number) {
        this.world = world;
        this.gridsPerActivity = new Map();
        this.nDesktops = 0;
        this.setNDesktops(nDesktops);
        this.addActivity(currentActivity);
    }

    get(activity: string, desktopNumber: number) {
        const desktopIndex = desktopNumber - 1;
        if (desktopIndex >= this.nDesktops || this.nDesktops < 0) {
            throw new Error("invalid desktop number: " + String(desktopNumber));
        }
        if (!this.gridsPerActivity.has(activity)) {
            this.addActivity(activity);
        }
        return this.gridsPerActivity.get(activity)![desktopIndex];
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
        for (const grids of this.gridsPerActivity.values()) {
            this.addDesktops(grids, n);
        }
    }

    private addDesktops(grids: Grid[], n: number) {
        const nStart = grids.length;
        for (let i = 0; i < n; i++) {
            const desktopNumber = nStart + i + 1;
            grids.push(new Grid(this.world, desktopNumber));
        }
    }

    private removeDesktopsFromActivities(n: number) {
        const lastRemainingDesktopIndex = this.nDesktops - n - 1;
        for (const grids of this.gridsPerActivity.values()) {
            const targetGrid = grids[lastRemainingDesktopIndex];
            for (let i = 0; i < n; i++) {
                const removedGrid = grids.pop()!;
                removedGrid.evacuate(targetGrid);
            }
        }
    }

    addActivity(activity: string) {
        const grids: Grid[] = [];
        this.addDesktops(grids, this.nDesktops);
        this.gridsPerActivity.set(activity, grids);
    }

    removeActivity(activity: string) {
        const removedGrids = this.gridsPerActivity.get(activity)!;
        this.gridsPerActivity.delete(activity);
        const targetActivityGrids = this.gridsPerActivity.values().next().value;
        for (let i = 0; i < removedGrids.length; i++) {
            removedGrids[i].evacuate(targetActivityGrids[i]);
        }
    }

    *grids() {
        for (const grids of this.gridsPerActivity.values()) {
            for (const grid of grids) {
                yield grid;
            }
        }
    }
}
