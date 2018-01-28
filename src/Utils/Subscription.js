//@flow
import { transaction } from '../transaction';
import { EventEmitter } from './EventEmitter';

export class Subscription {
    _subscription: EventEmitter<void>;
    _up: EventEmitter<void>;
    _down: EventEmitter<void>;

    constructor() {
        this._subscription = new EventEmitter();
        this._up = new EventEmitter();
        this._down = new EventEmitter();
    }

    notify() {
        transaction(() => {
            this._subscription.emit();
        });
    }

    onUp(callback: () => void): (() => void) {
        return this._up.on(callback);
    }

    onDown(callback: () => void): (() => void) {
        return this._down.on(callback);
    }

    onDownRemove(callback: () => void) {
        this._down.remove(callback);
    }

    bind(notify: () => void): () => void {
        const unsubscribeNotify = this._subscription.on(notify);

        if (this._subscription.count() === 1) {
            this._up.emit();
        }

        return () => {
            unsubscribeNotify();

            if (this._subscription.count() === 0) {
                this._down.emit();
            }
        }
    }
}
