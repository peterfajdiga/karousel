namespace Clients {
    export function canTileEver(kwinClient: KwinClient) {
        return kwinClient.resizeable;
    }

    export function canTileNow(kwinClient: KwinClient) {
        return canTileEver(kwinClient) && !kwinClient.minimized && kwinClient.desktop > 0 && kwinClient.activities.length === 1;
    }

    export function makeTileable(kwinClient: KwinClient) {
        if (kwinClient.minimized) {
            kwinClient.minimized = false;
        }
        if (kwinClient.desktop <= 0) {
            kwinClient.desktop = workspace.currentDesktop;
        }
        if (kwinClient.activities.length !== 1) {
            kwinClient.activities = [workspace.currentActivity];
        }
    }

    export function isMaximizedGeometry(kwinClient: KwinClient) {
        const maximizeArea = workspace.clientArea(ClientAreaOption.MaximizeArea, kwinClient.screen, kwinClient.desktop);
        return kwinClient.frameGeometry === maximizeArea;
    }

    export function isFullScreenGeometry(kwinClient: KwinClient) {
        const fullScreenArea = workspace.clientArea(ClientAreaOption.FullScreenArea, kwinClient.screen, kwinClient.desktop);
        return kwinClient.frameGeometry === fullScreenArea;
    }

    export function isOnVirtualDesktop(kwinClient: KwinClient, desktopNumber: number) {
        return kwinClient.desktop === desktopNumber || kwinClient.desktop === -1;
    }

    export function guessQuickTileMode(kwinClient: KwinClient) {
        const clientArea = workspace.clientArea(ClientAreaOption.PlacementArea, 0, kwinClient.desktop);
        const frame = kwinClient.frameGeometry;
        const top = frame.top === clientArea.top;
        const bottom = frame.bottom === clientArea.bottom;
        const left = frame.left === clientArea.left;
        const right = frame.right === clientArea.right;

        if (left && right) {
            if (top && !bottom) {
                return QuickTileMode.Top;
            } else if (bottom && !top) {
                return QuickTileMode.Bottom;
            } else {
                return QuickTileMode.Untiled;
            }
        } else if (left) {
            if (top && bottom) {
                return QuickTileMode.Left;
            } else if (top) {
                return QuickTileMode.TopLeft;
            } else if (bottom) {
                return QuickTileMode.BottomLeft;
            } else {
                return QuickTileMode.Untiled;
            }
        } else if (right) {
            if (top && bottom) {
                return QuickTileMode.Right;
            } else if (top) {
                return QuickTileMode.TopRight;
            } else if (bottom) {
                return QuickTileMode.BottomRight;
            } else {
                return QuickTileMode.Untiled;
            }
        } else {
            return QuickTileMode.Untiled;
        }
    }

    export enum QuickTileMode {
        Untiled,
        Top,
        Bottom,
        Left,
        Right,
        TopLeft,
        TopRight,
        BottomLeft,
        BottomRight,
    }
}
