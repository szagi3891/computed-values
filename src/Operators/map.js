//@flow

import { Subscription } from '../Utils/Subscription';
import { Connection } from '../Connection';
import { Value } from '../Value';
import { ValueLayzy } from '../Utils/ValueLayzy';

export const map = <T,M>(
    parentBind: () => Connection<T>,
    mapFun: (value: T) => M
): [() => Subscription, () => M] => {

    type InnerType = {
        subscription: Subscription,
        connection: Connection<T>,
        result: ValueLayzy<M>,
    };

    const state: ValueLayzy<InnerType> = new ValueLayzy({
        create: () => {
            const connection = parentBind();

            return ({
                subscription: new Subscription(),
                connection,
                result: new ValueLayzy({
                    create: () => mapFun(connection.getValue()),
                    drop: null
                })
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
        (): Subscription => state.getValue().subscription,
        (): M => state.getValue().result.getValue()
    ];
};
