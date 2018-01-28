//@flow

import { Subscription } from '../Utils/Subscription';
import { Connection } from '../Connection';
import { ValueLayzy } from './ValueLayzy';

export const switchMap = <T, K>(
    bindSelf: () => Connection<T>,
    swithFunc: ((value: T) => Connection<K>)
): [() => Subscription, () => K] => {

    type ConnectionDataType = {
        subscription: Subscription,
        self: Connection<T>,
        target: Connection<K>,
    };

    const getNewTarget = (self: Connection<T>): Connection<K> =>
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
