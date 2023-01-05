const UNATTACH_OFFSET = { x: 24, y: 24 };
const GAPS_OUTER = { x: 24, y: 24 };
const GAPS_INNER = { x: 12, y: 12 };

class LinkedList {
    constructor() {
        this.firstNode = null;
        this.lastNode = null;
    }
    
    insertBefore(node, nextNode) {
        const prevNode = nextNode === null ? null : nextNode.prev;
        this.insert(node, prevNode, nextNode);
    }
    
    insertAfter(node, prevNode) {
        const nextNode = prevNode === null ? null : prevNode.next;
        this.insert(node, prevNode, nextNode);
    }
    
    insertStart(node) {
        this.insertBefore(node, this.firstNode);
    }
    
    insertEnd(node) {
        this.insertAfter(node, this.lastNode);
    }
    
    swap(node0, node1) {
        assert(node0.next === node1 && node1.prev === node0);
        const prevNode = node0.prev;
        const nextNode = node1.next;
        
        if (prevNode !== null) {
            prevNode.next = node1;
        }
        node1.next = node0;
        node0.next = nextNode;
        
        if (nextNode !== null) {
            nextNode.prev = node0;
        }
        node0.prev = node1;
        node1.prev = prevNode;
        
        if (this.firstNode === node0) {
            this.firstNode = node1;
        }
        if (this.lastNode === node1) {
            this.lastNode = node0;
        }
    }
    
    remove(node) {
        const prevNode = node.prev;
        const nextNode = node.next;
        if (prevNode !== null) {
            prevNode.next = nextNode;
        }
        if (nextNode !== null) {
            nextNode.prev = prevNode;
        }
        if (this.firstNode === node) {
            this.firstNode = nextNode;
        }
        if (this.lastNode === node) {
            this.lastNode = prevNode;
        }
    }
    
    insert(node, prevNode, nextNode) {
        node.next = nextNode;
        node.prev = prevNode;
        if (nextNode !== null) {
            assert(nextNode.prev === prevNode);
            nextNode.prev = node;
        }
        if (prevNode !== null) {
            assert(prevNode.next === nextNode);
            prevNode.next = node;
        }
        if (this.firstNode === nextNode) {
            this.firstNode = node;
        }
        if (this.lastNode === prevNode) {
            this.lastNode = node;
        }
    }
    
    *iterator() {
        for (let node = this.firstNode; node !== null; node = node.next) {
            yield node;
        }
    }
}

class LinkedListNode {
    constructor(item) {
        this.item = item;
        this.prev = null;
        this.next = null;
    }
}

class World {
    constructor(nDesktops) {
        this.grids = new Array(nDesktops);
        for (let i = 0; i < nDesktops; i++) {
            this.grids[i] = new Grid(i);
        }
        this.clientMap = new Map();
    }
    
    addClient(id, client) {
        const desktopIndex = client.desktop - 1;
        const grid = this.grids[desktopIndex];
        const column = new Column(grid);
        const columnNode = new LinkedListNode(column);
        const windowNode = new LinkedListNode(new Window(columnNode, client));
        
        column.addWindow(windowNode);
        grid.addColumn(columnNode);
        grid.arrange();
        
        this.clientMap.set(id, windowNode);
    }
    
    removeClient(id) {
        const windowNode = this.clientMap.get(id);
        const window = windowNode.item;
        const columnNode = window.columnNode;
        const column = columnNode.item;
        const grid = column.grid;
        
        column.removeWindow(windowNode);
        grid.removeColumn(columnNode);
        grid.arrange();
        
        const clientRect = window.client.frameGeometry;
        clientRect.x += UNATTACH_OFFSET.x;
        clientRect.y += UNATTACH_OFFSET.y;
        clientRect.width = window.floatingSize.width;
        clientRect.height = window.floatingSize.height;
        
        this.clientMap.delete(id);
    }
}

class Grid {
    constructor(desktopIndex) {
        this.desktopIndex = desktopIndex;
        this.columns = new LinkedList();
        
        const desktopNumber = desktopIndex + 1;
        this.area = workspace.clientArea(workspace.PlacementArea, 0, desktopNumber);
        // TODO: multi-screen support
        // TODO: react to changes in resolution
    }
    
    addColumn(columnNode) {
        this.columns.insertEnd(columnNode);
    }
    
    removeColumn(columnNode) {
        this.columns.remove(columnNode);
    }
    
    arrange() {
        let x = this.area.x + GAPS_OUTER.x;
        for (const columnNode of this.columns.iterator()) {
            const column = columnNode.item;
            let y = this.area.y + GAPS_OUTER.y;
            for (const windowNode of column.windows.iterator()) {
                // TODO: resize height to fit all
                const window = windowNode.item;
                const client = window.client;
                client.frameGeometry.x = x;
                client.frameGeometry.y = y;
                y += client.frameGeometry.height + GAPS_INNER.y;
            }
            x += column.width + GAPS_INNER.x;
        }
    }
}

class Column {
    constructor(grid) {
        this.grid = grid;
        this.windows = new LinkedList();
        this.width = null;
    }
    
    addWindow(windowNode) {
        const window = windowNode.item
        const client = window.client;
        this.windows.insertEnd(windowNode);
        if (this.width === null) {
            this.width = client.frameGeometry.width;
        }
        // TODO: also change column width if the new window requires it
    }
    
    removeWindow(windowNode) {
        this.windows.remove(windowNode);
    }
}

class Window {
    constructor(columnNode, client) {
        this.columnNode = columnNode;
        this.client = client;
        this.floatingSize = {
            width: client.frameGeometry.width,
            height: client.frameGeometry.height,
        };
    }
}

function moveLeft() {
    print("key pressed");
}

function toggleFloating() {
    const client = workspace.activeClient;
    const id = client.windowId;
    if (world.clientMap.has(id)) {
        world.removeClient(id);
    } else {
        world.addClient(id, client);
    }
}

function catchWrap(f) {
    return _ => {
        try {
            f();
        } catch (error) {
            print(error);
        }
    }
}

function registerShortcuts() {
    registerShortcut("basalt-window-move-left", "Basalt: Move window left", "Meta+Shift+A", moveLeft);
    registerShortcut("basalt-window-toggle-floating", "Basalt: Toggle floating", "Meta+Space", catchWrap(toggleFloating));
}

function init() {
    registerShortcuts();
}

let world = new World(workspace.desktops); // TODO: react to changes in number of desktops
init();
