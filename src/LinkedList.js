class LinkedList {
    constructor() {
        this.firstNode = null;
        this.lastNode = null;
        this.length = 0;
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
        this.length++;
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
        this.length--;
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
