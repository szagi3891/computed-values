//@flow

import { Subscription } from '../Subscription';
import { ValueConnection } from '../ValueConnection';
import { Value } from '../Value';
import { ValueLayzy } from '../ValueLayzy';

export const debounceTime = <T>(
    parentBind: () => ValueConnection<T>,
    timeout: number
): [() => Subscription, () => T] => {
    type InnerType = {
        subscription: Subscription,
        timer: ValueLayzy<TimeoutID>,
        connection: ValueLayzy<ValueConnection<T>>
    };

    const inner: ValueLayzy<InnerType> = new ValueLayzy({
        create: (): InnerType => {
            const subscription = new Subscription();

            const timer: ValueLayzy<TimeoutID> = new ValueLayzy({
                create: () => {
                    return setTimeout(() => {
                        subscription.notify();
                                                    //TODO - robić podobnie z timerem
                                                    //odpalić timer bez callbacka, a potem się dopiero podpiąć callback
                    }, timeout);
                },
                drop: (timerId: TimeoutID) => clearTimeout(timerId)
            });
    
            const connection: ValueLayzy<ValueConnection<T>> = new ValueLayzy({
                create: () => parentBind(),
                drop: (conn) => conn.disconnect()
            });

            return {
                subscription,
                timer,
                connection
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

        innerValue.connection.onNew((connectionInner) => {
            connectionInner.onNotify(() => {
                innerValue.timer.clear();
                innerValue.timer.getValue();
            });
        })
    });

    return [
        (): Subscription => inner.getValue().subscription,
        (): T => inner.getValue().connection.getValue().getValue()
    ];
};
