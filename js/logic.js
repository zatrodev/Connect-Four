import { Node, LinkedList } from "./data-structures.js";

// convert every element in the array to a Node that is
// connected to the left, right, top, and bottom element
export function arrayToLinkedList(array) {
    let node2DArray = new Array();

    for (let i = 0; i < array.length; i++) {
        let nodeArray = new LinkedList();
        for (let j = 0; j < array[i].length; j++) {
            nodeArray.add(
                new Node(
                    array[i][j],
                    new Node(array[i][j - 1]),
                    new Node(array[i][j + 1]),
                    new Node(null, new Node(null), new Node(null)),
                    new Node(null, new Node(null), new Node(null))
                )
            );
        }

        node2DArray[i] = nodeArray;
    }

    // you can use either one of them or both
    return setTopNodes(node2DArray);
    return setBotNodes(node2DArray);
}

export function checkIfHasAdjacentNodes(node, value, winCondition, indexes) {
    // basically checks if a specific yellow or red circle
    // has a yellow or red circle next, above, below, and
    // diagonally adjecent to it
    if (node.next.data !== null) {
        let numOfIters = 0;
        for (
            let currNode = node;
            currNode.data === value;
            currNode = currNode.next
        ) {
            indexes[numOfIters] = [indexes[0][0], indexes[0][1] + numOfIters];
            numOfIters++;
        }

        if (numOfIters === winCondition) {
            console.log("Iters: ", numOfIters);
            return indexes;
        }
    }

    if (node.top.data !== null) {
        let numOfCalls = 0;
        for (
            let currNode = node;
            currNode.data === value;
            currNode = currNode.top
        ) {
            indexes[numOfCalls] = [indexes[0][0] - numOfCalls, indexes[0][1]];
            numOfCalls++;
        }

        if (numOfCalls === winCondition) {
            return indexes;
        }
    }
    if (node.top.next.data !== null) {
        let numOfCalls = 0;
        for (
            let currNode = node;
            currNode.data === value;
            currNode = currNode.top.next
        ) {
            indexes[numOfCalls] = [
                indexes[0][0] - numOfCalls,
                indexes[0][1] + numOfCalls,
            ];
            numOfCalls++;
        }

        if (numOfCalls === winCondition) {
            return indexes;
        }
    }

    if (node.top.prev.data !== null) {
        let numOfCalls = 0;
        for (
            let currNode = node;
            currNode.data === value;
            currNode = currNode.top.prev
        ) {
            indexes[numOfCalls] = [
                indexes[0][0] - numOfCalls,
                indexes[0][1] - numOfCalls,
            ];
            numOfCalls++;
        }

        if (numOfCalls === winCondition) {
            return indexes;
        }
    }

    // commented code below since it is not really
    // necessary to check the previous, bottom,
    // bottom right, and bottom left if we already checked the next,
    // top, top right, and top left of that specific yellow or red circle

    // uncomment this if you are using setBotNodes and
    // comment the remaining code above

    // if (node.prev.data !== null) {
    //     let numOfCalls = 0;
    //     for (
    //         let currNode = node;
    //         currNode.data === value;
    //         currNode = currNode.prev
    //     ) {
    //         indexes[numOfCalls] = [indexes[0][0], indexes[0][1] - numOfCalls];
    //         numOfCalls++;
    //     }

    //     if (numOfCalls === winCondition) {
    //         return indexes;
    //     }
    // }

    // if (node.bot.data !== null) {
    //     let numOfCalls = 0;
    //     for (
    //         let currNode = node;
    //         currNode.data === value;
    //         currNode = currNode.bot
    //     ) {
    //         indexes[numOfCalls] = [indexes[0][0] + numOfCalls, indexes[0][1]];
    //         numOfCalls++;
    //     }

    //     if (numOfCalls === winCondition) {
    //         return indexes;
    //     }
    // }

    // if (node.bot.next.data !== null) {
    //     let numOfCalls = 0;
    //     for (
    //         let currNode = node;
    //         currNode.data === value;
    //         currNode = currNode.bot.next
    //     ) {
    //         indexes[numOfCalls] = [
    //             indexes[0][0] + numOfCalls,
    //             indexes[0][1] + numOfCalls,
    //         ];
    //         numOfCalls++;
    //     }

    //     if (numOfCalls === winCondition) {
    //         return indexes;
    //     }
    // }

    // if (node.bot.prev !== null) {
    //     let numOfCalls = 0;
    //     for (
    //         let currNode = node;
    //         currNode.data === value;
    //         currNode = currNode.bot.prev
    //     ) {
    //         indexes[numOfCalls] = [
    //             indexes[0][0] + numOfCalls,
    //             indexes[0][1] - numOfCalls,
    //         ];
    //         numOfCalls++;
    //     }

    //     if (numOfCalls === winCondition) {
    //         console.log("win");
    //         return indexes;
    //     }
    // }
}

function setTopNodes(linkedList2D) {
    for (let i = 0; i < linkedList2D.length; i++) {
        try {
            let prevCurr = linkedList2D[i - 1].head;
            for (
                let curr = linkedList2D[i].head;
                curr != null;
                curr = curr.next, prevCurr = prevCurr.next
            ) {
                curr.top = prevCurr;
            }
        } catch {}
    }

    return linkedList2D;
}

function setBotNodes(linkedList2D) {
    for (let i = 0; i < linkedList2D.length; i++) {
        try {
            let nextCurr = linkedList2D[i + 1].head;
            for (
                let curr = linkedList2D[i].head;
                curr != null;
                curr = curr.next, nextCurr = nextCurr.next
            ) {
                curr.bot = nextCurr;
            }
        } catch {}
    }

    return linkedList2D;
}
