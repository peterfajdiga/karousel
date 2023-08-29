class ClientMatcher {
    private readonly rules: Map<string, RegExp>;

    constructor(rules: Map<string, RegExp>) {
        this.rules = rules;
    }

    public matches(kwinClient: AbstractClient) {
        const rule = this.rules.get(kwinClient.resourceClass);
        if (rule === undefined) {
            return false;
        }
        return rule.test(kwinClient.caption);
    }
}
