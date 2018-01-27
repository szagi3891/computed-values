//@flow
import { transaction } from '../transaction';
import { safeIterate } from './SafeIterate';

export class Subscription {
    _subscription: Map<mixed, () => void>;
    _onDown: Array<() => void>;

    constructor() {
        this._subscription = new Map();
        this._onDown = [];
    }

    notify() {
        const toRun = safeIterate(this._subscription.values());
        for (const item of toRun) {
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
                const toRun = safeIterate(this._onDown);
                for (const item of toRun) {
                    item();
                }
            }
        }
    }
}
