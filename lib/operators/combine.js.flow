//@flow

import { Subscription } from '../Subscription';
import { ValueConnection } from '../ValueConnection';
import { Value } from '../Value';
import { ValueLayzy } from '../ValueLayzy';

export const combine = <A,R>(
    bindArr: Array<() => ValueConnection<A>>,
    combine: ((arr: Array<A>) => R)
): [() => Subscription, () => R] => {

    type ConnectionDataType = {
        subscription: Subscription,
        connections: Array<ValueConnection<A>>,
        result: ValueLayzy<R>
    };

    const state: ValueLayzy<ConnectionDataType> = new ValueLayzy({
        create: () => {
            const connections = bindArr.map(itemBind => itemBind());

            return {
                subscription: new Subscription(),
                connections: connections,
                result: new ValueLayzy({
                    create: () => {
                        return combine(
                            connections.map(connectionItem => connectionItem.getValue())
                        )
                    },
                    drop: null
                }),
            };
        },
        drop: (stateInner) => {
            for (const connectionItem of stateInner.connections) {
                connectionItem.disconnect();
            }
        }
    });

    state.onNew((stateInner) => {
        stateInner.subscription.onDown(() => {
            state.clear();
        });

        const notify = () => {
            stateInner.result.clear();
            stateInner.subscription.notify();
        };

        for (const connectionItem of stateInner.connections) {
            connectionItem.onNotify(notify);
        }
    });

    return [
        () => state.getValue().subscription,
        (): R => state.getValue().result.getValue()
    ];
}

