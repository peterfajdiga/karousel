class LinkedList {
    private firstNode: LinkedListNode|null;
    private lastNode: LinkedListNode|null;
    private itemMap: Map<any, LinkedListNode>;

    constructor() {
        this.firstNode = null;
        this.lastNode = null;
        this.itemMap = new Map();
    }

    private getNode(item: any) {
        const node = this.itemMap.get(item);
        if (node === undefined) {
            throw new Error("item not in list");
        }
        return node;
    }

    insertBefore(item: any, nextItem: any) {
        const nextNode = this.getNode(nextItem);
        this.insert(item, nextNode.prev, nextNode);
    }

    insertAfter(item: any, prevItem: any) {
        const prevNode = this.getNode(prevItem);
        this.insert(item, prevNode, prevNode.next);
    }

    insertStart(item: any) {
        this.insert(item, null, this.firstNode);
    }

    insertEnd(item: any) {
        this.insert(item, this.lastNode, null);
    }

    private insert(item: any, prevNode: LinkedListNode|null, nextNode: LinkedListNode|null) {
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

    getPrev(item: any) {
        const prevNode = this.getNode(item).prev;
        return prevNode === null ? null : prevNode.item;
    }

    getNext(item: any) {
        const nextNode = this.getNode(item).next;
        return nextNode === null ? null : nextNode.item;
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

    remove(item: any) {
        const node = this.getNode(item);
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

    private swap(node0: LinkedListNode, node1: LinkedListNode) {
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

    moveBack(item: any) {
        const node = this.getNode(item);
        if (node.prev !== null) {
            console.assert(node !== this.firstNode);
            this.swap(node.prev, node);
        }
    }

    moveForward(item: any) {
        const node = this.getNode(item);
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

    *iteratorFrom(startItem: any) {
        for (let node: LinkedListNode|null = this.getNode(startItem); node !== null; node = node.next) {
            yield node.item;
        }
    }
}

// TODO (optimization): reuse nodes
class LinkedListNode {
    public item: any;
    public prev: LinkedListNode|null;
    public next: LinkedListNode|null;

    constructor(item: any, prev: LinkedListNode|null, next: LinkedListNode|null) {
        this.item = item;
        this.prev = prev;
        this.next = next;
    }
}
