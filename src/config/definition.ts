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
        "class": "kfind",
        "tile": true
    },
    {
        "class": "kruler",
        "tile": false
    },
    {
        "class": "zoom",
        "caption": "Zoom Cloud Meetings",
        "tile": false
    },
    {
        "class": "zoom",
        "caption": "zoom",
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
        "name": "gapsOuterTop",
        "type": "UInt",
        "default": 18
    },
    {
        "name": "gapsOuterBottom",
        "type": "UInt",
        "default": 18
    },
    {
        "name": "gapsOuterLeft",
        "type": "UInt",
        "default": 18
    },
    {
        "name": "gapsOuterRight",
        "type": "UInt",
        "default": 18
    },
    {
        "name": "gapsInnerHorizontal",
        "type": "UInt",
        "default": 18
    },
    {
        "name": "gapsInnerVertical",
        "type": "UInt",
        "default": 18
    },
    {
        "name": "overscroll",
        "type": "UInt",
        "default": 18
    },
    {
        "name": "manualScrollStep",
        "type": "UInt",
        "default": 200
    },
    {
        "name": "stackColumnsByDefault",
        "type": "Bool",
        "default": false
    },
    {
        "name": "resizeNeighborColumn",
        "type": "Bool",
        "default": false
    },
    {
        "name": "windowRules",
        "type": "String",
        "default": defaultWindowRules
    }
];
