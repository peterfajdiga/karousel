function canTile(kwinClient: AbstractClient) {
    // TODO: support windows on all desktops
    return !kwinClient.minimized && kwinClient.desktop > 0;
}

function shouldTile(kwinClient: AbstractClient) {
    return canTile(kwinClient) && kwinClient.normalWindow && kwinClient.managed && !PREFER_FLOATING.matches(kwinClient);
}
