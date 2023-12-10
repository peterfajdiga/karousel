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

    public getAvailableSpace(desktopNumber: number, screen: QmlRect) {
        const baseLot = new PinManager.Lot(screen.top, screen.bottom, screen.left, screen.right);
        let lots = [baseLot];
        for (const client of this.pinnedClients) {
            if (!Clients.isOnVirtualDesktop(client, desktopNumber)) {
                continue;
            }

            const newLots: PinManager.Lot[] = [];
            for (const lot of lots) {
                lot.split(newLots, client.frameGeometry);
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

            if (obstacle.top - this.top >= Lot.minHeight) {
                destLots.push(new Lot(this.top, obstacle.top, this.left, this.right));
            }
            if (this.bottom - obstacle.bottom >= Lot.minHeight) {
                destLots.push(new Lot(obstacle.bottom, this.bottom, this.left, this.right));
            }
            if (obstacle.left - this.left >= Lot.minWidth) {
                destLots.push(new Lot(this.top, this.bottom, this.left, obstacle.left));
            }
            if (this.right - obstacle.right >= Lot.minWidth) {
                destLots.push(new Lot(this.top, this.bottom, obstacle.right, this.right));
            }
        }

        private contains(obstacle: QmlRect) {
            return obstacle.right >= this.left && obstacle.left <= this.right &&
                obstacle.bottom >= this.top && obstacle.top <= this.bottom;
        }

        public area() {
            return (this.bottom - this.top) * (this.right - this.left);
        }
    }
}
