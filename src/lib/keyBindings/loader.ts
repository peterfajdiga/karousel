type KeyBinding = {
    name: keyof Actions.Actions;
    description: string;
    comment?: string;
    defaultKeySequence: string;
};

type NumKeyBinding = {
    name: keyof Actions.NumActions;
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

function registerKeyBinding(actionGetter: Actions.Getter, shortcutActions: ShortcutAction[], keyBinding: KeyBinding) {
    shortcutActions.push(new ShortcutAction(
        keyBinding,
        catchWrap(actionGetter.getAction(keyBinding.name)),
    ));
}

function registerNumKeyBindings(actionGetter: Actions.Getter, shortcutActions: ShortcutAction[], numKeyBinding: NumKeyBinding) {
    const numPrefix = numKeyBinding.fKeys ? "F" : "";
    const n = numKeyBinding.fKeys ? 12 : 9;
    for (let i = 0; i < 12; i++) {
        const numKey = String(i + 1);
        const keySequence = i < n ?
            numKeyBinding.defaultModifiers + "+" + numPrefix + numKey :
            "";
        const action = actionGetter.getNumAction(numKeyBinding.name);
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
    const actionGetter = new Actions.Getter(world, config);
    const shortcutActions: ShortcutAction[] = [];

    for (const keyBinding of keyBindings) {
        registerKeyBinding(actionGetter, shortcutActions, keyBinding);
    }

    for (const numKeyBinding of numKeyBindings) {
        registerNumKeyBindings(actionGetter, shortcutActions, numKeyBinding);
    }

    return shortcutActions;
}
