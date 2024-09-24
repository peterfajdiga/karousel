const colLeft = [
    "Shortcut",
    "---",
    ...keyBindings.map(binding => binding.keySequence),
];

const colRight = [
    "Action",
    "---",
    ...keyBindings.map(binding => binding.description),
];

printCols("| ", colLeft, " | ", colRight, " |");
