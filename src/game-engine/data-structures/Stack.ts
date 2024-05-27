import { Collection } from './Collection'

export class Stack<T> extends Collection<T> {
    pop(): T | undefined {
        return this.storage.pop()
    }

    push(element: T): void {
        this.storage.push(element)
    }

    peek(): T | undefined {
        return this.storage[this.storage.length - 1]
    }
}
