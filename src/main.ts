function init() {
    const config = loadConfig();
    const world = new World(config);
    registerShortcuts(world);
    return world;
}
