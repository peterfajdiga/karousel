namespace SignalGrouping {
    export class Group {
        private argsBySignal: Map<QSignal<[any]>, [[any]]> = new Map();
        private delayer = new Delayer(50, () => this.fire());

        constructor(
            private handlers: Handler<any>[], // in order of decreasing priority
        ) {}

        public connect(manager: SignalManager) {
            const signals = collectSignals(this.handlers);
            for (const signal of signals) {
                manager.connect(signal, (...args: any) => {
                    this.argsBySignal.set(signal, args);
                    this.delayer.run();
                });
            }
        }

        private fire() {
            for (const handler of this.handlers) {
                const args = this.getGroupArgs(handler.signals);
                if (args !== null) {
                    handler.f(args);
                    break;
                }
            }
            this.argsBySignal.clear();
        }

        private getGroupArgs(signals: QSignal<[any]>[]) {
            const groupArgs = signals.map(signal => this.argsBySignal.get(signal));
            if (groupArgs.some(args => args === undefined)) {
                return null;
            }
            return groupArgs;
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
