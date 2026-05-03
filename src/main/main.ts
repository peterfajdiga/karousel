function init() {
    return new World(loadConfig());
}

function loadConfig(): Config {
    const config: any = {};
    for (const entry of configDef) {
        config[entry.name] = KWin.readConfig(entry.name, entry.default);
    }

    try {
        config.enabledScreens = JSON.parse(config.enabledScreens || "[0,1,2]");
    } catch (e) {
        config.enabledScreens = [0,1,2];
    }

    return config;
}
