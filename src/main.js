function init() {
    connectToWorkspaceSignals();
    registerShortcuts();
}

let world = new World(workspace.desktops);
init();
