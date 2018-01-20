//@flow

import { ValueComputed } from './ValueComputed';
import { ValueConnection } from './ValueConnection';
import { Subscription } from './Subscription';
import { ValueLayzy } from './ValueLayzy';

export const combineValue = <A, B, R>(
    a: ValueComputed<A>,
    b: ValueComputed<B>,
    combine: ((a: A, b: B) => R)
): ValueComputed<R> => {
    //$FlowFixMe
    return combineValueArray([a,b], (arr) => combine(...arr));
}

export const combineValue3 = <A, B, C, R>(
    a: ValueComputed<A>,
    b: ValueComputed<B>,
    c: ValueComputed<C>,
    combine: ((a: A, b: B, c: C) => R)
): ValueComputed<R> => {   
    //$FlowFixMe
    return combineValueArray([a,b,c], (arr) => combine(...arr));
}

export const combineValueArray = <A,R>(
    arr: Array<ValueComputed<A>>,
    combine: ((arr: Array<A>) => R)
): ValueComputed<R> => {

    type ConnectionDataType = {
        subscription: Subscription,
        connections: Array<ValueConnection<A>>,
        result: ValueLayzy<R>
    };

    const state: ValueLayzy<ConnectionDataType> = new ValueLayzy({
        create: () => {
            const connections = arr.map(item => item.bind());

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

    return new ValueComputed(
        () => state.getValue().subscription,
        (): R => state.getValue().result.getValue()
    );
};