const defaultWindowRules = `[
    {
        "class": "ksmserver-logout-greeter",
        "tile": false
    },
    {
        "class": "kcalc",
        "tile": false
    },
    {
        "class": "org.kde.kcalc",
        "tile": false
    },
    {
        "class": "kfind",
        "tile": true
    },
    {
        "class": "org.kde.kfind",
        "tile": true
    },
    {
        "class": "kruler",
        "tile": false
    },
    {
        "class": "org.kde.kruler",
        "tile": false
    },
    {
        "class": "krunner",
        "tile": false
    },
    {
        "class": "org.kde.krunner",
        "tile": false
    },
    {
        "class": "yakuake",
        "tile": false
    },
    {
        "class": "org.kde.yakuake",
        "tile": false
    },
    {
        "class": "zoom",
        "caption": "Zoom Cloud Meetings|zoom|zoom <2>",
        "tile": false
    },
    {
        "class": "jetbrains-idea",
        "caption": "splash",
        "tile": false
    },
    {
        "class": "jetbrains-studio",
        "caption": "splash",
        "tile": false
    },
    {
        "class": "jetbrains-idea",
        "caption": "Unstash Changes|Paths Affected by stash@.*",
        "tile": true
    },
    {
        "class": "jetbrains-studio",
        "caption": "Unstash Changes|Paths Affected by stash@.*",
        "tile": true
    }
]`;

const configDef = [
    {
        name: "gapsOuterTop",
        type: "UInt",
        default: 18,
    },
    {
        name: "gapsOuterBottom",
        type: "UInt",
        default: 18,
    },
    {
        name: "gapsOuterLeft",
        type: "UInt",
        default: 18,
    },
    {
        name: "gapsOuterRight",
        type: "UInt",
        default: 18,
    },
    {
        name: "gapsInnerHorizontal",
        type: "UInt",
        default: 18,
    },
    {
        name: "gapsInnerVertical",
        type: "UInt",
        default: 18,
    },
    {
        name: "manualScrollStep",
        type: "UInt",
        default: 200,
    },
    {
        name: "manualResizeStep",
        type: "UInt",
        default: 600,
    },
    {
        name: "offScreenOpacity",
        type: "UInt",
        default: 100,
    },
    {
        name: "untileOnDrag",
        type: "Bool",
        default: true,
    },
    {
        name: "stackColumnsByDefault",
        type: "Bool",
        default: false,
    },
    {
        name: "resizeNeighborColumn",
        type: "Bool",
        default: false,
    },
    {
        name: "reMaximize",
        type: "Bool",
        default: false,
    },
    {
        name: "skipSwitcher",
        type: "Bool",
        default: false,
    },
    {
        name: "scrollingLazy",
        type: "Bool",
        default: true,
    },
    {
        name: "scrollingCentered",
        type: "Bool",
        default: false,
    },
    {
        name: "scrollingGrouped",
        type: "Bool",
        default: false,
    },
    {
        name: "tiledKeepBelow",
        type: "Bool",
        default: true,
    },
    {
        name: "floatingKeepAbove",
        type: "Bool",
        default: false,
    },
    {
        name: "windowRules",
        type: "String",
        default: defaultWindowRules,
    }
];
