//@flow

import { Subscription } from '../Subscription';
import { ValueConnection } from '../ValueConnection';
import { Value } from '../Value';
import { ValueLayzy } from '../ValueLayzy';

export const switchMap = <T, K>(
    bindSelf: () => ValueConnection<T>,
    swithFunc: ((value: T) => ValueConnection<K>)
): [() => Subscription, () => K] => {

    type ConnectionDataType = {
        subscription: Subscription,
        self: ValueConnection<T>,
        target: ValueConnection<K>,
    };

    const getNewTarget = (self: ValueConnection<T>): ValueConnection<K> =>
        swithFunc(self.getValue());

    const state: ValueLayzy<ConnectionDataType> = new ValueLayzy({
        create: (): ConnectionDataType => {
            const self = bindSelf();
            return {
                subscription: new Subscription(),
                self,
                target: getNewTarget(self)
            }
        },
        drop: (conn: ConnectionDataType) => {
            conn.self.disconnect();
            conn.target.disconnect();
        }
    });

    state.onNew((innerState: ConnectionDataType) => {
        innerState.self.onNotify(() => {
            const newTarget = getNewTarget(innerState.self);

            newTarget.onNotify(() => {
                innerState.subscription.notify();
            });

            innerState.target.disconnect();
            innerState.target = newTarget;

            innerState.subscription.notify();
        });

        innerState.target.onNotify(() => {
            innerState.subscription.notify();
        });

        innerState.subscription.onDown(() => {
            state.clear();
        })
    });

    return [
        () => state.getValue().subscription,
        (): K => state.getValue().target.getValue()
    ];
}
