class ClientMatcher {
    private rules: Map<string, RegExp>;

    constructor(rules: Map<string, RegExp>) {
        this.rules = rules;
    }

    matches(client: AbstractClient) {
        const rule = this.rules.get(String(client.resourceClass));
        if (rule === undefined) {
            return false;
        }
        return rule.test(client.caption);
    }
}
