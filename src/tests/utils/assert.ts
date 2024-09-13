function assert(assertion: boolean, message?: string) {
    if (assertion) {
        return;
    }

    if (message != undefined) {
        console.assert(assertion, message);
    } else {
        console.assert(assertion);
    }
    console.trace();
    process.exit(1);
}
