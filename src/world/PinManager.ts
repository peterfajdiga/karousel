class PinManager {
    private readonly pinnedClients: Map<TopLevel, Clients.QuickTileMode>;

    constructor() {
        this.pinnedClients = new Map();
    }

    public setClient(kwinClient: TopLevel, mode: Clients.QuickTileMode) {
        this.pinnedClients.set(kwinClient, mode);
    }

    public removeClient(kwinClient: TopLevel) {
        this.pinnedClients.delete(kwinClient);
    }

    public getMargins(desktopNumber: number, screen: QRect) {
        let margins = { top: 0, bottom: 0, left: 0, right: 0 };

        const occupied = {
            top: false,
            bottom: false,
            left: false,
            right: false,
            topLeft: false,
            topRight: false,
            bottomLeft: false,
            bottomRight: false,
        }

        for (const [client, mode] of this.pinnedClients.entries()) {
            if (!Clients.isOnVirtualDesktop(client, desktopNumber)) {
                continue;
            }

            const clientFrame = client.frameGeometry;
            switch (mode) {
                case Clients.QuickTileMode.Top: {
                    occupied.top = true;
                    occupied.left = true;
                    occupied.right = true;
                    occupied.topLeft = true;
                    occupied.topRight = true;
                    break;
                }
                case Clients.QuickTileMode.Bottom: {
                    occupied.bottom = true;
                    occupied.left = true;
                    occupied.right = true;
                    occupied.bottomLeft = true;
                    occupied.bottomRight = true;
                    break;
                }
                case Clients.QuickTileMode.Left: {
                    occupied.top = true;
                    occupied.bottom = true;
                    occupied.left = true;
                    occupied.topLeft = true;
                    occupied.bottomLeft = true;
                    break;
                }
                case Clients.QuickTileMode.Right: {
                    occupied.top = true;
                    occupied.bottom = true;
                    occupied.right = true;
                    occupied.topRight = true;
                    occupied.bottomRight = true;
                    break;
                }
                case Clients.QuickTileMode.TopLeft: {
                    occupied.topLeft = true;
                    occupied.top = true;
                    occupied.left = true;
                    break;
                }
                case Clients.QuickTileMode.TopRight: {
                    occupied.topRight = true;
                    occupied.top = true;
                    occupied.right = true;
                    break;
                }
                case Clients.QuickTileMode.BottomLeft: {
                    occupied.bottomLeft = true;
                    occupied.bottom = true;
                    occupied.left = true;
                    break;
                }
                case Clients.QuickTileMode.BottomRight: {
                    occupied.bottomRight = true;
                    occupied.bottom = true;
                    occupied.right = true;
                    break;
                }
            }

            switch (mode) {
                case Clients.QuickTileMode.Top:
                case Clients.QuickTileMode.TopLeft:
                case Clients.QuickTileMode.TopRight: {
                    margins.top = Math.max(margins.top, clientFrame.height);
                    break;
                }
                case Clients.QuickTileMode.Bottom:
                case Clients.QuickTileMode.BottomLeft:
                case Clients.QuickTileMode.BottomRight: {
                    margins.bottom = Math.max(margins.bottom, clientFrame.height);
                    break;
                }
            }
            switch (mode) {
                case Clients.QuickTileMode.Left:
                case Clients.QuickTileMode.TopLeft:
                case Clients.QuickTileMode.BottomLeft: {
                    margins.left = Math.max(margins.left, clientFrame.width);
                    break;
                }
                case Clients.QuickTileMode.Right:
                case Clients.QuickTileMode.TopRight:
                case Clients.QuickTileMode.BottomRight: {
                    margins.right = Math.max(margins.right, clientFrame.width);
                    break;
                }
            }
        }

        const largestVacantZone = {
            margins: { top: 0, bottom: 0, left: 0, right: 0 },
            area: 0,
        }

        if (!occupied.top) PinManager.considerVacantZone(largestVacantZone, screen, { top: 0, bottom: margins.bottom, left: 0, right: 0 });
        if (!occupied.bottom) PinManager.considerVacantZone(largestVacantZone, screen, { top: margins.top, bottom: 0, left: 0, right: 0 });
        if (!occupied.left) PinManager.considerVacantZone(largestVacantZone, screen, { top: 0, bottom: 0, left: 0, right: margins.right });
        if (!occupied.right) PinManager.considerVacantZone(largestVacantZone, screen, { top: 0, bottom: 0, left: margins.left, right: 0 });
        if (!occupied.topLeft) PinManager.considerVacantZone(largestVacantZone, screen, { top: 0, bottom: margins.bottom, left: 0, right: margins.right });
        if (!occupied.topRight) PinManager.considerVacantZone(largestVacantZone, screen, { top: 0, bottom: margins.bottom, left: margins.left, right: 0 });
        if (!occupied.bottomLeft) PinManager.considerVacantZone(largestVacantZone, screen, { top: margins.top, bottom: 0, left: 0, right: margins.right });
        if (!occupied.bottomRight) PinManager.considerVacantZone(largestVacantZone, screen, { top: margins.top, bottom: 0, left: margins.left, right: 0 });

        return largestVacantZone.margins;
    }

    private static considerVacantZone(largestVacantZone: PinManager.Zone, screen: QRect, margins: PinManager.Margins) {
        let zoneWidth = screen.width;
        if (margins.left > 0) {
            zoneWidth -= margins.left;
        } else if (margins.right > 0) {
            zoneWidth -= margins.right;
        }

        let zoneHeight = screen.height;
        if (margins.top > 0) {
            zoneHeight -= margins.top;
        } else if (margins.bottom > 0) {
            zoneHeight -= margins.bottom;
        }

        const area = zoneWidth * zoneHeight;
        if (area > largestVacantZone.area) {
            largestVacantZone.margins = margins;
            largestVacantZone.area = area;
        }
    }
}

namespace PinManager {
    export type Margins = {
        top: number,
        bottom: number,
        left: number,
        right: number,
    }

    export type Zone = {
        margins: Margins;
        area: number;
    }
}
