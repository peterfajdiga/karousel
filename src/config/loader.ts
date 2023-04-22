function loadConfig() {
    const config: any = {};
    for (const entry of configDef) {
        config[entry.name] = KWin.readConfig(entry.name, entry.default);
    }
    options.configChanged.connect(() => {
        console.log("config changed"); // TODO
    });
    return config;
}
