class LinkedList {
    private firstNode: LinkedListNode;
    private lastNode: LinkedListNode;
    private itemMap: Map<any, LinkedListNode>;

    constructor() {
        this.firstNode = null;
        this.lastNode = null;
        this.itemMap = new Map();
    }

    insertBefore(item, nextItem) {
        const nextNode = this.itemMap.get(nextItem);
        this.insert(item, nextNode.prev, nextNode);
    }

    insertAfter(item, prevItem) {
        const prevNode = this.itemMap.get(prevItem);
        this.insert(item, prevNode, prevNode.next);
    }

    insertStart(item) {
        this.insert(item, null, this.firstNode);
    }

    insertEnd(item) {
        this.insert(item, this.lastNode, null);
    }

    private insert(item, prevNode, nextNode) {
        const node = new LinkedListNode(item, prevNode, nextNode);
        this.itemMap.set(item, node);
        if (nextNode !== null) {
            console.assert(nextNode.prev === prevNode);
            nextNode.prev = node;
        }
        if (prevNode !== null) {
            console.assert(prevNode.next === nextNode);
            prevNode.next = node;
        }
        if (this.firstNode === nextNode) {
            this.firstNode = node;
        }
        if (this.lastNode === prevNode) {
            this.lastNode = node;
        }
    }

    getPrev(item) {
        const prevNode = this.itemMap.get(item).prev;
        if (prevNode === null) {
            return null;
        }
        return prevNode.item;
    }

    getNext(item) {
        const nextNode = this.itemMap.get(item).next;
        if (nextNode === null) {
            return null;
        }
        return nextNode.item;
    }

    getFirst() {
        if (this.firstNode === null) {
            return null;
        }
        return this.firstNode.item;
    }

    getLast() {
        if (this.lastNode === null) {
            return null;
        }
        return this.lastNode.item;
    }

    remove(item) {
        const node = this.itemMap.get(item);
        this.itemMap.delete(item);
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

    private swap(node0, node1) {
        console.assert(node0.next === node1 && node1.prev === node0);
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

    moveBack(item) {
        const node = this.itemMap.get(item);
        if (node.prev !== null) {
            console.assert(node !== this.firstNode);
            this.swap(node.prev, node);
        }
    }

    moveForward(item) {
        const node = this.itemMap.get(item);
        if (node.next !== null) {
            console.assert(node !== this.lastNode);
            this.swap(node, node.next);
        }
    }

    length() {
        return this.itemMap.size;
    }

    *iterator() {
        for (let node = this.firstNode; node !== null; node = node.next) {
            yield node.item;
        }
    }

    *iteratorFrom(startItem) {
        for (let node = this.itemMap.get(startItem); node !== null; node = node.next) {
            yield node.item;
        }
    }
}

// TODO (optimization): reuse nodes
class LinkedListNode {
    public item: any;
    public prev: LinkedListNode;
    public next: LinkedListNode;

    constructor(item, prev, next) {
        this.item = item;
        this.prev = prev;
        this.next = next;
    }
}
