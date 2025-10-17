function testDesktopFilter() {
    // Test 1: Single '*' means all desktops
    let filter = new DesktopFilter("*");
    const desktop1 = { __brand: "KwinDesktop" as const, id: "1", name: "Desktop 1" };
    const desktop2 = { __brand: "KwinDesktop" as const, id: "2", name: "Work" };
    Assert.assert(filter.shouldWorkOnDesktop(desktop1), { message: "Single '*' should work on desktop1" });
    Assert.assert(filter.shouldWorkOnDesktop(desktop2), { message: "Single '*' should work on desktop2" });

    // Test 2: Empty config means all desktops
    filter = new DesktopFilter("");
    Assert.assert(filter.shouldWorkOnDesktop(desktop1), { message: "Empty config should work on desktop1" });
    Assert.assert(filter.shouldWorkOnDesktop(desktop2), { message: "Empty config should work on desktop2" });

    // Test 3: Whitespace only means all desktops
    filter = new DesktopFilter("  \n  \n  ");
    Assert.assert(filter.shouldWorkOnDesktop(desktop1), { message: "Whitespace only should work on desktop1" });
    Assert.assert(filter.shouldWorkOnDesktop(desktop2), { message: "Whitespace only should work on desktop2" });

    // Test 4: Single specific desktop name
    filter = new DesktopFilter("Work");
    Assert.assert(!filter.shouldWorkOnDesktop(desktop1), { message: "Should not work on desktop1" });
    Assert.assert(filter.shouldWorkOnDesktop(desktop2), { message: "Should work on desktop2 named 'Work'" });

    // Test 5: Multiple desktop names
    filter = new DesktopFilter("Desktop 1\nWork");
    Assert.assert(filter.shouldWorkOnDesktop(desktop1), { message: "Should work on desktop1" });
    Assert.assert(filter.shouldWorkOnDesktop(desktop2), { message: "Should work on desktop2" });

    // Test 6: Multiple desktop names with some not matching
    filter = new DesktopFilter("Desktop 1\nHome");
    Assert.assert(filter.shouldWorkOnDesktop(desktop1), { message: "Should work on desktop1" });
    Assert.assert(!filter.shouldWorkOnDesktop(desktop2), { message: "Should not work on desktop2" });

    // Test 7: '*' in multiple lines is treated as desktop name (not wildcard)
    filter = new DesktopFilter("*\nWork");
    const desktopStar = { __brand: "KwinDesktop" as const, id: "3", name: "*" };
    Assert.assert(filter.shouldWorkOnDesktop(desktopStar), { message: "Should work on desktop named '*'" });
    Assert.assert(filter.shouldWorkOnDesktop(desktop2), { message: "Should work on desktop2" });
    Assert.assert(!filter.shouldWorkOnDesktop(desktop1), { message: "Should not work on desktop1" });

    // Test 8: Whitespace handling in desktop names
    filter = new DesktopFilter("  Work  \n  Desktop 1  ");
    Assert.assert(filter.shouldWorkOnDesktop(desktop1), { message: "Should work on desktop1 after trimming" });
    Assert.assert(filter.shouldWorkOnDesktop(desktop2), { message: "Should work on desktop2 after trimming" });

    log("DesktopFilter tests passed!");
}

testDesktopFilter();
