//@flow

import { Subscription } from '../Utils/Subscription';
import { Connection } from '../Connection';
import { ValueLayzy } from '../Utils/ValueLayzy';
import { Box } from '../Utils/Box';
import { ResultValue } from '../Utils/ResultValue';

export const combine = <A,R>(
    bindArr: Array<() => Connection<A>>,
    combine: ((arr: Array<A>) => R)
): [() => Subscription, () => Box<R>] => {

    type ConnectionDataType = {
        subscription: Subscription,
        connections: Array<Connection<A>>,
        result: ResultValue<A, R>
    };

    const state: ValueLayzy<ConnectionDataType> = new ValueLayzy({
        create: () => {
            const connections = bindArr.map(itemBind => itemBind());

            return {
                subscription: new Subscription(),
                connections: connections,
                result: new ResultValue(connections, combine)
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
            stateInner.result.setAsNotValid();
            stateInner.subscription.notify();
        };

        for (const connectionItem of stateInner.connections) {
            connectionItem.onNotify(notify);
        }
    });

    return [
        () => state.getValue().subscription,
        (): Box<R> => state.getValue().result.getResult()
    ];
}

