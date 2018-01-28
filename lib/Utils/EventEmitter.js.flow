//@flow

export class EventEmitter<T> {
    +_list: Map<mixed, (param: T) => void>;

    constructor() {
        this._list = new Map();
    }

    on(callback: (param: T) => void) {
        const token = {};

        this._list.set(token, callback);

        return () => {
            this._list.delete(token);
        };
    }

    emit(value: T) {
        const listCopy = [];

        for (const item of this._list.values()) {
            listCopy.push(item);
        }

        for (const itemCallback of listCopy) {
            itemCallback(value);
        }
    }

    count(): number {
        return this._list.size;
    }

    remove(callback: (param:T) => void) {
        const tokens = [];

        for (const [itemToken, itemCallback] of this._list.entries()) {
            if (callback === itemCallback) {
                tokens.push(itemToken);
            }
        }

        for (const tokenToRemove of tokens) {
            this._list.delete(tokenToRemove);
        }
    }
}