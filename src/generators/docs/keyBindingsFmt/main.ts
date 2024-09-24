const colLeft = [
    ...keyBindings.map(binding => binding.keySequence),
];

const colRight = [
    ...keyBindings.map(binding => binding.description),
];

printCols(colLeft, " ", colRight);
