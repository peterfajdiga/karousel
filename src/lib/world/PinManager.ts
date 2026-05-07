class PinManager {
    private readonly pinnedClients: Set<KwinClient>;

    constructor() {
        this.pinnedClients = new Set();
    }

    public addClient(kwinClient: KwinClient) {
        this.pinnedClients.add(kwinClient);
    }

    public removeClient(kwinClient: KwinClient) {
        this.pinnedClients.delete(kwinClient);
    }

    public getAvailableSpace(kwinDesktop: KwinDesktop, screen: QmlRect) {
        const baseLot = new PinManager.Lot(screen.y, rectBottom(screen), screen.x, rectRight(screen));
        let lots = [baseLot];
        for (const client of this.pinnedClients) {
            if (!Clients.isOnVirtualDesktop(client, kwinDesktop) || client.minimized) {
                continue;
            }

            const newLots: PinManager.Lot[] = [];
            for (const lot of lots) {
                lot.split(newLots, roundQtRect(client.frameGeometry));
            }
            lots = newLots;
        }

        let largestLot = baseLot;
        let largestArea = 0;
        for (const lot of lots) {
            const area = lot.area();
            if (area > largestArea) {
                largestArea = area;
                largestLot = lot;
            }
        }
        return largestLot;
    }
}

namespace PinManager {
    export class Lot {
        private static readonly minWidth = 200;
        private static readonly minHeight = 200;

        constructor(
            public readonly top: number,
            public readonly bottom: number,
            public readonly left: number,
            public readonly right: number,
        ) {}

        public split(destLots: Lot[], obstacle: QmlRect) {
            if (!this.contains(obstacle)) {
                // don't split
                destLots.push(this);
                return;
            }

            if (obstacle.y - this.top >= Lot.minHeight) {
                destLots.push(new Lot(this.top, obstacle.y, this.left, this.right));
            }
            if (this.bottom - rectBottom(obstacle) >= Lot.minHeight) {
                destLots.push(new Lot(rectBottom(obstacle), this.bottom, this.left, this.right));
            }
            if (obstacle.x - this.left >= Lot.minWidth) {
                destLots.push(new Lot(this.top, this.bottom, this.left, obstacle.x));
            }
            if (this.right - rectRight(obstacle) >= Lot.minWidth) {
                destLots.push(new Lot(this.top, this.bottom, rectRight(obstacle), this.right));
            }
        }

        private contains(obstacle: QmlRect) {
            return rectRight(obstacle) > this.left && obstacle.x < this.right &&
                rectBottom(obstacle) > this.top && obstacle.y < this.bottom;
        }

        public area() {
            return (this.bottom - this.top) * (this.right - this.left);
        }
    }
}
