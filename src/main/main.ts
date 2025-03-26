function init() {
    return new World(loadConfig(), moveToFocus);
}

function loadConfig(): Config {
    const config: any = {};
    for (const entry of configDef) {
        config[entry.name] = KWin.readConfig(entry.name, entry.default);
    }
    return config;
}
