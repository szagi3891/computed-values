//@flow

import { ValueSubscription } from '../ValueSubscription';
import { ValueConnection } from '../ValueConnection';
import { Value } from '../Value';
import { ValueLayzy } from '../ValueLayzy';

export const map = <T,M>(
    parentBind: () => ValueConnection<T>,
    mapFun: (value: T) => M
): [() => ValueSubscription, () => M] => {

    type InnerType = {
        connection: ValueConnection<T>,
        result: ValueLayzy<M>,
        subscription: ValueSubscription,
    };

    const state: ValueLayzy<InnerType> = new ValueLayzy({
        create: () => {
            const connection = parentBind();

            return ({
                connection,
                result: new ValueLayzy({
                    create: () => mapFun(connection.getValue()),
                    drop: null
                }),
                subscription: new ValueSubscription()
            });
        },
        drop: (inner: InnerType) => inner.connection.disconnect()
    });

    state.onNew((stateInner: InnerType) => {
        stateInner.connection.onNotify(() => {
            stateInner.result.clear();
            stateInner.subscription.notify();
        });
        stateInner.subscription.onDown(() => {
            state.clear();
        });
    });

    return [
        (): ValueSubscription => state.getValue().subscription,
        (): M => state.getValue().result.getValue()
    ];
};
