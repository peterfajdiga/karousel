console.log(`[list]`);

for (const binding of keyBindings) {
    console.log(`    [*] ${binding.defaultKeySequence} — ${binding.description}${formatComment(binding.comment)}`);
}

for (const binding of numKeyBindings) {
    const numPrefix = binding.fKeys ? "F" : "";
    console.log(`    [*] ${binding.defaultModifiers}+${numPrefix}[N] — ${binding.description}N${formatComment(binding.comment)}`);
}

console.log(`[/list]`);
