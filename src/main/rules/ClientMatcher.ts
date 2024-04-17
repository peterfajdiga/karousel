class ClientMatcher {
    private readonly regex: RegExp;

    constructor(regex: RegExp) {
        this.regex = regex;
    }

    public matches(kwinClient: KwinClient) {
        return this.regex.test(ClientMatcher.getClientString(kwinClient));
    }

    public static getClientString(kwinClient: KwinClient) {
        return ClientMatcher.getRuleString(kwinClient.resourceClass, kwinClient.caption);
    }

    public static getRuleString(ruleClass: string, ruleCaption: string) {
        return ruleClass + "\0" + ruleCaption;
    }
}
