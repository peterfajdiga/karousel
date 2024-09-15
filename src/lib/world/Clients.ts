namespace Clients {
    export function canTileEver(kwinClient: KwinClient) {
        return kwinClient.moveable && kwinClient.resizeable && !kwinClient.popupWindow;
    }

    export function canTileNow(kwinClient: KwinClient) {
        return canTileEver(kwinClient) && !kwinClient.minimized && kwinClient.desktops.length === 1 && kwinClient.activities.length === 1;
    }

    export function makeTileable(kwinClient: KwinClient) {
        if (kwinClient.minimized) {
            kwinClient.minimized = false;
        }
        if (kwinClient.desktops.length !== 1) {
            kwinClient.desktops = [Workspace.currentDesktop];
        }
        if (kwinClient.activities.length !== 1) {
            kwinClient.activities = [Workspace.currentActivity];
        }
    }

    export function getKwinDesktopApprox(kwinClient: KwinClient) {
        switch (kwinClient.desktops.length) {
            case 0:
                return Workspace.currentDesktop;
            case 1:
                return kwinClient.desktops[0];
            default:
                if (kwinClient.desktops.includes(Workspace.currentDesktop)) {
                    return Workspace.currentDesktop;
                } else {
                    return kwinClient.desktops[0];
                }
        }
    }

    export function isFullScreenGeometry(kwinClient: KwinClient) {
        const fullScreenArea = Workspace.clientArea(ClientAreaOption.FullScreenArea, kwinClient.output, getKwinDesktopApprox(kwinClient));
        return rectEquals(kwinClient.frameGeometry, fullScreenArea);
    }

    export function isOnVirtualDesktop(kwinClient: KwinClient, kwinDesktop: KwinDesktop) {
        return kwinClient.desktops.length === 0 || kwinClient.desktops.includes(kwinDesktop);
    }

    export function isOnOneOfVirtualDesktops(kwinClient: KwinClient, kwinDesktops: KwinDesktop[]) {
        return kwinClient.desktops.length === 0 || kwinClient.desktops.some(d => kwinDesktops.includes(d));
    }
}
