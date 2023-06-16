for (const binding of keyBindings) {
    console.log(`${binding.defaultKeySequence} - ${binding.description}`);
}

for (const binding of numKeyBindings) {
    const numPrefix = binding.fKeys ? "F" : "";
    console.log(`${binding.defaultModifiers}+${numPrefix}[N] - ${binding.description}N`);
}
