const colLeft = [
    "Shortcut",
    "---",
    ...keyBindings.map((binding: KeyBinding) => binding.defaultKeySequence),
    ...numKeyBindings.map((binding: NumKeyBinding) => {
        const numPrefix = binding.fKeys ? "F" : "";
        return `${binding.defaultModifiers}+${numPrefix}[N]`;
    }),
];

const colRight = [
    "Action",
    "---",
    ...keyBindings.map((binding: KeyBinding) => `${formatDescription(binding)}`),
    ...numKeyBindings.map((binding: NumKeyBinding) => `${formatDescription(binding)}`),
];

printCols("| ", colLeft, " | ", colRight, " |");
