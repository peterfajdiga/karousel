type PresetWidth = ((screenWidth: number, spacing: number) => number);

function parsePresetWidths(presetWidths: string): PresetWidth[] {
    function parseNumberSafe(str: string) {
        const num = Number(str);
        if (isNaN(num) || num <= 0) {
            throw new Error("Invalid number: " + str);
        }
        return num;
    }

    function parseNumberWithSuffix(str: string, suffix: string) {
        if (!str.endsWith(suffix)) {
            return undefined;
        }
        return parseNumberSafe(str.substring(0, str.length-suffix.length).trim());
    }

    function getRatioFunction(ratio: number) {
        return (screenWidth: number, spacing: number) => Math.floor((screenWidth + spacing) * ratio - spacing);
    }

    return presetWidths.split(",").map((widthStr: string) => {
        widthStr = widthStr.trim();

        const widthPx = parseNumberWithSuffix(widthStr, "px");
        if (widthPx !== undefined) {
            return () => widthPx;
        }

        const widthPct = parseNumberWithSuffix(widthStr, "%");
        if (widthPct !== undefined) {
            return getRatioFunction(widthPct / 100.0);
        }

        return getRatioFunction(parseNumberSafe(widthStr));
    });
}
