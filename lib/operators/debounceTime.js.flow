//@flow

import { ValueSubscription } from '../ValueSubscription';
import { ValueConnection } from '../ValueConnection';
import { Value } from '../Value';
import { ValueLayzy } from '../ValueLayzy';

export const debounceTime = <T>(
    parentBind: () => ValueConnection<T>,
    timeout: number
): [() => ValueSubscription, () => T] => {
    type InnerType = {
        subscription: ValueSubscription,
        timer: ValueLayzy<TimeoutID>,
        connection: ValueLayzy<ValueConnection<T>>
    };

    const inner: ValueLayzy<InnerType> = new ValueLayzy({
        create: (): InnerType => {
            const subscription = new ValueSubscription();

            const timer: ValueLayzy<TimeoutID> = new ValueLayzy({
                create: () => {
                    return setTimeout(() => {
                        subscription.notify();
                                                    //TODO - robić podobnie z timerem
                                                    //odpalić timer bez callbacka, a potem się dopiero podpiąć callback
                    }, timeout);
                },
                drop: (timerId: TimeoutID) => {
                    clearTimeout(timerId);
                }
            });
    
            const connection: ValueLayzy<ValueConnection<T>> = new ValueLayzy({
                create: () => parentBind(),
                drop: (conn) => {
                    conn.disconnect();
                }
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

    inner.onInicjalized((innerValue: InnerType) => {
        innerValue.subscription.onDown(() => {
            inner.clear();
        });

        innerValue.connection.onInicjalized((connectionInner) => {
            connectionInner.onNotify(() => {
                innerValue.timer.clear();
                innerValue.timer.getValue();
            });
        })
    });

    return [
        (): ValueSubscription => inner.getValue().subscription,
        (): T => inner.getValue().connection.getValue().getValue()
    ];
};
