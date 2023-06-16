function init() {
    const config = loadConfig();
    const world = new World(config);
    registerKeyBindings(world);
    return world;
}
