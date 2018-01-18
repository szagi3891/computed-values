//@flow
 
import { ValueSubscription } from './ValueSubscription';

export class ValueConnection<T> {
    _connect: bool;
    _getSubscription: () => ValueSubscription;
    _getValue: () => T;
    _disconnect: () => void;
    _notifyCallbacks: Array<() => void>;

    constructor(
        getSubscription: () => ValueSubscription,
        getValue: () => T,
    ) {
        this._connect = true;
        this._getSubscription = getSubscription;
        this._getValue = getValue;
        this._disconnect = getSubscription().bind(
            () => this._notify()
        );
        this._notifyCallbacks = [];
    }

    disconnect = () => {
        this._connect = true;
        this._disconnect();
    }

    onNotify(callback: () => void) {
        this._notifyCallbacks.push(callback);
    }

    getValue(): T {
        if (this._connect) {
            return this._getValue();
        }

        throw Error('Połączenie jest rozłączone');
    }

    _notify() {
        for (const callback of this._notifyCallbacks) {
            callback();
        }
    }
}
