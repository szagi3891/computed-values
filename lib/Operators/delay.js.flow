//@flow

import { Subscription } from '../Utils/Subscription';
import { Connection } from '../Connection';
import { Value } from '../Value';
import { ValueLayzy } from '../Utils/ValueLayzy';
import { Timer } from '../Utils/Timer';
import { pushToRefresh } from '../transaction';

class TimerList {
    _timers: Map<mixed, TimeoutID>;

    constructor() {
        this._timers = new Map();
    }

    clear() {
        for (const timerId of this._timers.values()) {
            clearTimeout(timerId);
        }
        this._timers = new Map();
    }

    createNew(timeout: number, callback: () => void) {
        const token = {};

        const timerId = setTimeout(() => {
            this._timers.delete(token);
            callback();
        }, timeout);

        this._timers.set(token, timerId);
    }
}

export const delay = <T>(
    parentBind: () => Connection<T>,
    timeout: number
): [() => Subscription, () => T] => {
    type InnerType = {
        subscription: Subscription,
        connection: Connection<T>,
        timers: TimerList,
        value: T,
    };

    const inner: ValueLayzy<InnerType> = new ValueLayzy({
        create: (): InnerType => {
            const subscription = new Subscription();
    
            const connection: Connection<T> = parentBind();

            const timers = new TimerList();

            return {
                connection,
                subscription,
                timers,
                value: connection.getValue(),
            };
        },
        drop: (inner: InnerType) => {
            inner.connection.disconnect(),
            inner.timers.clear();
        }
    });

    inner.onNew((innerValue: InnerType) => {
        innerValue.subscription.onDown(() => {
            inner.clear();
        });

        innerValue.connection.onNotify(() => {

            console.info('NOTIFY');

            //Pobrać wartość z parenta możemy pobrać w momencie gdy sieć znajduje się w trybie "wyliczania"
            pushToRefresh(() => {
                const valueSnapshot = innerValue.connection.getValue();

                innerValue.timers.createNew(timeout, () => {
                    innerValue.value = valueSnapshot;
                    innerValue.subscription.notify();
                });
            });
        });
    });

    return [
        (): Subscription => inner.getValue().subscription,
        (): T => inner.getValue().value
    ];
};
