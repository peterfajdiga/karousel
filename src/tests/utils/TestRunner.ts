class TestRunner {
    private readonly tests: TestRunner.Test[] = [];

    public register(name: string, count: number, f: () => void) {
        this.tests.push({ name: name, count: count, f: f });
    }

    public run() {
        for (const test of this.tests) {
            console.log("Running test " + test.name);
            for (let i = 0; i < test.count; i++) {
                runLog.length = 0;
                test.f();
            }
        }
    }
}

namespace TestRunner {
    export type Test = {
        name: string,
        count: number,
        f: () => void,
    }
}

const runLog: string[] = [];
const tests = new TestRunner();
