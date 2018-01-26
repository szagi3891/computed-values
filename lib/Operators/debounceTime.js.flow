//@flow

import { Subscription } from '../Utils/Subscription';
import { Connection } from '../Connection';
import { Value } from '../Value';
import { ValueLayzy } from '../Utils/ValueLayzy';
import { Timer } from '../Utils/Timer';

export const debounceTime = <T>(
    parentBind: () => Connection<T>,
    timeout: number
): [() => Subscription, () => T] => {
    type InnerType = {
        subscription: Subscription,
        connection: Connection<T>,
        timer: ValueLayzy<Timer>,
        value: T,
    };

    const inner: ValueLayzy<InnerType> = new ValueLayzy({
        create: (): InnerType => {
            const subscription = new Subscription();
    
            const connection: Connection<T> = parentBind();

            const timer: ValueLayzy<Timer> = new ValueLayzy({
                create: () => new Timer(timeout),
                drop: (timer: Timer) => timer.drop()
            });

            return {
                subscription,
                connection,
                timer,
                value: connection.getValue()
            };
        },
        drop: (inner: InnerType) => {
            inner.timer.clear();
            inner.connection.disconnect();
        }
    });

    inner.onNew((innerValue: InnerType) => {
        innerValue.subscription.onDown(() => {
            inner.clear();
        });

        innerValue.timer.onNew((timer: Timer) => {
            timer.onReady(() => {
                innerValue.value = innerValue.connection.getValue()
                innerValue.subscription.notify();
            });
        });

        innerValue.connection.onNotify(() => {
            innerValue.timer.reset();
        })
    });

    return [
        (): Subscription => inner.getValue().subscription,
        (): T => inner.getValue().value
    ];
};
