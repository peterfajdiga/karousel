console.log(`[list]`);

for (const binding of keyBindings) {
    console.log(`    [*] ${binding.defaultKeySequence} — ${formatDescription(binding)}`);
}

for (const binding of numKeyBindings) {
    const numPrefix = binding.fKeys ? "F" : "";
    console.log(`    [*] ${binding.defaultModifiers}+${numPrefix}[N] — ${formatDescription(binding)}`);
}

console.log(`[/list]`);
