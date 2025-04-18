interface Config {
    gapsOuterTop: number;
    gapsOuterBottom: number;
    gapsOuterLeft: number;
    gapsOuterRight: number;
    gapsInnerHorizontal: number;
    gapsInnerVertical: number;
    stackOffsetX: number;
    stackOffsetY: number;
    manualScrollStep: number;
    presetWidths: string;
    offScreenOpacity: number;
    untileOnDrag: boolean;
    cursorFollowsFocus: boolean;
    stackColumnsByDefault: boolean;
    resizeNeighborColumn: boolean;
    reMaximize: boolean;
    skipSwitcher: boolean;
    scrollingLazy: boolean;
    scrollingCentered: boolean;
    scrollingGrouped: boolean;
    gestureScroll: boolean;
    gestureScrollInvert: boolean;
    gestureScrollStep: number;
    tiledKeepBelow: boolean;
    floatingKeepAbove: boolean;
    windowRules: string;
}
