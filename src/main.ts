function init() {
    const world = new World(workspace.desktops);
    registerShortcuts(world);
    return world;
}
