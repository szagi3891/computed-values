//@flow

import { Subscription } from '../Utils/Subscription';
import { Connection } from '../Connection';
import { ValueLayzy } from '../Utils/ValueLayzy';
import { Box } from '../Utils/Box';
import { ResultValue } from '../Utils/ResultValue';

type FuncIsEqualType<T> = (arg1: T, arg2: T) => bool;

const defaultIsEqual = <T>(arg1: T, arg2: T): bool => arg1 === arg2;

export const DistinctUntilChanged = <T>(
    parentBind: () => Connection<T>,
    isEqual: null | FuncIsEqualType<T>
): [() => Subscription, () => Box<T>] => {

    type InnerType = {
        subscription: Subscription,
        connection: Connection<T>,
        result: ResultValue<T, T>,
    };

    const state: ValueLayzy<InnerType> = new ValueLayzy({
        create: () => {
            const connection = parentBind();

            const getResult = (arg: Array<T>): T => arg[0];
            const resultIsEqual = isEqual === null ? defaultIsEqual : isEqual;
            const result: ResultValue<T, T> = new ResultValue([connection], getResult, resultIsEqual);

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
        (): Subscription => state.getValue().subscription,
        (): Box<T> => state.getValue().result.getResult()
    ];
};
