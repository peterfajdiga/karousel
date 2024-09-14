namespace Mocks {
    export class KwinClient {
        private static readonly borderThickness = 10;

        public readonly shadeable: boolean = false;
        public readonly minSize: Readonly<QmlSize> = new QmlSize(0, 0);
        public readonly transient: boolean = false;
        public readonly transientFor: KwinClient | null = null;
        public readonly move: boolean = false;
        public readonly resize: boolean = false;
        public readonly moveable: boolean = false;
        public readonly resizeable: boolean = false;
        public readonly fullScreenable: boolean = false;
        public readonly maximizable: boolean = false;
        public readonly output: Output = false;
        public readonly dock: boolean = false;
        public readonly normalWindow: boolean = false;
        public readonly managed: boolean = false;
        public readonly popupWindow: boolean = false;

        public fullScreen: boolean = false;
        public activities: string[] = [];
        public skipSwitcher: boolean = false;
        public keepAbove: boolean = false;
        public keepBelow: boolean = false;
        public shade: boolean = false;
        public minimized: boolean = false;
        public desktops: KwinDesktop[] = [];
        public tile: Tile = false;
        public opacity: number = 1.0;

        public readonly fullScreenChanged: QSignal<[]> = new QSignal();
        public readonly desktopsChanged: QSignal<[]> = new QSignal();
        public readonly activitiesChanged: QSignal<[]> = new QSignal();
        public readonly minimizedChanged: QSignal<[]> = new QSignal();
        public readonly maximizedAboutToChange: QSignal<[MaximizedMode]> = new QSignal();
        public readonly captionChanged: QSignal<[]> = new QSignal();
        public readonly tileChanged: QSignal<[]> = new QSignal();
        public readonly interactiveMoveResizeStarted: QSignal<[]> = new QSignal();
        public readonly interactiveMoveResizeFinished: QSignal<[]> = new QSignal();
        public readonly frameGeometryChanged: QSignal<[oldGeometry: QmlRect]> = new QSignal();

        constructor(
            public readonly pid: number,
            public readonly resourceClass: string,
            public readonly caption: string,
            public frameGeometry: QmlRect,
        ) {}

        setMaximize(vertically: boolean, horizontally: boolean) {
            this.maximizedAboutToChange.fire(
                vertically ? (
                    horizontally ? MaximizedMode.Maximized : MaximizedMode.Vertically
                ) : (
                    horizontally ? MaximizedMode.Horizontally : MaximizedMode.Unmaximized
                )
            );
        }

        public get clientGeometry() {
            return new QmlRect(
                this.frameGeometry.x + KwinClient.borderThickness,
                this.frameGeometry.y + KwinClient.borderThickness,
                this.frameGeometry.width - 2 * KwinClient.borderThickness,
                this.frameGeometry.height - 2 * KwinClient.borderThickness,
            );
        }
    }
}
