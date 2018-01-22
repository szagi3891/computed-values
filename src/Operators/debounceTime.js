//@flow

import { Subscription } from '../Utils/Subscription';
import { ValueConnection } from '../ValueConnection';
import { Value } from '../Value';
import { ValueLayzy } from '../ValueLayzy';
import { Timer } from '../Utils/Timer';

export const debounceTime = <T>(
    parentBind: () => ValueConnection<T>,
    timeout: number
): [() => Subscription, () => T] => {
    type InnerType = {
        subscription: Subscription,
        timer: ValueLayzy<Timer>,
        connection: ValueLayzy<ValueConnection<T>>,
        value: ValueLayzy<T>,
    };

    const inner: ValueLayzy<InnerType> = new ValueLayzy({
        create: (): InnerType => {
            const subscription = new Subscription();
    
            const connection: ValueLayzy<ValueConnection<T>> = new ValueLayzy({
                create: () => parentBind(),
                drop: (conn) => conn.disconnect()
            });

            const value = new ValueLayzy({
                create: () => connection.getValue().getValue(),
                drop: null
            });

            const timer: ValueLayzy<Timer> = new ValueLayzy({
                create: () => new Timer(timeout),
                drop: (timer: Timer) => timer.drop()
            });

            return {
                subscription,
                timer,
                connection,
                value
            };
        },
        drop: (inner: InnerType) => {
            inner.timer.clear();
            inner.connection.clear();
        }
    });

    inner.onNew((innerValue: InnerType) => {
        innerValue.subscription.onDown(() => {
            inner.clear();
        });

        innerValue.timer.onNew((timer: Timer) => {
            innerValue.value.clear();
            innerValue.subscription.notify();
        });

        innerValue.connection.onNew((connectionInner) => {
            connectionInner.onNotify(() => {
                innerValue.timer.clear();
                innerValue.timer.getValue();
            });
        })
    });

    return [
        (): Subscription => inner.getValue().subscription,
        (): T => inner.getValue().value.getValue()
    ];
};
