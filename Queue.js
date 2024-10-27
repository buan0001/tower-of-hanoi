export default class Queue {
  head = null;
  tail = null;

  constructor(head = null) {
    this.head = head;
    this.tail = head;
  }

  [Symbol.iterator]() {
    let current = this.tail;

    return {
      next: () => {
        if (current) {
          const returnVal = current;
          current = current.next;
          return { value: returnVal, done: false };
        } else {
          return { done: true };
        }
      },
    };
  }

  enqueue(data) {
    const newNode = new Node(data);
    if (this.tail) {
      // Make every node point backwards
      this.tail.next = newNode;
    }
    // Before setting the new node as tail
    this.tail = newNode;
    if (!this.head) {
      this.head = newNode;
    }
  }

  dequeue() {
    if (!this.head) {
      return;
    }
    const dequeuedNode = this.head;
    if (this.head.next) {
      this.head = this.head.next;
    } else {
      this.head = null;
      this.tail = null;
    }
    return dequeuedNode;
  }

  peek() {
    return this.head;
  }

  // V2
  get(index) {
    let current = this.head;
    for (let i = 0; i < index; i++) {
      if (!current) {
        return;
      }
      current = current.next;
    }
    return current;
  }

  // V1
  // Index 0 == head? So loop through everything first is required?... and an array makes life a lot better?
  // get(index) {
  //   let current = this.tail;
  //   const allNodes = [];
  //   while (current) {
  //     allNodes.push(current);
  //     current = current.next;
  //   }
  //   // Total - index "reverses" the order. Index 0 indeed becomes the final element
  //   // -1 is just required since length is 1-indexed but the array itself is 0-indexed
  //   const reversedIndex = allNodes.length - 1 - index;
  //   return allNodes[reversedIndex];
  // }

  size() {
    let current = this.head;
    let count = 0;
    while (current) {
      count++;
      current = current.next;
    }
    console.log("count", count);
    return count;
  }
  dumpList() {
    let current = this.head;
    while (current) {
      console.log(current);
      current = current.next;
    }
  }
}

class Node {
  data = null;
  next = null;
  constructor(data = null, next = null) {
    this.data = data;
    this.next = next;
  }

  setNext(newNext) {
    this.next = newNext;
  }
}
