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

class Grid {
    constructor() {
        this.columns = new LinkedList();
        this.windowMap = new Map();
    }
    
    removeWindow(id) {
        const windowNode = this.windowMap.get(id);
        const window = windowNode.item;
        const columnNode = window.columnNode;
        const column = columnNode.item;
        column.windows.remove(windowNode);
        this.columns.remove(columnNode);
        this.windowMap.delete(id);
    }
    
    addWindow(id, client) {
        const column = new Column();
        const columnNode = new LinkedListNode(column);
        const windowNode = new LinkedListNode(new Window(columnNode, client));
        column.windows.insertEnd(windowNode);
        this.columns.insertEnd(columnNode);
        this.windowMap.set(id, windowNode);
    }
    
    arrange() {
        for (const columnNode of this.columns.iterator()) {
            const column = columnNode.item;
            for (const windowNode of column.windows.iterator()) {
                const window = windowNode.item;
                const client = window.client;
                print(client.windowId);
                print("\t" + client.frameGeometry);
                client.frameGeometry = Qt.rect(client.x, client.y, client.width, client.height);
                print("\t" + client.frameGeometry);
                print("client arranged successfully");
            }
        }
    }
}

class Column {
    constructor() {
        this.windows = new LinkedList();
    }
}

class Window {
    constructor(columnNode, client) {
        this.columnNode = columnNode;
        this.client = client;
    }
}

function moveLeft() {
    print("key pressed");
}

function toggleFloating() {
    const id = workspace.activeClient.windowId;
    if (grid.windowMap.has(id)) {
        grid.removeWindow(id);
        grid.arrange();
    } else {
        grid.addWindow(id, workspace.activeClient);
        grid.arrange();
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

let grid = new Grid();
init();
