//@flow
import { transaction } from '../transaction';
import { copyFrom } from './SafeIterate';

export class Subscription {
    _subscription: Map<mixed, () => void>;
    _onUp: Set<() => void>;
    _onDown: Set<() => void>;

    constructor() {
        this._subscription = new Map();
        this._onUp = new Set();
        this._onDown = new Set();
    }

    notify() {
        for (const item of copyFrom(this._subscription.values())) {
            transaction(() => {
                item();
            });
        }
    }

    onUp(callback: () => void) {
        this._onUp.add(callback);
    }

    onDown(callback: () => void) {
        this._onDown.add(callback);
    }

    onDownRemove(callback: () => void) {
        this._onDown.delete(callback);
    }

    bind(notify: () => void): () => void {
        const token = {};

        this._subscription.set(token, notify);

        if (this._subscription.size === 1) {
            for (const item of copyFrom(this._onUp.values())) {
                item();
            }
        }

        return () => {
            this._subscription.delete(token);

            if (this._subscription.size === 0) {
                for (const item of copyFrom(this._onDown.values())) {
                    item();
                }
            }
        }
    }
}
