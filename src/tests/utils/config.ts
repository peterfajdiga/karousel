function getDefaultConfig(): Config {
    const config: any = {};
    for (const prop of configDef) {
        config[prop.name] = prop.default;
    }
    return config;
}
