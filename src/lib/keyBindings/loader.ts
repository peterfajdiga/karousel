type KeyBinding = {
    name: string;
    description: string;
    comment?: string;
    defaultKeySequence: string;
    action: () => void;
};

type NumKeyBinding = {
    name: string;
    description: string;
    comment?: string;
    defaultModifiers: string;
    fKeys: boolean;
    action: (i: number) => void;
};

function catchWrap(f: () => void) {
    return () => {
        try {
            f();
        } catch (error: any) {
            log(error);
            log(error.stack);
        }
    };
}

function registerKeyBinding(shortcutActions: ShortcutAction[], keyBinding: KeyBinding) {
    shortcutActions.push(new ShortcutAction(
        keyBinding,
        catchWrap(keyBinding.action),
    ));
}

function registerNumKeyBindings(shortcutActions: ShortcutAction[], numKeyBinding: NumKeyBinding) {
    const numPrefix = numKeyBinding.fKeys ? "F" : "";
    const n = numKeyBinding.fKeys ? 12 : 9;
    for (let i = 0; i < 12; i++) {
        const numKey = String(i + 1);
        const keySequence = i < n ?
            numKeyBinding.defaultModifiers + "+" + numPrefix + numKey :
            "";
        shortcutActions.push(new ShortcutAction(
            {
                name: applyMacro(numKeyBinding.name, numKey),
                description: applyMacro(numKeyBinding.description, numKey),
                defaultKeySequence: keySequence,
            },
            catchWrap(() => numKeyBinding.action(i)),
        ));
    }
}

function registerKeyBindings(world: World, config: Actions.Config) {
    const actions = new Actions(config);
    const shortcutActions: ShortcutAction[] = [];

    for (const keyBinding of getKeyBindings(world, actions)) {
        registerKeyBinding(shortcutActions, keyBinding);
    }

    for (const numKeyBinding of getNumKeyBindings(world, actions)) {
        registerNumKeyBindings(shortcutActions, numKeyBinding);
    }

    return shortcutActions;
}
