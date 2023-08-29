type KeyBinding = {
    name: string;
    description: string;
    comment?: string;
    defaultKeySequence: string;
    action: keyof ReturnType<typeof Actions.init>;
}

type NumKeyBinding = {
    name: string;
    description: string;
    comment?: string;
    defaultModifiers: string;
    fKeys: boolean;
    action: keyof ReturnType<typeof Actions.initNum>;
}

function catchWrap(f: () => void) {
    return () => {
        try {
            f();
        } catch (error: any) {
            console.log(error);
            console.log(error.stack);
        }
    };
}

function registerKeyBinding(name: string, description: string, keySequence: string, callback: () => void) {
    KWin.registerShortcut(
        "karousel-" + name,
        "Karousel: " + description,
        keySequence,
        catchWrap(callback),
    );
}

function registerNumKeyBindings(name: string, description: string, modifiers: string, fKeys: boolean, callback: (i: number) => void) {
    const numPrefix = fKeys ? "F" : "";
    const n = fKeys ? 12 : 9;
    for (let i = 0; i < n; i++) {
        const numKey = String(i + 1);
        registerKeyBinding(
            name + numKey,
            description + numKey,
            modifiers + "+" + numPrefix + numKey,
            () => callback(i),
        );
    }
}

function registerKeyBindings(world: World, config: Config) {
    const actions = Actions.init(world, config);
    for (const binding of keyBindings) {
        registerKeyBinding(binding.name, binding.description, binding.defaultKeySequence, actions[binding.action]);
    }

    const numActions = Actions.initNum(world);
    for (const binding of numKeyBindings) {
        registerNumKeyBindings(binding.name, binding.description, binding.defaultModifiers, binding.fKeys, numActions[binding.action]);
    }
}
