function init() {
    return new World(loadConfig());
}

function loadConfig(): Config {
    const config: any = {};
    for (const entry of configDef) {
        config[entry.name] = KWin.readConfig(entry.name, entry.default);
    }

    const enabledStr = KWin.readConfig("enabledScreens", "-1");
    if (enabledStr === "-1") {
        config.enabledScreens = [-1];
    } else {
        config.enabledScreens = enabledStr.split(",").map((s: string) => parseInt(s.trim())).filter((n: number) => !isNaN(n));
    }

    return config;
}
