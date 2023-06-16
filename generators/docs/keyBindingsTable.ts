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
    ...keyBindings.map((binding: KeyBinding) => binding.description),
    ...numKeyBindings.map((binding: NumKeyBinding) => binding.description + "N"),
];

printCols("| ", colLeft, " | ", colRight, " |");
