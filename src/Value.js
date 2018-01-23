//@flow

import { Subscription } from './Utils/Subscription';
import { Computed } from './Computed';
import { transaction } from './transaction';

export class Value<T> {
    _value: T;
    _subscription: Subscription;

    constructor(value: T) {
        this._value = value;
        this._subscription = new Subscription();
    }

    setValue(newValue: T) {
        transaction(() => {
            this._value = newValue;
            this._subscription.notify();
        });
    }

    getValue(): T {
        return this._value;
    }

    update(fnUpdate: (old: T) => T) {
        transaction(() => {
            this._value = fnUpdate(this._value);
            this._subscription.notify();
        });
    }

    asComputed(): Computed<T> {
        return new Computed(
            () => this._subscription,
            () => this._value
        );
    }
}
