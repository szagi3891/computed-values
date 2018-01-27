//@flow
import { copyFrom } from './SafeIterate';

export class Timer {
    _timer: TimeoutID;
    _readyCallbacks: Array<() => void> | null;

    constructor(timeout: number) {
        this._timer = setTimeout(() => {
            const callbacks = this._readyCallbacks;
            if (callbacks === null) {
                return;
            }

            this._readyCallbacks = null;

            for (const callbackItem of copyFrom(callbacks)) {
                callbackItem();
            }
        }, timeout);

        this._readyCallbacks = [];
    }

    onReady(callback: () => void) {
        if (this._readyCallbacks) {
            this._readyCallbacks.push(callback);
            return;
        }

        callback();
    }

    drop() {
        clearTimeout(this._timer);
    }
}
