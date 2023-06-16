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

function registerNumKeyBindings(name: string, description: string, keySequence: string, callback: (i: number) => void, n: number) {
    for (let i = 0; i < n; i++) {
        const numKey = String(i + 1);
        registerKeyBinding(
            name + numKey,
            description + numKey,
            keySequence + numKey,
            () => callback(i),
        );
    }
}

function registerKeyBindings(world: World) {
    const actions = initActions(world);
    for (const binding of keyBindings) {
        if (binding.repeat === undefined) {
            const action = <() => void> actions[binding.action];
            registerKeyBinding(binding.name, binding.description, binding.defaultKeySequence, action);
        } else {
            const action = <(n: number) => void> actions[binding.action];
            registerNumKeyBindings(binding.name, binding.description, binding.defaultKeySequence, action, binding.repeat);
        }
    }
}
