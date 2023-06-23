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
    ...keyBindings.map((binding: KeyBinding) => `${binding.description}${formatComment(binding.comment)}`),
    ...numKeyBindings.map((binding: NumKeyBinding) => `${binding.description}N${formatComment(binding.comment)}`),
];

printCols("| ", colLeft, " | ", colRight, " |");
