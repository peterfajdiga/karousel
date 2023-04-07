const GAPS_OUTER = { top: 18, bottom: 18, left: 18, right: 18 };
const GAPS_INNER = { x: 18, y: 18 };
const AUTO_OVERSCROLL_X = 18;
const GRID_SCROLL_STEP = 200;
const STACKED_BY_DEFAULT = false;
const PREFER_FLOATING = new Map(Object.entries({
    "ksmserver-logout-greeter": new RegExp(""),
    "kcalc": new RegExp(""),
    "kruler": new RegExp(""),
    "zoom": new RegExp("^(Zoom Cloud Meetings|zoom)$"),
    "jetbrains-idea": new RegExp("^splash$"),
    "jetbrains-studio": new RegExp("^splash$"),
}));
const PREFER_TILING = new Map(Object.entries({
    "kfind": new RegExp(""),
    "jetbrains-idea": new RegExp("^(Unstash Changes|Paths Affected by stash@.*)$"),
    "jetbrains-studio": new RegExp("^(Unstash Changes|Paths Affected by stash@.*)$"),
}));
