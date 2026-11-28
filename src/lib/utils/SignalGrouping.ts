namespace SignalGrouping {
    export class Group {
        private argsBySignal = new Map<QSignal<[any]>, [[any]]>();
        private delayer = new Delayer(50, () => this.fire());

        constructor(
            private handlers: Handler<any>[], // in order of decreasing priority
        ) {}

        public connect(manager: SignalManager) {
            const signals = collectSignals(this.handlers);
            for (const signal of signals) {
                manager.connect(signal, (...args: any) => {
                    if (this.argsBySignal.has(signal)) {
                        // the same signal fired again, so it doesn't belong to the pending group
                        this.fire();
                    }
                    this.argsBySignal.set(signal, args);
                    this.delayer.run();
                });
            }
        }

        public interrupt() {
            if (this.argsBySignal.size > 0) {
                this.fire();
            }
        }

        private fire() {
            // clear before calling the handler, because the handler may trigger `interrupt`
            const argsBySignal = this.argsBySignal;
            this.argsBySignal = new Map();
            for (const handler of this.handlers) {
                const args = Group.getGroupArgs(argsBySignal, handler.signals);
                if (args !== null) {
                    handler.f(...args);
                    break;
                }
            }
        }

        private static getGroupArgs(argsBySignal: Map<QSignal<[any]>, [[any]]>, signals: QSignal<[any]>[]) {
            const groupArgs = signals.map(signal => argsBySignal.get(signal));
            if (groupArgs.some(args => args === undefined)) {
                return null;
            }
            return groupArgs as [[any]][];
        }
    }

    function collectSignals<S extends QSignal<any>[]>(handlers: Handler<S>[]) {
        const signals: S[number][] = [];
        for (const handler of handlers) {
            for (const signal of handler.signals) {
                if (!signals.includes(signal)) {
                    signals.push(signal);
                }
            }
        }
        return signals;
    }

    export class Handler<S extends QSignal<any>[]> {
        constructor(
            public signals: [...S],
            public f: (...args: [...GroupArgs<S>]) => void,
        ) {}
    }

    type GroupArgs<S extends QSignal<any>[]> = {
        [K in keyof S]: S[K] extends QSignal<infer A> ? A : never;
    };
}
