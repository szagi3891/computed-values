//@flow

import { Subscription } from './Utils/Subscription';
import { Computed } from './Computed';
import { transaction } from './transaction';

type FuncConnectType<T> = (funcConnect: ((setValue: T) => void)) => (() => void);

export class Value<T> {
    _value: T;
    _subscription: Subscription;

    constructor(value: T, funcConnect?: FuncConnectType<T>) {
        this._value = value;
        this._subscription = new Subscription();

        if (funcConnect) {
            this._connect(funcConnect);
        }      
    }

    _connect(funcConnect: FuncConnectType<T>) {
        this._subscription.onUp(() => {
            const unsubscribe = funcConnect((value: T) => {
                this.setValue(value);
            });

            const onDown = () => {
                unsubscribe();
                this._subscription.onDownRemove(onDown);
            };

            this._subscription.onDown(onDown);
        });
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
