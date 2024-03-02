namespace Clients {
    export function canTileEver(kwinClient: KwinClient) {
        return kwinClient.resizeable;
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

    export function isMaximizedGeometry(kwinClient: KwinClient) {
        const maximizeArea = Workspace.clientArea(ClientAreaOption.MaximizeArea, kwinClient.screen, 0); // TODO: pass desktop
        return kwinClient.frameGeometry === maximizeArea;
    }

    export function isFullScreenGeometry(kwinClient: KwinClient) {
        const fullScreenArea = Workspace.clientArea(ClientAreaOption.FullScreenArea, kwinClient.screen, 0); // TODO: pass desktop
        return kwinClient.frameGeometry === fullScreenArea;
    }

    export function isOnVirtualDesktop(kwinClient: KwinClient, kwinDesktop: KwinDesktop) {
        return kwinClient.desktops.length === 0 || kwinClient.desktops.includes(kwinDesktop); // TODO: is empty = all desktops?
    }

    export function isOnOneOfVirtualDesktops(kwinClient: KwinClient, kwinDesktops: KwinDesktop[]) {
        return kwinClient.desktops.length === 0 || kwinClient.desktops.some(d => kwinDesktops.includes(d)); // TODO: is empty = all desktops?
    }
}
