//@flow

export class Box<T> {
    _value: T;
    constructor(value: T) {
        this._value = value;
    }

    getValue(): T {
        return this._value;
    }
}
