const defaultWindowRules = `[
    {
        "class": "(org\\\\.kde\\\\.)?plasmashell",
        "tile": false
    },
    {
        "class": "(org\\\\.kde\\\\.)?polkit-kde-authentication-agent-1",
        "tile": false
    },
    {
        "class": "(org\\\\.kde\\\\.)?kded6",
        "tile": false
    },
    {
        "class": "(org\\\\.kde\\\\.)?kcalc",
        "tile": false
    },
    {
        "class": "(org\\\\.kde\\\\.)?kfind",
        "tile": true
    },
    {
        "class": "(org\\\\.kde\\\\.)?kruler",
        "tile": false
    },
    {
        "class": "(org\\\\.kde\\\\.)?krunner",
        "tile": false
    },
    {
        "class": "(org\\\\.kde\\\\.)?yakuake",
        "tile": false
    },
    {
        "class": "steam",
        "caption": "Steam Big Picture Mode",
        "tile": false
    },
    {
        "class": "zoom",
        "caption": "Zoom Cloud Meetings|zoom|zoom <2>",
        "tile": false
    },
    {
        "class": "jetbrains-.*",
        "caption": "splash",
        "tile": false
    },
    {
        "class": "jetbrains-.*",
        "caption": "Unstash Changes|Paths Affected by stash@.*",
        "tile": true
    }
]`;

const configDef = [
    {
        name: "gapsOuterTop",
        type: "UInt",
        default: 16,
    },
    {
        name: "gapsOuterBottom",
        type: "UInt",
        default: 16,
    },
    {
        name: "gapsOuterLeft",
        type: "UInt",
        default: 16,
    },
    {
        name: "gapsOuterRight",
        type: "UInt",
        default: 16,
    },
    {
        name: "gapsInnerHorizontal",
        type: "UInt",
        default: 8,
    },
    {
        name: "gapsInnerVertical",
        type: "UInt",
        default: 8,
    },
    {
        name: "stackOffsetX",
        type: "UInt",
        default: 8,
    },
    {
        name: "stackOffsetY",
        type: "UInt",
        default: 32,
    },
    {
        name: "manualScrollStep",
        type: "UInt",
        default: 200,
    },
    {
        name: "presetWidths",
        type: "String",
        default: "50%, 100%",
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
        name: "naturalScrolling",
        type: "Bool",
        default: true,
    },
    {
        name: "floatingKeepAbove",
        type: "Bool",
        default: false,
    },
    {
        name: "noLayering",
        type: "Bool",
        default: false,
    },
    {
        name: "windowRules",
        type: "String",
        default: defaultWindowRules,
    }
];
