//@flow
 
import { Subscription } from './Utils/Subscription';

export class Connection<T> {
    _connect: bool;
    _getValue: () => T;
    _notifyCallbacks: Array<() => void>;
    _disconnect: () => void;

    constructor(
        subscription: Subscription,
        getValue: () => T,
    ) {
        this._connect = true;
        this._getValue = getValue;
        this._notifyCallbacks = [];
        this._disconnect = subscription.bind(() => {
            for (const callback of this._notifyCallbacks) {
                callback();
            }
        });
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

        throw Error('Connection is disconnect');
    }
}
