//@flow
import { EventEmitter } from '../Utils/EventEmitter';

type CallbacksType<G> = {
    create: () => G,
    drop: null | ((val:G) => void)
};

export class ValueLayzy<G> {
    _callbacks: CallbacksType<G>;
    _value: null | { value: G};
    _onNew: EventEmitter<G>;

    constructor(callbacks: CallbacksType<G>) {
        this._callbacks = callbacks;
        this._value = null;
        this._onNew = new EventEmitter();
    }

    getValue(): G {
        const val = this._value;
        if (val) {
            return val.value;
        }

        const newValue = this._callbacks.create();
        this._value = { value: newValue };

        this._onNew.emit(newValue);

        return newValue;
    }

    clear() {
        if (this._value) {
            const drop = this._callbacks.drop;

            if (drop) {
                drop(this._value.value);
            }
        }
        this._value = null;
    }

    onNew(callback: (data: G) => void): (() => void) {
        return this._onNew.on(callback);
    }
}