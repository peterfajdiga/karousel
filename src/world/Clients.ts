namespace Clients {
    export function canTileEver(kwinClient: AbstractClient) {
        return kwinClient.resizeable;
    }

    export function canTileNow(kwinClient: TopLevel) {
        return canTileEver(kwinClient) && !kwinClient.minimized && kwinClient.desktop > 0 && kwinClient.activities.length === 1;
    }

    export function makeTileable(kwinClient: TopLevel) {
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

    export function isMaximizedGeometry(kwinClient: TopLevel) {
        const maximizeArea = workspace.clientArea(ClientAreaOption.MaximizeArea, kwinClient.screen, kwinClient.desktop);
        return kwinClient.frameGeometry === maximizeArea;
    }

    export function isFullScreenGeometry(kwinClient: TopLevel) {
        const fullScreenArea = workspace.clientArea(ClientAreaOption.FullScreenArea, kwinClient.screen, kwinClient.desktop);
        return kwinClient.frameGeometry === fullScreenArea;
    }
}
