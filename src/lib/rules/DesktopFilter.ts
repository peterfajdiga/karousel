class DesktopFilter {
    private readonly desktopRegex: RegExp | null; // null means all desktops

    constructor(desktopsConfig: string) {
        this.desktopRegex = DesktopFilter.parseDesktopConfig(desktopsConfig);
    }

    public shouldWorkOnDesktop(kwinDesktop: KwinDesktop): boolean {
        if (this.desktopRegex === null) {
            return true; // Work on all desktops
        }
        return this.desktopRegex.test(kwinDesktop.name);
    }

    private static parseDesktopConfig(config: string): RegExp | null {
        const trimmed = config.trim();

        if (trimmed.length === 0) {
            return null; // Empty config means work on all desktops
        }

        try {
            return new RegExp(`^${trimmed}$`);
        } catch (e) {
            log(`Invalid regex pattern in tiledDesktops config: ${trimmed}. Working on all desktops.`);
            return null; // Invalid regex means work on all desktops as fallback
        }
    }
}
