//@flow

import { Subscription } from '../Utils/Subscription';
import { Connection } from '../Connection';
import { ValueLayzy } from '../Utils/ValueLayzy';
import { Box } from '../Utils/Box';
import { ResultValue } from '../Utils/ResultValue';

export const map = <T, R>(
    parentBind: () => Connection<T>,
    mapFun: (value: T) => R
): [() => Subscription<void>, () => Box<R>] => {

    type InnerType = {
        subscription: Subscription<void>,
        connection: Connection<T>,
        result: ResultValue<T, R>,
    };

    const state: ValueLayzy<InnerType> = new ValueLayzy({
        create: () => {
            const connection = parentBind();

            const getResult = (arg: Array<T>): R => mapFun(arg[0]);
            const result: ResultValue<T, R> = new ResultValue([connection], getResult, null);

            return ({
                subscription: new Subscription(),
                connection,
                result
            });
        },
        drop: (inner: InnerType) => inner.connection.disconnect()
    });

    state.onNew((stateInner: InnerType) => {
        stateInner.connection.onNotify(() => {
            stateInner.result.setAsNotValid();
            stateInner.subscription.notify();
        });
        stateInner.subscription.onDown(() => {
            state.clear();
        });
    });

    return [
        (): Subscription<void> => state.getValue().subscription,
        (): Box<R> => state.getValue().result.getResult()
    ];
};
