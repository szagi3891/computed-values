//@flow

import { Subscription } from './Utils/Subscription';
import { Computed } from './Computed';
import { transaction } from './transaction';
import { Box } from './Utils/Box';

type FuncConnectType<T> = (funcConnect: ((setValue: T) => void)) => (() => void);

export class Value<T> {
    _value: Box<T>;
    _subscription: Subscription;

    constructor(value: T, funcConnect?: FuncConnectType<T>) {
        this._value = new Box(value);
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
            this._value = new Box(newValue);
            this._subscription.notify();
        });
    }

    getValueBox(): Box<T> {
        return this._value;
    }

    getValue(): T {
        return this._value.getValue();
    }

    asComputed(): Computed<T> {
        return new Computed(
            () => this._subscription,
            () => this._value
        );
    }
}
