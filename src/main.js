function init() {
    connectToWorkspaceSignals();
    registerShortcuts();
}

function uninit() {
    disconnectFromWorkspaceSignals();
    world.removeAllClients();
}

const world = new World(workspace.desktops);
