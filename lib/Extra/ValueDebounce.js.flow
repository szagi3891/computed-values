//@flow

import { Computed } from '../Computed';
import { Value } from '../Value';

export class ValueDebounce<T> {
    +_value: Value<T>;
    +_timeout: number;
    _timer: TimeoutID | null;

    constructor(initValue: T, timeout: number) {
        this._value = new Value(initValue);
        this._timeout = timeout;
        this._timer = null;
    }

    setValue(newValue: T) {
        if (this._timer !== null) {
            clearTimeout(this._timer);
        }

        this._timer = setTimeout(() => {
            this._value.setValue(newValue);
        }, this._timeout);
    }

    asComputed(): Computed<T> {
        return this._value.asComputed();
    }
}

