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
