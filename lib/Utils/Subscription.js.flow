//@flow
import { transaction } from '../transaction';
import { copyFrom } from './SafeIterate';

export class Subscription {
    _subscription: Map<mixed, () => void>;
    _onDown: Array<() => void>;

    constructor() {
        this._subscription = new Map();
        this._onDown = [];
    }

    notify() {
        for (const item of copyFrom(this._subscription.values())) {
            transaction(() => {
                item();
            });
        }
    }

    onDown(callback: () => void) {
        this._onDown.push(callback);
    }

    bind(notify: () => void): () => void {
        const token = {};

        this._subscription.set(token, notify);

        return () => {
            this._subscription.delete(token);

            if (this._subscription.size === 0) {
                for (const item of copyFrom(this._onDown)) {
                    item();
                }
            }
        }
    }
}
