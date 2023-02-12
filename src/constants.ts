const GAPS_OUTER = { top: 12, bottom: 12, left: 12, right: 12 };
const GAPS_INNER = { x: 12, y: 12 };
const AUTO_OVERSCROLL_X = 12;
const GRID_SCROLL_STEP = 200;
const STACKED_BY_DEFAULT = false;
const PREFER_FLOATING = new ClientMatcher(new Map(Object.entries({
    "ksmserver-logout-greeter": new RegExp(".*"),
    "kcalc": new RegExp(".*"),
    "kruler": new RegExp(".*"),
    "zoom": new RegExp("^(Zoom Cloud Meetings|zoom)$"),
    "jetbrains-idea": new RegExp("splash"),
})));
const PREFER_TILING = new ClientMatcher(new Map(Object.entries({
    "kfind": new RegExp(".*"),
    "jetbrains-idea": new RegExp("Unstash Changes|Paths Affected by stash@.*"),
})));
