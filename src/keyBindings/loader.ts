type KeyBinding = {
    name: string;
    description: string;
    comment?: string;
    defaultKeySequence: string;
};

type NumKeyBinding = {
    name: string;
    description: string;
    comment?: string;
    defaultModifiers: string;
    fKeys: boolean;
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

function registerKeyBinding(world: World, config: Actions.Config, shortcutActions: ShortcutAction[], keyBinding: KeyBinding) {
    shortcutActions.push(new ShortcutAction(
        keyBinding,
        catchWrap(Actions.getAction(world, config, keyBinding.name)),
    ));
}

function registerNumKeyBindings(world: World, shortcutActions: ShortcutAction[], numKeyBinding: NumKeyBinding) {
    const numPrefix = numKeyBinding.fKeys ? "F" : "";
    const n = numKeyBinding.fKeys ? 12 : 9;
    for (let i = 0; i < 12; i++) {
        const numKey = String(i + 1);
        const keySequence = i < n ?
            numKeyBinding.defaultModifiers + "+" + numPrefix + numKey :
            "";
        const action = Actions.getNumAction(world, numKeyBinding.name);
        shortcutActions.push(new ShortcutAction(
            {
                name: numKeyBinding.name + numKey,
                description: numKeyBinding.description + numKey,
                defaultKeySequence: keySequence,
            },
            catchWrap(() => action(i)),
        ));
    }
}

function registerKeyBindings(world: World, config: Actions.Config) {
    const shortcutActions: ShortcutAction[] = [];

    for (const keyBinding of keyBindings) {
        registerKeyBinding(world, config, shortcutActions, keyBinding);
    }

    for (const numKeyBinding of numKeyBindings) {
        registerNumKeyBindings(world, shortcutActions, numKeyBinding);
    }

    return shortcutActions;
}
