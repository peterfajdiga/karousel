tests.register("DesktopFilter", 1, () => {
    const desktop1 = { __brand: "KwinDesktop" as const, id: "1", name: "Desktop 1" };
    const desktop2 = { __brand: "KwinDesktop" as const, id: "2", name: "Work" };
    const desktop3 = { __brand: "KwinDesktop" as const, id: "3", name: "Desktop 2" };

    // Test 1: Empty config means all desktops
    let filter = new DesktopFilter("");
    Assert.assert(filter.shouldWorkOnDesktop(desktop1), { message: "Empty config should work on desktop1" });
    Assert.assert(filter.shouldWorkOnDesktop(desktop2), { message: "Empty config should work on desktop2" });

    // Test 2: Whitespace only means all desktops
    filter = new DesktopFilter("  \n  \n  ");
    Assert.assert(filter.shouldWorkOnDesktop(desktop1), { message: "Whitespace only should work on desktop1" });
    Assert.assert(filter.shouldWorkOnDesktop(desktop2), { message: "Whitespace only should work on desktop2" });

    // Test 3: Match all regex pattern
    filter = new DesktopFilter(".*");
    Assert.assert(filter.shouldWorkOnDesktop(desktop1), { message: "Regex '.*' should work on desktop1" });
    Assert.assert(filter.shouldWorkOnDesktop(desktop2), { message: "Regex '.*' should work on desktop2" });

    // Test 4: Partial match without anchors
    filter = new DesktopFilter("Work");
    Assert.assert(!filter.shouldWorkOnDesktop(desktop1), { message: "Should not work on desktop1" });
    Assert.assert(filter.shouldWorkOnDesktop(desktop2), { message: "Should work on desktop2 containing 'Work'" });

    // Test 5: Regex alternation for multiple desktops
    filter = new DesktopFilter("Desktop 1|Work");
    Assert.assert(filter.shouldWorkOnDesktop(desktop1), { message: "Should work on desktop1" });
    Assert.assert(filter.shouldWorkOnDesktop(desktop2), { message: "Should work on desktop2" });
    Assert.assert(!filter.shouldWorkOnDesktop(desktop3), { message: "Should not work on desktop3" });

    // Test 6: Regex pattern with character class
    filter = new DesktopFilter("Desktop [12]");
    Assert.assert(filter.shouldWorkOnDesktop(desktop1), { message: "Should work on desktop1" });
    Assert.assert(!filter.shouldWorkOnDesktop(desktop2), { message: "Should not work on desktop2" });
    Assert.assert(filter.shouldWorkOnDesktop(desktop3), { message: "Should work on desktop3" });

    // Test 7: Case-sensitive matching
    filter = new DesktopFilter("work");
    Assert.assert(!filter.shouldWorkOnDesktop(desktop2), { message: "Should not work on desktop2 (case mismatch)" });
});
