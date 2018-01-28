//@flow

import { Subscription } from './Utils/Subscription';
import { Computed } from './Computed';
import { transaction } from './transaction';

export class Value<T> {
    _value: T;
    _subscription: Subscription;

    constructor(value: T, fnCreate?: (fnInner: ((setValue: T) => void)) => (() => void)) {
        this._value = value;
        this._subscription = new Subscription();

        //gdy wzrośnie ilość subskrybentów to wtedy nawiązuj połaczenie za pomocą fnInner

        if (fnCreate) {
            fnCreate((value: T) => {
                this.setValue(value);
            });
        }      
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
