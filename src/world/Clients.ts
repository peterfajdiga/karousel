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
}
