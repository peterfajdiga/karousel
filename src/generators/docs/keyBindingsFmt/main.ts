const colLeft = [
    ...keyBindings.map((binding: KeyBinding) => binding.defaultKeySequence),
    ...numKeyBindings.map((binding: NumKeyBinding) => {
        const numPrefix = binding.fKeys ? "F" : "";
        return `${binding.defaultModifiers}+${numPrefix}[N]`;
    }),
];

const colRight = [
    ...keyBindings.map(formatDescription),
    ...numKeyBindings.map(formatDescription),
];

printCols(colLeft, " ", colRight);
