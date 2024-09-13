namespace Mocks {
    export class ShortcutHandler {
        public readonly activated: QSignal<[]> = new QSignal();

        public destroy() {}
    }
}
