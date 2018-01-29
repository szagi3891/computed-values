//@flow
 
import { Subscription } from './Utils/Subscription';
import { Box } from './Utils/Box';

export class Connection<T> {
    _connect: bool;
    _getValue: () => Box<T>;
    _notifyCallbacks: Array<() => void>;
    _disconnect: () => void;

    constructor(
        subscription: Subscription,
        getValue: () => Box<T>,
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

    getValueBox(): Box<T> {
        if (this._connect) {
            return this._getValue();
        }

        throw Error('Connection is disconnect');
    }

    getValue(): T {
        return this.getValueBox().getValue();
    }
}
