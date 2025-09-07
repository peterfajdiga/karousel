namespace FocusPassing {
    export class Passer {
        private currentRequest: Request | null = null;

        public request(target: Focuser) {
            this.currentRequest = new Request(target, Date.now());
        }

        public clear() {
            this.currentRequest = null;
        }

        public activate() {
            if (this.currentRequest === null) {
                return;
            }

            if (this.currentRequest.isExpired()) {
                this.clear();
                return;
            }

            this.currentRequest.target.focus();
            this.clear();
        }
    }

    class Request {
        private static readonly validMs = 200;

        constructor(
            public readonly target: Focuser,
            private readonly time: number,
        ) {}

        public isExpired() {
            return Date.now() - this.time > Request.validMs;
        }
    }

    interface Focuser {
        focus(): void;
    }
}
