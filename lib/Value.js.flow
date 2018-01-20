//@flow

import { Subscription } from './Subscription';
import { ValueComputed } from './ValueComputed';
import { transaction } from './transaction';

export class Value<T> {
    _value: T;
    _subscription: Subscription;

    constructor(value: T) {
        this._value = value;
        this._subscription = new Subscription();
    }

    /*
    static create<K>(initValue: K, funcBuild: (disconnect: (()=> void) => void): Value<T> {
        const val = new Value(initValue);

        //this._subscription = new Subscription(() => {});
    }

    const structure$: ValueObservable<StructureType | null> = ValueObservable.create(null, next => {
        const unsub = database.ref('structure').on('value', snap => {
            if (snap) {
                next(ValidateStructureType(JSON.parse(snap.val())));
            }
        });
    
        //$ FlowFixMe
        return () => unsub();
    });
    */

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

    asComputed(): ValueComputed<T> {
        return new ValueComputed(
            () => this._subscription,
            () => this._value
        );
    }
}
