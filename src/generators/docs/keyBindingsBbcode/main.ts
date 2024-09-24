console.log(`[list]`);

for (const binding of keyBindings) {
    console.log(`    [*] ${binding.keySequence} — ${binding.description}`);
}

console.log(`[/list]`);
