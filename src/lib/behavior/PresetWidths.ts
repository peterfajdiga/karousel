class PresetWidths {
    private readonly presets: ((maxWidth: number) => number)[];

    constructor(presetWidths: string, spacing: number) {
        this.presets = PresetWidths.parsePresetWidths(presetWidths, spacing);
    }

    public next(currentWidth: number, minWidth: number, maxWidth: number) {
        const widths = this.getWidths(minWidth, maxWidth);
        const nextIndex = widths.findIndex(width => width > currentWidth);
        return nextIndex >= 0 ? widths[nextIndex] : widths[0];
    }

    public prev(currentWidth: number, minWidth: number, maxWidth: number) {
        const widths = this.getWidths(minWidth, maxWidth).reverse();
        const nextIndex = widths.findIndex(width => width < currentWidth);
        return nextIndex >= 0 ? widths[nextIndex] : widths[0];
    }

    public getWidths(minWidth: number, maxWidth: number) {
        const widths = this.presets.map(f => clamp(f(maxWidth), minWidth, maxWidth));
        widths.sort((a, b) => a - b);
        return uniq(widths);
    }

    private static parsePresetWidths(presetWidths: string, spacing: number): ((maxWidth: number) => number)[] {
        function getRatioFunction(ratio: number) {
            return (maxWidth: number) => Math.floor((maxWidth + spacing) * ratio - spacing);
        }

        return presetWidths.split(",").map((widthStr: string) => {
            widthStr = widthStr.trim();

            const widthPx = PresetWidths.parseNumberWithSuffix(widthStr, "px");
            if (widthPx !== undefined) {
                return () => widthPx;
            }

            const widthPct = PresetWidths.parseNumberWithSuffix(widthStr, "%");
            if (widthPct !== undefined) {
                return getRatioFunction(widthPct / 100.0);
            }

            return getRatioFunction(PresetWidths.parseNumberSafe(widthStr));
        });
    }

    private static parseNumberSafe(str: string) {
        const num = Number(str);
        if (isNaN(num) || num <= 0) {
            throw new Error("Invalid number: " + str);
        }
        return num;
    }

    private static parseNumberWithSuffix(str: string, suffix: string) {
        if (!str.endsWith(suffix)) {
            return undefined;
        }
        return PresetWidths.parseNumberSafe(str.substring(0, str.length-suffix.length).trim());
    }
}
