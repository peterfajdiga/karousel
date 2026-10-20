function init() {
    try {
        return new World(loadConfig());
    } catch (error: any) {
        log("init failed:", error);
        log(error.stack);
        throw error;
    }
}

function loadConfig(): Config {
    const config: any = {};
    for (const entry of configDef) {
        config[entry.name] = KWin.readConfig(entry.name, entry.default);
    }
    return config;
}
