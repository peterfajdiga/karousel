class TestRunner {
    private readonly tests: TestRunner.Test[] = [];

    public register(name: string, count: number, f: () => void) {
        this.tests.push({ name: name, count: count, f: f });
    }

    public run() {
        const nameRegexp = new RegExp(process.argv[2]);
        for (const test of this.tests) {
            if (nameRegexp.test(test.name)) {
                console.log("Running test " + test.name);
                for (let i = 0; i < test.count; i++) {
                    test.f();
                }
            }
        }
    }
}

namespace TestRunner {
    export interface Test {
        name: string,
        count: number,
        f: () => void,
    }
}

const tests = new TestRunner();
