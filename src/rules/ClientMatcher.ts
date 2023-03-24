class ClientMatcher {
    private rules: Map<string, RegExp>;

    constructor(rules: Map<string, RegExp>) {
        this.rules = rules;
    }

    matches(kwinClient: AbstractClient) {
        const rule = this.rules.get(String(kwinClient.resourceClass));
        if (rule === undefined) {
            return false;
        }
        return rule.test(kwinClient.caption);
    }
}
