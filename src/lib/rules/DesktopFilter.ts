class DesktopFilter {
    private readonly allowedDesktops: Set<string> | null; // null means all desktops

    constructor(desktopsConfig: string) {
        this.allowedDesktops = DesktopFilter.parseDesktopConfig(desktopsConfig);
    }

    public shouldWorkOnDesktop(kwinDesktop: KwinDesktop): boolean {
        if (this.allowedDesktops === null) {
            return true; // Work on all desktops
        }
        return this.allowedDesktops.has(kwinDesktop.name);
    }

    private static parseDesktopConfig(config: string): Set<string> | null {
        const lines = config.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        if (lines.length === 0) {
            return null; // No config means work on all desktops
        }

        if (lines.length === 1 && lines[0] === '*') {
            return null; // Single '*' means work on all desktops
        }

        // Multiple lines or single non-'*' line means specific desktops
        return new Set(lines);
    }
}
