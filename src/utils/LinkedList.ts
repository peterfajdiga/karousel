class LinkedList<T> {
    private firstNode: LinkedListNode<T>|null;
    private lastNode: LinkedListNode<T>|null;
    private readonly itemMap: Map<T, LinkedListNode<T>>;

    constructor() {
        this.firstNode = null;
        this.lastNode = null;
        this.itemMap = new Map();
    }

    private getNode(item: T) {
        const node = this.itemMap.get(item);
        if (node === undefined) {
            throw new Error("item not in list");
        }
        return node;
    }

    public insertBefore(item: T, nextItem: T) {
        const nextNode = this.getNode(nextItem);
        this.insert(item, nextNode.prev, nextNode);
    }

    public insertAfter(item: T, prevItem: T) {
        const prevNode = this.getNode(prevItem);
        this.insert(item, prevNode, prevNode.next);
    }

    public insertStart(item: T) {
        this.insert(item, null, this.firstNode);
    }

    public insertEnd(item: T) {
        this.insert(item, this.lastNode, null);
    }

    private insert(item: T, prevNode: LinkedListNode<T>|null, nextNode: LinkedListNode<T>|null) {
        const node = new LinkedListNode(item);
        this.itemMap.set(item, node);
        this.insertNode(node, prevNode, nextNode);
    }

    private insertNode(node: LinkedListNode<T>, prevNode: LinkedListNode<T>|null, nextNode: LinkedListNode<T>|null) {
        node.prev = prevNode;
        node.next = nextNode;
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

    public getPrev(item: T) {
        const prevNode = this.getNode(item).prev;
        return prevNode === null ? null : prevNode.item;
    }

    public getNext(item: T) {
        const nextNode = this.getNode(item).next;
        return nextNode === null ? null : nextNode.item;
    }

    public getFirst() {
        if (this.firstNode === null) {
            return null;
        }
        return this.firstNode.item;
    }

    public getLast() {
        if (this.lastNode === null) {
            return null;
        }
        return this.lastNode.item;
    }

    public getItemAtIndex(index: number) {
        let node = this.firstNode;
        if (node === null) {
            return null;
        }
        for (let i = 0; i < index; i++) {
            node = node.next;
            if (node === null) {
                return null;
            }
        }
        return node.item;
    }

    public remove(item: T) {
        const node = this.getNode(item);
        this.itemMap.delete(item);
        this.removeNode(node);
    }

    private removeNode(node: LinkedListNode<T>) {
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

    public contains(item: T) {
        return this.itemMap.has(item);
    }

    private swap(node0: LinkedListNode<T>, node1: LinkedListNode<T>) {
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

    public move(item: T, prevItem: T|null) {
        const node = this.getNode(item);
        this.removeNode(node);
        if (prevItem === null) {
            this.insertNode(node, null, this.firstNode);
        } else {
            const prevNode = this.getNode(prevItem);
            this.insertNode(node, prevNode, prevNode.next);
        }
    }

    public moveBack(item: T) {
        const node = this.getNode(item);
        if (node.prev !== null) {
            console.assert(node !== this.firstNode);
            this.swap(node.prev, node);
        }
    }

    public moveForward(item: T) {
        const node = this.getNode(item);
        if (node.next !== null) {
            console.assert(node !== this.lastNode);
            this.swap(node, node.next);
        }
    }

    public length() {
        return this.itemMap.size;
    }

    public *iterator() {
        for (let node = this.firstNode; node !== null; node = node.next) {
            yield node.item;
        }
    }

    public *iteratorFrom(startItem: T) {
        for (let node: LinkedListNode<T>|null = this.getNode(startItem); node !== null; node = node.next) {
            yield node.item;
        }
    }
}

// TODO (optimization): reuse nodes
class LinkedListNode<T> {
    public readonly item: T;
    public prev: LinkedListNode<T>|null;
    public next: LinkedListNode<T>|null;

    constructor(item: T) {
        this.item = item;
        this.prev = null;
        this.next = null;
    }
}
