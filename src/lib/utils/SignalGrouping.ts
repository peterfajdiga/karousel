namespace SignalGrouping {
    export class Group<S extends QSignal<any>[]> {
        private signalManager: SignalManager;
        private argsBySignal: Map<S[number], GroupUnion<S>> = new Map();
        private delayer = new Delayer(50, () => this.fire());

        constructor(
            private handlers: Handler<S>[], // in order of decreasing priority
        ) {
            this.signalManager = new SignalManager();
            const signals = collectSignals(handlers);
            for (const signal of signals) {
                this.signalManager.connect(signal, (...args: any) => {
                    this.argsBySignal.set(signal, args);
                    this.delayer.run();
                });
            }
        }

        public fire() {
            for (const handler of this.handlers) {
                const args = this.getGroupArgs(handler.signals);
                if (args !== null) {
                    handler.f(...args);
                    break;
                }
            }
            this.argsBySignal.clear();
        }

        public destroy() {
            this.signalManager.destroy();
        }

        private getGroupArgs(signals: [...S]) {
            const groupArgs = signals.map(signal => this.argsBySignal.get(signal));
            if (groupArgs.some(args => args === undefined)) {
                return null;
            }
            return groupArgs as [...GroupArgs<S>];
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

    interface Handler<S extends QSignal<any>[]> {
        signals: [...S];
        f: (...args: [...GroupArgs<S>]) => void;
    }

    type GroupArgs<S extends QSignal<any>[]> = {
        [K in keyof S]: S[K] extends QSignal<infer A> ? A : never;
    };

    type GroupUnion<S extends QSignal<any>[]> = S[number] extends QSignal<infer A> ? A : never;
}
