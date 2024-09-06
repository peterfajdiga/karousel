function applyMacro(base: string, value: string) {
    return base.replace("{}", String(value));
}
