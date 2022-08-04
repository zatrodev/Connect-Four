export class Node {
    constructor(data = null, prev = null, next = null, top = null, bot = null) {
        this.data = data;
        this.prev = prev;
        this.next = next;
        this.top = top;
        this.bot = bot;
    }
}

export class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    add(node) {
        if (this.size === 0) {
            this.head = this.tail = node;
        } else {
            this.tail.next = node;
            this.tail.next.prev = this.tail;
            this.tail = this.tail.next;
        }

        this.size++;
    }

    get(index) {
        let trav = this.head;
        while (index--) {
            trav = trav.next;
        }

        return trav;
    }

    set(index, value) {
        this.get(index).data = value;
    }
}
